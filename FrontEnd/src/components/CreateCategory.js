import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Category name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await campaignService.createCampaignCategory(formData);
      
      // Navigate to success page with category data
      navigate('/admin/create/category/success', { 
        state: { 
          categoryData: response,
          message: 'Category created successfully!'
        }
      });
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to create category. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-danger text-white">
              <h3 className="mb-0">
                <i className="fas fa-tags me-2"></i>
                Create New Category
              </h3>
            </div>
            <div className="card-body p-4">
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <button 
                      className="btn btn-link p-0 text-decoration-none"
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      Admin Dashboard
                    </button>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Create Category
                  </li>
                </ol>
              </nav>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {/* Global Error */}
                {errors.submit && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {errors.submit}
                  </div>
                )}

                {/* Category Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold">
                    <i className="fas fa-tag me-2 text-danger"></i>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter category name (e.g., Education, Healthcare, Environment)"
                    disabled={loading}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      {errors.name}
                    </div>
                  )}
                  <small className="form-text text-muted">
                    Choose a clear, descriptive name for the category
                  </small>
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">
                    <i className="fas fa-align-left me-2 text-danger"></i>
                    Description *
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what types of campaigns will belong to this category..."
                    disabled={loading}
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description}
                    </div>
                  )}
                  <small className="form-text text-muted">
                    Provide a detailed description to help users understand this category
                  </small>
                </div>

                {/* Preview Card */}
                {(formData.name || formData.description) && (
                  <div className="mb-4">
                    <h6 className="text-muted mb-3">Preview:</h6>
                    <div className="card border-secondary">
                      <div className="card-body">
                        <h6 className="card-title text-danger">
                          {formData.name || 'Category Name'}
                        </h6>
                        <p className="card-text text-muted small">
                          {formData.description || 'Category description will appear here...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="d-flex gap-3 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg px-4"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger btn-lg px-4"
                    disabled={loading || !formData.name.trim() || !formData.description.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>
                        Create Category
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Info Section */}
              <div className="mt-5 p-3 bg-light rounded">
                <h6 className="text-muted mb-2">
                  <i className="fas fa-info-circle me-2"></i>
                  Category Guidelines
                </h6>
                <ul className="small text-muted mb-0">
                  <li>Choose unique, descriptive names that don't overlap with existing categories</li>
                  <li>Write clear descriptions that help campaign creators choose the right category</li>
                  <li>Categories help donors find campaigns they're interested in supporting</li>
                  <li>Once created, categories can be used immediately for new campaigns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;