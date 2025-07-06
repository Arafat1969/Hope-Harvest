import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { campaignService } from '../services/campaignService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  formCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0'
  },
  goodsCard: {
    borderRadius: '0.5rem',
    border: '1px solid #dee2e6',
    backgroundColor: '#f8f9fa'
  }
};

const AdminCreateEventPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    locationAddress: '',
    locationCity: '',
    locationDistrict: '',
    status: 'SCHEDULED',
    budgetAmount: '',
    externalCampaignId: '',
    requiredGoods: []
  });

  const [newGood, setNewGood] = useState({
    item: '',
    quantity: '',
    unit: '',
    unitPrice: '',
    totalPrice: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setCampaignsLoading(true);
      const response = await campaignService.getAllCampaignsAdmin();
      const campaignsData = response.data || response || [];
      console.log('Campaigns fetched:', campaignsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError('Failed to load campaigns. Please try again.');
    } finally {
      setCampaignsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGoodChange = (e) => {
    const { name, value } = e.target;
    setNewGood(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate total price when quantity or unit price changes
      if (name === 'quantity' || name === 'unitPrice') {
        const quantity = parseFloat(name === 'quantity' ? value : updated.quantity) || 0;
        const unitPrice = parseFloat(name === 'unitPrice' ? value : updated.unitPrice) || 0;
        updated.totalPrice = (quantity * unitPrice).toFixed(2);
      }
      
      return updated;
    });
  };

  const addRequiredGood = () => {
    if (newGood.item.trim() && newGood.quantity && newGood.unit.trim() && newGood.unitPrice) {
      const goodToAdd = {
        item: newGood.item.trim(),
        quantity: parseInt(newGood.quantity),
        unit: newGood.unit.trim(),
        unitPrice: parseFloat(newGood.unitPrice),
        totalPrice: parseFloat(newGood.totalPrice) || (parseInt(newGood.quantity) * parseFloat(newGood.unitPrice))
      };

      setFormData(prev => ({
        ...prev,
        requiredGoods: [...prev.requiredGoods, goodToAdd]
      }));

      // Reset the form
      setNewGood({
        item: '',
        quantity: '',
        unit: '',
        unitPrice: '',
        totalPrice: ''
      });
    } else {
      alert('Please fill in all required good fields');
    }
  };

  const removeRequiredGood = (index) => {
    setFormData(prev => ({
      ...prev,
      requiredGoods: prev.requiredGoods.filter((_, i) => i !== index)
    }));
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return null;
    
    // Combine date and time, then convert to ZonedDateTime format
    const dateTime = new Date(`${dateStr}T${timeStr}`);
    return dateTime.toISOString(); // This will be in UTC, adjust as needed for your timezone
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = 'End date must be after start date';
    }

    if (!formData.locationAddress.trim()) {
      errors.locationAddress = 'Location address is required';
    }

    if (!formData.locationCity.trim()) {
      errors.locationCity = 'City is required';
    }

    if (!formData.locationDistrict.trim()) {
      errors.locationDistrict = 'District is required';
    }

    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      errors.budgetAmount = 'Budget amount must be greater than 0';
    }

    if (!formData.externalCampaignId) {
      errors.externalCampaignId = 'Campaign selection is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toZonedISOString = (datetimeLocal) => {
	return new Date(datetimeLocal).toISOString(); // gives UTC ISO string with Z
	};

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate:  toZonedISOString(formData.startDate),
        endDate: toZonedISOString(formData.endDate),
        locationAddress: formData.locationAddress.trim(),
        locationCity: formData.locationCity.trim(),
        locationDistrict: formData.locationDistrict.trim(),
        status: formData.status,
        budgetAmount: parseFloat(formData.budgetAmount),
        requiredGoods: formData.requiredGoods
      };

      console.log('Creating event with data:', eventData);
      console.log('For campaign ID:', formData.externalCampaignId);
      
      const response = await eventService.createEventForCampaign(formData.externalCampaignId, eventData);
      console.log('Event created successfully:', response);

      // Navigate to success page with event data
      navigate('/admin/create/events/success', { 
        state: { eventData: response.data || response } 
      });

    } catch (error) {
      console.error('Error creating event:', error);
      setError(error.response?.data?.message || 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalBudgetFromGoods = () => {
    return formData.requiredGoods.reduce((sum, good) => sum + (good.totalPrice || 0), 0);
  };

  if (campaignsLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="text-danger mb-1">
                    <i className="fas fa-calendar-plus me-2"></i>
                    Create New Event
                  </h2>
                  <p className="text-muted mb-0">
                    Create a new event for an existing campaign
                  </p>
                </div>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => navigate('/admin-dashboard')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Creation Form */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.formCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-edit me-2"></i>
                Event Information
              </h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Campaign Selection */}
                <div className="row mb-4">
                  <div className="col-12">
                    <label htmlFor="externalCampaignId" className="form-label">
                      Select Campaign <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.externalCampaignId ? 'is-invalid' : ''}`}
                      id="externalCampaignId"
                      name="externalCampaignId"
                      value={formData.externalCampaignId}
                      onChange={handleInputChange}
                    >
                      <option value="">Choose a campaign for this event</option>
                      {campaigns.map(campaign => (
                        <option key={campaign.campaignId} value={campaign.campaignId}>
                          {campaign.title} (Goal: {new Intl.NumberFormat('en-BD', {
                            style: 'currency',
                            currency: 'BDT',
                            minimumFractionDigits: 0
                          }).format(campaign.goalAmount)})
                        </option>
                      ))}
                    </select>
                    {formErrors.externalCampaignId && (
                      <div className="invalid-feedback">{formErrors.externalCampaignId}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Title */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="title" className="form-label">
                      Event Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter event title"
                    />
                    {formErrors.title && (
                      <div className="invalid-feedback">{formErrors.title}</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="status" className="form-label">
                      Event Status <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="UPCOMING">Upcoming</option>
                      <option value="ONGOING">Ongoing</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">
                    Event Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed event description"
                  ></textarea>
                  {formErrors.description && (
                    <div className="invalid-feedback">{formErrors.description}</div>
                  )}
                </div>

                <div className="row">
                  {/* Start Date */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date & Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString()}
                    />
                    {formErrors.startDate && (
                      <div className="invalid-feedback">{formErrors.startDate}</div>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endDate" className="form-label">
                      End Date & Time <span className="text-danger">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate || new Date().toISOString().slice(0, 16)}
                    />
                    {formErrors.endDate && (
                      <div className="invalid-feedback">{formErrors.endDate}</div>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="locationAddress" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.locationAddress ? 'is-invalid' : ''}`}
                      id="locationAddress"
                      name="locationAddress"
                      value={formData.locationAddress}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                    />
                    {formErrors.locationAddress && (
                      <div className="invalid-feedback">{formErrors.locationAddress}</div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="locationCity" className="form-label">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.locationCity ? 'is-invalid' : ''}`}
                      id="locationCity"
                      name="locationCity"
                      value={formData.locationCity}
                      onChange={handleInputChange}
                      placeholder="Enter city"
                    />
                    {formErrors.locationCity && (
                      <div className="invalid-feedback">{formErrors.locationCity}</div>
                    )}
                  </div>

                  <div className="col-md-3 mb-3">
                    <label htmlFor="locationDistrict" className="form-label">
                      District <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.locationDistrict ? 'is-invalid' : ''}`}
                      id="locationDistrict"
                      name="locationDistrict"
                      value={formData.locationDistrict}
                      onChange={handleInputChange}
                      placeholder="Enter district"
                    />
                    {formErrors.locationDistrict && (
                      <div className="invalid-feedback">{formErrors.locationDistrict}</div>
                    )}
                  </div>
                </div>

                {/* Budget Amount */}
                <div className="col-md-6 mb-4">
                  <label htmlFor="budgetAmount" className="form-label">
                    Budget Amount (BDT) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${formErrors.budgetAmount ? 'is-invalid' : ''}`}
                    id="budgetAmount"
                    name="budgetAmount"
                    value={formData.budgetAmount}
                    onChange={handleInputChange}
                    placeholder="Enter budget amount"
                    min="1"
                    step="0.01"
                  />
                  {formErrors.budgetAmount && (
                    <div className="invalid-feedback">{formErrors.budgetAmount}</div>
                  )}
                  {getTotalBudgetFromGoods() > 0 && (
                    <div className="form-text">
                      Total from required goods: {new Intl.NumberFormat('en-BD', {
                        style: 'currency',
                        currency: 'BDT',
                        minimumFractionDigits: 0
                      }).format(getTotalBudgetFromGoods())}
                    </div>
                  )}
                </div>

                {/* Required Goods Section */}
                <div className="col-12 mb-4">
                  <h6 className="text-danger mb-3">
                    <i className="fas fa-boxes me-2"></i>
                    Required Goods
                  </h6>

                  {/* Add New Good Form */}
                  <div className="card" style={styles.goodsCard}>
                    <div className="card-body">
                      <h6 className="card-title">Add Required Good</h6>
                      <div className="row">
                        <div className="col-md-3 mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Item name"
                            value={newGood.item}
                            onChange={(e) => handleGoodChange({ target: { name: 'item', value: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-2 mb-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Quantity"
                            value={newGood.quantity}
                            onChange={(e) => handleGoodChange({ target: { name: 'quantity', value: e.target.value } })}
                            min="1"
                          />
                        </div>
                        <div className="col-md-2 mb-2">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Unit (kg, pcs, etc.)"
                            value={newGood.unit}
                            onChange={(e) => handleGoodChange({ target: { name: 'unit', value: e.target.value } })}
                          />
                        </div>
                        <div className="col-md-2 mb-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Unit Price"
                            value={newGood.unitPrice}
                            onChange={(e) => handleGoodChange({ target: { name: 'unitPrice', value: e.target.value } })}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-md-2 mb-2">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Total Price"
                            value={newGood.totalPrice}
                            readOnly
                            style={{ backgroundColor: '#e9ecef' }}
                          />
                        </div>
                        <div className="col-md-1 mb-2">
                          <button
                            type="button"
                            className="btn btn-success w-100"
                            onClick={addRequiredGood}
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Display Added Goods */}
                  {formData.requiredGoods.length > 0 && (
                    <div className="mt-3">
                      <h6>Required Goods List ({formData.requiredGoods.length} items)</h6>
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Quantity</th>
                              <th>Unit</th>
                              <th>Unit Price</th>
                              <th>Total Price</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.requiredGoods.map((good, index) => (
                              <tr key={index}>
                                <td>{good.item}</td>
                                <td>{good.quantity}</td>
                                <td>{good.unit}</td>
                                <td>{new Intl.NumberFormat('en-BD', {
                                  style: 'currency',
                                  currency: 'BDT',
                                  minimumFractionDigits: 0
                                }).format(good.unitPrice)}</td>
                                <td>{new Intl.NumberFormat('en-BD', {
                                  style: 'currency',
                                  currency: 'BDT',
                                  minimumFractionDigits: 0
                                }).format(good.totalPrice)}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeRequiredGood(index)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <th colSpan="4">Total Cost:</th>
                              <th>{new Intl.NumberFormat('en-BD', {
                                style: 'currency',
                                currency: 'BDT',
                                minimumFractionDigits: 0
                              }).format(getTotalBudgetFromGoods())}</th>
                              <th></th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-12">
                  <div className="d-flex gap-3">
                    <button
                      type="submit"
                      className="btn btn-danger"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Creating Event...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Create Event
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin-dashboard')}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateEventPage;