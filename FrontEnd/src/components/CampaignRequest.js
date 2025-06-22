import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';

const CampaignRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    externalUserId: '',
    title: '',
    description: '',
    goal: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    expectedImpact: '',
    proposerPhone: '',
    proposerEmail: '',
    status: 'PENDING'
  });

  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    fetchCategories();
    // Get user ID from localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      setFormData(prev => ({ ...prev, externalUserId: userId }));
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await campaignService.getCampaignCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Set some default categories if API fails
      setCategories([
        { categoryId: '1', name: 'Education' },
        { categoryId: '2', name: 'Healthcare' },
        { categoryId: '3', name: 'Emergency Relief' },
        { categoryId: '4', name: 'Community Development' }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Campaign title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Campaign description is required';
    }

    if (!formData.goal || parseFloat(formData.goal) <= 0) {
      newErrors.goal = 'Goal amount must be greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!formData.expectedImpact.trim()) {
      newErrors.expectedImpact = 'Expected impact is required';
    }

    if (!formData.proposerPhone.trim()) {
      newErrors.proposerPhone = 'Phone number is required';
    }

    if (!formData.proposerEmail.trim()) {
      newErrors.proposerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.proposerEmail)) {
      newErrors.proposerEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        externalUserId: formData.externalUserId,
        title: formData.title,
        description: formData.description,
        goal: parseFloat(formData.goal),
        categoryId: formData.categoryId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        expectedImpact: formData.expectedImpact,
        proposerPhone: formData.proposerPhone,
        proposerEmail: formData.proposerEmail,
        status: 'PENDING'
      };

      const response = await campaignService.requestCampaign(requestData);
	  console.log('Campaign request response:', response);
      
      setResponseData(response);
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('Error submitting campaign request:', error);
      setErrors({ submit: 'Failed to submit campaign request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (submitSuccess && responseData) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body text-center py-5">
                <i className="fas fa-check-circle fa-4x text-success mb-4"></i>
                <h2 className="text-success mb-3">Campaign Request Submitted Successfully!</h2>
                
                <div className="bg-light p-4 rounded mb-4">
                  <h5 className="mb-3">Request Details:</h5>
                  <div className="row text-start">
                    <div className="col-sm-6">
                      <strong>Request ID:</strong>
                      <p className="text-muted">{responseData.data.requestId}</p>
                    </div>
                    <div className="col-sm-6">
                      <strong>Title:</strong>
                      <p className="text-muted">{responseData.data.title}</p>
                    </div>
                    <div className="col-sm-6">
                      <strong>Status:</strong>
                      <span className="badge bg-warning">{responseData.data.status}</span>
                    </div>
                    <div className="col-sm-6">
                      <strong>Start Date:</strong>
                      <p className="text-muted">{responseData.data.startDate}</p>
                    </div>
                    <div className="col-sm-6">
                      <strong>End Date:</strong>
                      <p className="text-muted">{responseData.data.endDate}</p>
                    </div>
                    {responseData.feedback && (
                      <div className="col-12">
                        <strong>Feedback:</strong>
                        <p className="text-muted">{responseData.data.feedback}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-muted mb-4">
                  Your campaign request has been submitted for review. You will be notified of the status via email.
                </p>
                
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleBackToDashboard}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-success text-white text-center">
              <h2 className="mb-0">
                <i className="fas fa-bullhorn me-2"></i>
                Request New Campaign
              </h2>
              <p className="mb-0 mt-2">Submit your campaign proposal for approval</p>
            </div>
            
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Campaign Title */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Campaign Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter campaign title"
                    maxLength={255}
                  />
                  {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                </div>

                {/* Campaign Description */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Campaign Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your campaign and its purpose"
                    rows={4}
                  />
                  {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                {/* Goal Amount and Category */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="goal" className="form-label">
                        Goal Amount (BDT) <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control ${errors.goal ? 'is-invalid' : ''}`}
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        placeholder="Enter fundraising goal"
                        min="1"
                        step="0.01"
                      />
                      {errors.goal && <div className="invalid-feedback">{errors.goal}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="categoryId" className="form-label">
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.categoryId} value={category.categoryId}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                    </div>
                  </div>
                </div>

                {/* Start Date and End Date */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="startDate" className="form-label">
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="endDate" className="form-label">
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                      />
                      {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                    </div>
                  </div>
                </div>

                {/* Expected Impact */}
                <div className="mb-3">
                  <label htmlFor="expectedImpact" className="form-label">
                    Expected Impact <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.expectedImpact ? 'is-invalid' : ''}`}
                    id="expectedImpact"
                    name="expectedImpact"
                    value={formData.expectedImpact}
                    onChange={handleInputChange}
                    placeholder="Describe the expected impact of your campaign"
                    rows={3}
                  />
                  {errors.expectedImpact && <div className="invalid-feedback">{errors.expectedImpact}</div>}
                </div>

                {/* Phone and Email */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="proposerPhone" className="form-label">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        className={`form-control ${errors.proposerPhone ? 'is-invalid' : ''}`}
                        id="proposerPhone"
                        name="proposerPhone"
                        value={formData.proposerPhone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                      />
                      {errors.proposerPhone && <div className="invalid-feedback">{errors.proposerPhone}</div>}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="proposerEmail" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className={`form-control ${errors.proposerEmail ? 'is-invalid' : ''}`}
                        id="proposerEmail"
                        name="proposerEmail"
                        value={formData.proposerEmail}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                      />
                      {errors.proposerEmail && <div className="invalid-feedback">{errors.proposerEmail}</div>}
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {errors.submit}
                  </div>
                )}

                {/* Form Actions */}
                <div className="d-flex justify-content-center gap-3 mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignRequest;
