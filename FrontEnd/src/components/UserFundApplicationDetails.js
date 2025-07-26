import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fundApplicationService } from '../services/fundApplicationService';

const UserFundApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching fund application details for ID:', applicationId);
      const response = await fundApplicationService.getFundApplication(applicationId);
      
      console.log('Fund application details response:', response);
      const applicationData = response.data || response;
      setApplication(applicationData);
      
    } catch (error) {
      console.error('Error fetching fund application details:', error);
      setError(
        error.response?.data?.message ||
        'Failed to load fund application details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    //if (!amount ||) return 'N/A';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return {
          badge: 'bg-warning text-dark',
          icon: 'fas fa-clock',
          text: 'Under Review'
        };
      case 'APPROVED':
        return {
          badge: 'bg-success',
          icon: 'fas fa-check-circle',
          text: 'Approved'
        };
      case 'REJECTED':
        return {
          badge: 'bg-danger',
          icon: 'fas fa-times-circle',
          text: 'Rejected'
        };
      case 'DISBURSED':
        return {
          badge: 'bg-primary',
          icon: 'fas fa-money-check-alt',
          text: 'Disbursed'
        };
      case 'VERIFIED':
        return {
          badge: 'bg-info',
          icon: 'fas fa-shield-alt',
          text: 'Verified'
        };
      default:
        return {
          badge: 'bg-secondary',
          icon: 'fas fa-question',
          text: status || 'Unknown'
        };
    }
  };

  const handleBackToApplications = () => {
    navigate('/my-fund-applications');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-muted">Loading Fund Application Details...</h4>
              <p className="text-muted">Please wait while we fetch your application information</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Error Loading Application</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button className="btn btn-danger me-2" onClick={fetchApplicationDetails}>
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button className="btn btn-secondary" onClick={handleBackToApplications}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Application Not Found</h4>
              <p>The requested fund application could not be found.</p>
              <button className="btn btn-secondary mt-3" onClick={handleBackToApplications}>
                <i className="fas fa-arrow-left me-2"></i>Back to Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(application.status);

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h1 className="h3 mb-2">Fund Application Details</h1>
                    <p className="mb-0 opacity-75">Application ID: {application.applicationId}</p>
                  </div>
                  <div className="text-end">
                    <button 
                      className="btn btn-light me-2"
                      onClick={handleBackToApplications}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      All Applications
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={handleBackToDashboard}
                    >
                      <i className="fas fa-home me-2"></i>
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Main Application Details */}
          <div className="col-lg-8 mb-4">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <h5 className="card-title text-success mb-4">
                  <i className="fas fa-file-invoice-dollar me-2"></i>
                  Application Information
                </h5>

                {/* Status Section */}
                <div className="row mb-4">
                  <div className="col-12">
                    <div className="alert alert-light border" style={{ borderRadius: '12px' }}>
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <span className={`badge ${statusInfo.badge} p-2`} style={{ fontSize: '1rem' }}>
                            <i className={`${statusInfo.icon} me-2`}></i>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div>
                          <h6 className="mb-1">Current Status</h6>
                          <small className="text-muted">
                            {application.status === 'PENDING' 
                              ? 'Your application is being reviewed by our team.'
                              : `Your application status has been updated to ${statusInfo.text.toLowerCase()}.`
                            }
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purpose and Amount */}
                <div className="row mb-4">
                  <div className="col-md-8">
                    <h6 className="text-success mb-2">
                      <i className="fas fa-bullseye me-2"></i>
                      Purpose of Application
                    </h6>
                    <div className="bg-light p-3 rounded">
                      <p className="mb-0">{application.purpose}</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h6 className="text-success mb-2">
                      <i className="fas fa-money-bill-wave me-2"></i>
                      Requested Amount
                    </h6>
                    <div className="bg-light p-3 rounded text-center">
                      <h4 className="text-primary mb-0">{formatCurrency(application.amount)}</h4>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="mb-4">
                  <h6 className="text-success mb-3">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Address Information
                  </h6>
                  <div className="row">
                    <div className="col-md-3">
                      <small className="text-muted d-block">Union</small>
                      <p className="mb-2">{application.union || 'N/A'}</p>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted d-block">Upazilla</small>
                      <p className="mb-2">{application.upazilla || 'N/A'}</p>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted d-block">District</small>
                      <p className="mb-2">{application.district || 'N/A'}</p>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted d-block">Postal Code</small>
                      <p className="mb-2">{application.postalCode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Submission Date */}
                <div className="mb-4">
                  <h6 className="text-success mb-2">
                    <i className="fas fa-calendar-alt me-2"></i>
                    Submission Date
                  </h6>
                  <p className="mb-0">{formatDate(application.submissionDate)}</p>
                </div>

                {/* Feedback Section */}
                {(application.status !== 'PENDING' && application.feedback) && (
                  <div className="mb-4">
                    <h6 className="text-success mb-2">
                      <i className="fas fa-comment-alt me-2"></i>
                      Feedback
                    </h6>
                    <div className="alert alert-info" style={{ borderRadius: '12px' }}>
                      <p className="mb-0">{application.feedback}</p>
                    </div>
                  </div>
                )}

                {/* No Feedback Message for Pending */}
                {application.status === 'PENDING' && (
                  <div className="mb-4">
                    <h6 className="text-success mb-2">
                      <i className="fas fa-comment-alt me-2"></i>
                      Feedback
                    </h6>
                    <div className="alert alert-warning" style={{ borderRadius: '12px' }}>
                      <p className="mb-0">
                        <i className="fas fa-clock me-2"></i>
                        Feedback not provided yet. Our team is reviewing your application.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Financial Information */}
          <div className="col-lg-4">
            {/* Financial Summary */}
            <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <h5 className="card-title text-success mb-4">
                  <i className="fas fa-chart-line me-2"></i>
                  Financial Summary
                </h5>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Requested Amount</span>
                    <strong>{formatCurrency(application.amount)}</strong>
                  </div>
                </div>

                {/* Disbursement Information */}
                { 1 ? (
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Disbursed Amount</span>
                      <strong className="text-success">{formatCurrency(application.disbursedAmount)}</strong>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Disbursement Date</span>
                      <small>{formatDate(application.disbursementDate)}</small>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="alert alert-light text-center" style={{ borderRadius: '12px' }}>
                      <i className="fas fa-info-circle text-muted mb-2"></i>
                      <p className="mb-0 text-muted">
                        {application.status === 'PENDING' 
                          ? 'Disbursement pending approval'
                          : application.status === 'REJECTED'
                          ? 'Application was not approved'
                          : 'Disbursement information not available'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Timeline */}
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4">
                <h5 className="card-title text-success mb-4">
                  <i className="fas fa-timeline me-2"></i>
                  Application Timeline
                </h5>

                <div className="timeline">
                  {/* Submitted */}
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <i className="fas fa-paper-plane text-white"></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">Application Submitted</h6>
                      <small className="text-muted">{formatDate(application.submissionDate)}</small>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="d-flex mb-3">
                    <div className="me-3">
                      <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                        application.status === 'PENDING' ? 'bg-warning' :
                        application.status === 'APPROVED' || application.status === 'VERIFIED' ? 'bg-info' :
                        application.status === 'DISBURSED' ? 'bg-primary' :
                        application.status === 'REJECTED' ? 'bg-danger' : 'bg-secondary'
                      }`} style={{ width: '40px', height: '40px' }}>
                        <i className={`${statusInfo.icon} text-white`}></i>
                      </div>
                    </div>
                    <div>
                      <h6 className="mb-1">{statusInfo.text}</h6>
                      <small className="text-muted">
                        {application.status === 'PENDING' ? 'Currently under review' : 'Status updated'}
                      </small>
                    </div>
                  </div>

                  {/* Disbursement (if applicable) */}
                  {application.disbursementDate && (
                    <div className="d-flex">
                      <div className="me-3">
                        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                          <i className="fas fa-money-check text-white"></i>
                        </div>
                      </div>
                      <div>
                        <h6 className="mb-1">Funds Disbursed</h6>
                        <small className="text-muted">{formatDate(application.disbursementDate)}</small>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4 text-center">
                <h6 className="text-muted mb-3">Need Help?</h6>
                <p className="text-muted mb-3">
                  If you have questions about your application status or need assistance, please contact our support team.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <button className="btn btn-outline-success">
                    <i className="fas fa-phone me-2"></i>
                    Contact Support
                  </button>
                  <button className="btn btn-outline-info">
                    <i className="fas fa-question-circle me-2"></i>
                    FAQ
                  </button>
                  {application.status === 'REJECTED' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => navigate('/apply-for-funds')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Submit New Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserFundApplicationDetails;