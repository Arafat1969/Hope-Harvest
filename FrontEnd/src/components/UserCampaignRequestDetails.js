import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';

const styles = {
  pageContainer: {
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    padding: '2rem 0'
  },
  headerCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    marginBottom: '2rem'
  },
  detailCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    marginBottom: '1.5rem',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  detailCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
  },
  infoItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #e9ecef',
    transition: 'all 0.3s ease'
  },
  infoItemHover: {
    backgroundColor: '#e3f2fd',
    borderColor: '#FF9800',
    transform: 'translateX(5px)'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #FF9800',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '2rem auto'
  },
  actionButton: {
    borderRadius: '25px',
    padding: '0.75rem 1.5rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  requestIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#FF9800',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    color: 'white',
    fontSize: '2rem'
  },
  feedbackCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderRadius: '8px',
    padding: '1rem',
    marginTop: '1rem'
  }
};

const UserCampaignRequestDetails = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  
  const [campaignRequest, setCampaignRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (requestId) {
      fetchCampaignRequestDetails();
    }
  }, [requestId]);

  const fetchCampaignRequestDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get userId from localStorage
      const userId = localStorage.getItem('userId');
      console.log('Retrieved userId from localStorage:', userId);
      
      if (!userId) {
        throw new Error('User ID not found in localStorage. Please log in again.');
      }
      
      if (!requestId) {
        throw new Error('Request ID is required.');
      }
      
      console.log('Fetching campaign request details for userId:', userId, 'requestId:', requestId);
      const response = await campaignService.getUserCampaignRequest(userId, requestId);
      
      console.log('Campaign request details response:', response);
      setCampaignRequest(response.data || response);
      
    } catch (error) {
      console.error('Error fetching campaign request details:', error);
      if (error.message.includes('User ID not found')) {
        setError('Session expired. Please log in again.');
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to load campaign request details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'badge bg-success';
      case 'pending':
      case 'under_review':
        return 'badge bg-warning text-dark';
      case 'rejected':
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'fas fa-check-circle text-success';
      case 'pending':
      case 'under_review':
        return 'fas fa-clock text-warning';
      case 'rejected':
      case 'cancelled':
        return 'fas fa-times-circle text-danger';
      default:
        return 'fas fa-question-circle text-secondary';
    }
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      Object.assign(e.currentTarget.style, styles.detailCardHover);
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
  };

  const handleInfoItemHover = (e, isHover) => {
    if (isHover) {
      Object.assign(e.currentTarget.style, styles.infoItemHover);
    } else {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
      e.currentTarget.style.borderColor = '#e9ecef';
      e.currentTarget.style.transform = 'translateX(0)';
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleViewAllRequests = () => {
    navigate('/my-campaign-requests');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div className="container">
          <div className="text-center">
            <div style={styles.loadingSpinner}></div>
            <h4 className="text-muted">Loading Campaign Request Details...</h4>
            <p className="text-muted">Fetching your request information</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    const isSessionError = error.includes('Session expired') || error.includes('User ID not found');
    
    return (
      <div style={styles.pageContainer}>
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle fa-2x mb-3 d-block"></i>
            <h4>Error Loading Campaign Request</h4>
            <p>{error}</p>
            <div className="d-flex gap-2">
              {isSessionError ? (
                <button 
                  className="btn btn-primary"
                  onClick={handleLoginRedirect}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Go to Login
                </button>
              ) : (
                <button 
                  className="btn btn-outline-danger"
                  onClick={fetchCampaignRequestDetails}
                >
                  <i className="fas fa-retry me-2"></i>
                  Try Again
                </button>
              )}
              <button 
                className="btn btn-secondary"
                onClick={handleBackToDashboard}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaignRequest) {
    return (
      <div style={styles.pageContainer}>
        <div className="container">
          <div className="alert alert-warning" role="alert">
            <h4>Campaign Request Not Found</h4>
            <p>The requested campaign request could not be found.</p>
            <button 
              className="btn btn-secondary"
              onClick={handleBackToDashboard}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        {/* Header Section */}
        <div className="card" style={styles.headerCard}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="text-warning mb-2">
                  <i className="fas fa-bullhorn me-3"></i>
                  Campaign Request Details
                </h1>
                <p className="text-muted mb-0">
                  Complete information about your campaign request
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-warning"
                  style={styles.actionButton}
                  onClick={handleViewAllRequests}
                >
                  <i className="fas fa-list me-2"></i>
                  All Requests
                </button>
                <button 
                  className="btn btn-outline-secondary"
                  style={styles.actionButton}
                  onClick={handleBackToDashboard}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Left Column - Status & Overview */}
          <div className="col-lg-6 mb-4">
            {/* Status Card */}
            <div 
              className="card text-center" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body py-5">
                <div style={styles.requestIcon}>
                  <i className="fas fa-bullhorn"></i>
                </div>
                <h3 className="text-warning mb-3">Campaign Request</h3>
                <div className="mb-3">
                  <i className={`${getStatusIcon(campaignRequest.status)} fa-2x mb-2`}></i>
                  <br />
                  <span className={`${getStatusBadgeClass(campaignRequest.status)} fs-6`}>
                    {campaignRequest.status || 'Unknown Status'}
                  </span>
                </div>
                <p className="text-muted">
                  Your request is currently {campaignRequest.status?.toLowerCase() || 'under review'}
                </p>
              </div>
            </div>

            {/* Request Information */}
            <div 
              className="card" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body">
                <h5 className="card-title text-warning mb-4">
                  <i className="fas fa-info-circle me-2"></i>
                  Request Information
                </h5>

                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-hashtag text-secondary me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Request ID</strong>
                      <code className="bg-light p-1 rounded">{campaignRequest.requestId}</code>
                    </div>
                  </div>
                </div>

                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-tag text-primary me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Campaign Title</strong>
                      <h6 className="mb-0">{campaignRequest.title || 'No title provided'}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline & Feedback */}
          <div className="col-lg-6 mb-4">
            {/* Timeline Information */}
            <div 
              className="card" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body">
                <h5 className="card-title text-warning mb-4">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Campaign Timeline
                </h5>

                {/* Start Date */}
                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-play text-success me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Start Date</strong>
                      <p className="mb-0">{formatDate(campaignRequest.startDate)}</p>
                    </div>
                  </div>
                </div>

                {/* End Date */}
                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-stop text-danger me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">End Date</strong>
                      <p className="mb-0">{formatDate(campaignRequest.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div 
              className="card" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body">
                <h5 className="card-title text-warning mb-4">
                  <i className="fas fa-comment-alt me-2"></i>
                  Admin Feedback
                </h5>

                {campaignRequest.feedback ? (
                  <div style={styles.feedbackCard}>
                    <div className="d-flex align-items-start">
                      <i className="fas fa-comment text-warning me-3 mt-1"></i>
                      <div>
                        <strong className="text-muted d-block mb-2">Administrator's Feedback:</strong>
                        <p className="mb-0" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                          {campaignRequest.feedback}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    style={styles.infoItem}
                    onMouseEnter={(e) => handleInfoItemHover(e, true)}
                    onMouseLeave={(e) => handleInfoItemHover(e, false)}
                  >
                    <div className="text-center py-3">
                      <i className="fas fa-clock text-muted fa-2x mb-3"></i>
                      <h6 className="text-muted mb-2">Feedback Not Given Yet</h6>
                      <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                        The administrator has not provided feedback for your request yet. 
                        Please check back later.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="row">
          <div className="col-12">
            <div className="card" style={styles.detailCard}>
              <div className="card-body">
                <h5 className="card-title text-warning mb-4">
                  <i className="fas fa-tools me-2"></i>
                  Quick Actions
                </h5>
                
                <div className="text-center">
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button 
                      className="btn btn-warning"
                      style={styles.actionButton}
                      onClick={() => navigate('/request-campaign')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Submit New Request
                    </button>
                    
                    <button 
                      className="btn btn-outline-warning"
                      style={styles.actionButton}
                      onClick={handleViewAllRequests}
                    >
                      <i className="fas fa-list me-2"></i>
                      View All My Requests
                    </button>
                    
                    <button 
                      className="btn btn-outline-primary"
                      style={styles.actionButton}
                      onClick={() => window.print()}
                    >
                      <i className="fas fa-print me-2"></i>
                      Print Request Details
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-3 border-top">
                    <small className="text-muted">
                      <i className="fas fa-info-circle me-1"></i>
                      If you have questions about your request, please contact our support team.
                    </small>
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

export default UserCampaignRequestDetails;