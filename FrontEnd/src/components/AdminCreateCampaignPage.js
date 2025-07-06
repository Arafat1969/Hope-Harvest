import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  imagePreview: {
    maxWidth: '100px',
    maxHeight: '100px',
    objectFit: 'cover',
    borderRadius: '0.5rem'
  }
};

const AdminCreateCampaignPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    details: '',
    goalAmount: '',
    startDate: '',
    endDate: '',
    categoryId: '',
    expectedImpact: '',
    imageUrls: []
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await campaignService.getAllCampaignCategoriesAdmin();
      const categoriesData = response.data || response || [];
      console.log('Categories fetched:', categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Using default options.');
      // Set some default categories if API fails
      setCategories([
        { categoryId: 'default-1', name: 'Health & Medical' },
        { categoryId: 'default-2', name: 'Education' },
        { categoryId: 'default-3', name: 'Emergency Relief' },
        { categoryId: 'default-4', name: 'Community Development' }
      ]);
    } finally {
      setCategoriesLoading(false);
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

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      // Basic URL validation
      try {
        new URL(imageUrlInput.trim());
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, imageUrlInput.trim()]
        }));
        setImageUrlInput('');
      } catch (error) {
        alert('Please enter a valid URL');
      }
    }
  };

  const handleRemoveImageUrl = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.details.trim()) {
      errors.details = 'Details are required';
    }

    if (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0) {
      errors.goalAmount = 'Goal amount must be greater than 0';
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

    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }

    if (!formData.expectedImpact.trim()) {
      errors.expectedImpact = 'Expected impact is required';
    }

    if (formData.imageUrls.length === 0) {
      errors.imageUrls = 'At least one image URL is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const campaignData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        details: formData.details.trim(),
        goalAmount: parseFloat(formData.goalAmount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        categoryId: formData.categoryId,
        expectedImpact: formData.expectedImpact.trim(),
        imageUrls: formData.imageUrls
      };

      console.log('Creating campaign with data:', campaignData);
      const response = await campaignService.createCampaign(campaignData);
      console.log('Campaign created successfully:', response);

      // Navigate to success page with campaign data
      navigate('/admin/create/campaigns/success', { 
        state: { campaignData: response.data || response } 
      });

    } catch (error) {
      console.error('Error creating campaign:', error);
      setError(error.response?.data?.message || 'Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (categoriesLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading categories...</p>
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
                    <i className="fas fa-bullhorn me-2"></i>
                    Create New Campaign
                  </h2>
                  <p className="text-muted mb-0">
                    Create and launch a new fundraising campaign
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

      {/* Campaign Creation Form */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.formCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-edit me-2"></i>
                Campaign Information
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
                <div className="row">
                  {/* Title */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="title" className="form-label">
                      Campaign Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter campaign title"
                    />
                    {formErrors.title && (
                      <div className="invalid-feedback">{formErrors.title}</div>
                    )}
                  </div>

                  {/* Goal Amount */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="goalAmount" className="form-label">
                      Goal Amount (BDT) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${formErrors.goalAmount ? 'is-invalid' : ''}`}
                      id="goalAmount"
                      name="goalAmount"
                      value={formData.goalAmount}
                      onChange={handleInputChange}
                      placeholder="Enter goal amount"
                      min="1"
                      step="0.01"
                    />
                    {formErrors.goalAmount && (
                      <div className="invalid-feedback">{formErrors.goalAmount}</div>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Start Date */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="startDate" className="form-label">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.startDate ? 'is-invalid' : ''}`}
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      min={getTodayDate()}
                    />
                    {formErrors.startDate && (
                      <div className="invalid-feedback">{formErrors.startDate}</div>
                    )}
                  </div>

                  {/* End Date */}
                  <div className="col-md-6 mb-3">
                    <label htmlFor="endDate" className="form-label">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${formErrors.endDate ? 'is-invalid' : ''}`}
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      min={formData.startDate || getTodayDate()}
                    />
                    {formErrors.endDate && (
                      <div className="invalid-feedback">{formErrors.endDate}</div>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div className="col-12 mb-3">
                  <label htmlFor="categoryId" className="form-label">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${formErrors.categoryId ? 'is-invalid' : ''}`}
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.categoryId && (
                    <div className="invalid-feedback">{formErrors.categoryId}</div>
                  )}
                </div>

                {/* Description */}
                <div className="col-12 mb-3">
                  <label htmlFor="description" className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter campaign description"
                  ></textarea>
                  {formErrors.description && (
                    <div className="invalid-feedback">{formErrors.description}</div>
                  )}
                </div>

                {/* Details */}
                <div className="col-12 mb-3">
                  <label htmlFor="details" className="form-label">
                    Detailed Information <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${formErrors.details ? 'is-invalid' : ''}`}
                    id="details"
                    name="details"
                    rows="5"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter detailed campaign information"
                  ></textarea>
                  {formErrors.details && (
                    <div className="invalid-feedback">{formErrors.details}</div>
                  )}
                </div>

                {/* Expected Impact */}
                <div className="col-12 mb-3">
                  <label htmlFor="expectedImpact" className="form-label">
                    Expected Impact <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${formErrors.expectedImpact ? 'is-invalid' : ''}`}
                    id="expectedImpact"
                    name="expectedImpact"
                    rows="3"
                    value={formData.expectedImpact}
                    onChange={handleInputChange}
                    placeholder="Describe the expected impact of this campaign"
                  ></textarea>
                  {formErrors.expectedImpact && (
                    <div className="invalid-feedback">{formErrors.expectedImpact}</div>
                  )}
                </div>

                {/* Image URLs */}
                <div className="col-12 mb-3">
                  <label className="form-label">
                    Campaign Images <span className="text-danger">*</span>
                  </label>
                  
                  {/* Add Image URL Input */}
                  <div className="input-group mb-3">
                    <input
                      type="url"
                      className="form-control"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Enter image URL (https://...)"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleAddImageUrl}
                    >
                      <i className="fas fa-plus me-1"></i>
                      Add Image
                    </button>
                  </div>

                  {/* Display Added Images */}
                  {formData.imageUrls.length > 0 && (
                    <div className="row">
                      {formData.imageUrls.map((url, index) => (
                        <div key={index} className="col-md-4 mb-3">
                          <div className="card">
                            <img
                              src={url}
                              alt={`Campaign image ${index + 1}`}
                              className="card-img-top"
                              style={styles.imagePreview}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/100x100?text=Invalid+Image';
                              }}
                            />
                            <div className="card-body p-2">
                              <button
                                type="button"
                                className="btn btn-danger btn-sm w-100"
                                onClick={() => handleRemoveImageUrl(index)}
                              >
                                <i className="fas fa-trash me-1"></i>
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {formErrors.imageUrls && (
                    <div className="text-danger small">{formErrors.imageUrls}</div>
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
                          Creating Campaign...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save me-2"></i>
                          Create Campaign
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

export default AdminCreateCampaignPage;