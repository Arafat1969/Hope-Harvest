import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateCategorySuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryData, message } = location.state || {};

  useEffect(() => {
    // Redirect if no category data (direct access)
    if (!categoryData) {
      navigate('/admin/dashboard');
    }
  }, [categoryData, navigate]);

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleCreateAnother = () => {
    navigate('/admin/create/category');
  };

  const handleViewCategories = () => {
    navigate('/admin/categories'); // Assuming you have a categories list page
  };

  if (!categoryData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center p-5">
              {/* Success Icon */}
              <div className="mb-4">
                <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="fas fa-check text-white fa-2x"></i>
                </div>
              </div>

              {/* Success Message */}
              <h2 className="text-success mb-3">Category Created Successfully!</h2>
              <p className="text-muted mb-4">
                {message || 'Your new category has been created and is now available for campaigns.'}
              </p>

              {/* Category Details Card */}
              <div className="card bg-light border-0 mb-4">
                <div className="card-body">
                  <h5 className="text-danger mb-3">
                    <i className="fas fa-tag me-2"></i>
                    Category Details
                  </h5>
                  
                  <div className="row text-start">
                    <div className="col-md-6 mb-3">
                      <strong className="text-muted">Category ID:</strong>
                      <div className="font-monospace small bg-white p-2 rounded mt-1">
                        {categoryData.categoryId}
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <strong className="text-muted">Category Name:</strong>
                      <div className="fw-bold mt-1">{categoryData.name}</div>
                    </div>
                    <div className="col-12">
                      <strong className="text-muted">Description:</strong>
                      <div className="mt-1">{categoryData.description}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">What would you like to do next?</h6>
                <div className="d-flex flex-wrap gap-3 justify-content-center">
                  <button
                    className="btn btn-outline-success btn-lg"
                    onClick={handleCreateAnother}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create Another Category
                  </button>
                  <button
                    className="btn btn-outline-info btn-lg"
                    onClick={() => navigate('/admin/create/campaigns')}
                  >
                    <i className="fas fa-bullhorn me-2"></i>
                    Create Campaign
                  </button>
                  <button
                    className="btn btn-outline-secondary btn-lg"
                    onClick={handleViewCategories}
                  >
                    <i className="fas fa-list me-2"></i>
                    View All Categories
                  </button>
                </div>
              </div>

              {/* Back to Dashboard */}
              <div className="mt-4">
                <button
                  className="btn btn-danger btn-lg px-4"
                  onClick={handleBackToDashboard}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Admin Dashboard
                </button>
              </div>

              {/* Success Stats */}
              <div className="mt-5 p-3 bg-success bg-opacity-10 rounded">
                <div className="row text-center">
                  <div className="col-4">
                    <i className="fas fa-check-circle text-success fa-2x mb-2"></i>
                    <div className="small text-muted">Status</div>
                    <div className="fw-bold text-success">Created</div>
                  </div>
                  <div className="col-4">
                    <i className="fas fa-clock text-info fa-2x mb-2"></i>
                    <div className="small text-muted">Created At</div>
                    <div className="fw-bold">{new Date().toLocaleString()}</div>
                  </div>
                  <div className="col-4">
                    <i className="fas fa-eye text-primary fa-2x mb-2"></i>
                    <div className="small text-muted">Visibility</div>
                    <div className="fw-bold text-primary">Public</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategorySuccess;