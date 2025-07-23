import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';

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
    borderColor: '#2196F3',
    transform: 'translateX(5px)'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
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
  donationIcon: {
    width: '80px',
    height: '80px',
    backgroundColor: '#28a745',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1rem',
    color: 'white',
    fontSize: '2rem'
  }
};

const UserDonationDetails = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();
  
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (donationId) {
      fetchDonationDetails();
    }
  }, [donationId]);

  const fetchDonationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching donation details for ID:', donationId);
      const response = await donationService.getDonationDetails(donationId);
      
      console.log('Donation details response:', response);
      setDonation(response.data || response);
      
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setError(error.response?.data?.message || 'Failed to load donation details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
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

  const getPaymentMethodIcon = (method) => {
    switch (method?.toLowerCase()) {
      case 'bkash':
        return 'fab fa-bkash';
      case 'nagad':
        return 'fas fa-mobile-alt';
      case 'rocket':
        return 'fas fa-rocket';
      case 'card':
      case 'credit_card':
      case 'debit_card':
        return 'fas fa-credit-card';
      case 'bank_transfer':
        return 'fas fa-university';
      default:
        return 'fas fa-money-bill-wave';
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

  const handleViewAllDonations = () => {
    navigate('/my-donations');
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div className="container">
          <div className="text-center">
            <div style={styles.loadingSpinner}></div>
            <h4 className="text-muted">Loading Donation Details...</h4>
            <p className="text-muted">Fetching your donation information</p>
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
    return (
      <div style={styles.pageContainer}>
        <div className="container">
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-triangle fa-2x mb-3 d-block"></i>
            <h4>Error Loading Donation</h4>
            <p>{error}</p>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-danger"
                onClick={fetchDonationDetails}
              >
                <i className="fas fa-retry me-2"></i>
                Try Again
              </button>
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

  if (!donation) {
    return (
      <div style={styles.pageContainer}>
        <div className="container">
          <div className="alert alert-warning" role="alert">
            <h4>Donation Not Found</h4>
            <p>The requested donation could not be found.</p>
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
                <h1 className="text-success mb-2">
                  <i className="fas fa-heart me-3"></i>
                  Donation Details
                </h1>
                <p className="text-muted mb-0">
                  Complete information about your donation
                </p>
              </div>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-success"
                  style={styles.actionButton}
                  onClick={handleViewAllDonations}
                >
                  <i className="fas fa-list me-2"></i>
                  All Donations
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
          {/* Left Column - Donation Summary */}
          <div className="col-lg-6 mb-4">
            {/* Donation Amount Card */}
            <div 
              className="card text-center" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body py-5">
                <div style={styles.donationIcon}>
                  <i className="fas fa-heart"></i>
                </div>
                <h2 className="text-success mb-3">
                  {formatCurrency(donation.amount)}
                </h2>
                <h5 className="text-muted mb-3">Donation Amount</h5>
                <p className="text-muted">
                  Thank you for your generous contribution to make a difference!
                </p>
              </div>
            </div>

            {/* Campaign Information */}
            <div 
              className="card" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body">
                <h5 className="card-title text-success mb-4">
                  <i className="fas fa-bullhorn me-2"></i>
                  Campaign Information
                </h5>

                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-tag text-primary me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Campaign Title</strong>
                      <h6 className="mb-0">{donation.campaignTitle || 'No campaign specified'}</h6>
                    </div>
                  </div>
                </div>

                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-building text-info me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Organization</strong>
                      <h6 className="mb-0">{donation.organizationName || 'Hope Harvest Foundation'}</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Transaction Details */}
          <div className="col-lg-6 mb-4">
            {/* Transaction Information */}
            <div 
              className="card" 
              style={styles.detailCard}
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <div className="card-body">
                <h5 className="card-title text-success mb-4">
                  <i className="fas fa-receipt me-2"></i>
                  Transaction Details
                </h5>

                {/* Donation Date */}
                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-calendar-alt text-primary me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Donation Date</strong>
                      <p className="mb-0">{formatDate(donation.donationDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className={`${getPaymentMethodIcon(donation.paymentMethod)} text-warning me-3 fa-lg`}></i>
                    <div>
                      <strong className="text-muted d-block">Payment Method</strong>
                      <p className="mb-0 text-capitalize">{donation.paymentMethod || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Transaction ID */}
                {donation.transactionId && (
                  <div 
                    style={styles.infoItem}
                    onMouseEnter={(e) => handleInfoItemHover(e, true)}
                    onMouseLeave={(e) => handleInfoItemHover(e, false)}
                  >
                    <div className="d-flex align-items-center">
                      <i className="fas fa-hashtag text-secondary me-3 fa-lg"></i>
                      <div>
                        <strong className="text-muted d-block">Transaction ID</strong>
                        <code className="bg-light p-2 rounded d-block">{donation.transactionId}</code>
                      </div>
                    </div>
                  </div>
                )}

                {/* Donation ID */}
                <div 
                  style={styles.infoItem}
                  onMouseEnter={(e) => handleInfoItemHover(e, true)}
                  onMouseLeave={(e) => handleInfoItemHover(e, false)}
                >
                  <div className="d-flex align-items-center">
                    <i className="fas fa-fingerprint text-success me-3 fa-lg"></i>
                    <div>
                      <strong className="text-muted d-block">Donation ID</strong>
                      <code className="bg-light p-2 rounded d-block">{donation.donationId}</code>
                    </div>
                  </div>
                </div>

                {/* Tracking Key */}
                {donation.trackingKey && (
                  <div 
                    style={styles.infoItem}
                    onMouseEnter={(e) => handleInfoItemHover(e, true)}
                    onMouseLeave={(e) => handleInfoItemHover(e, false)}
                  >
                    <div className="d-flex align-items-center">
                      <i className="fas fa-key text-info me-3 fa-lg"></i>
                      <div>
                        <strong className="text-muted d-block">Tracking Key</strong>
                        <code className="bg-light p-2 rounded d-block">{donation.trackingKey}</code>
                        <small className="text-muted">Use this key to track your donation publicly</small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="row">
          <div className="col-12">
            <div className="card border-success" style={styles.detailCard}>
              <div className="card-body">
                <div className="text-center py-3">
                  <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
                  <h4 className="text-success">Donation Completed Successfully!</h4>
                  <p className="text-muted mb-4">
                    Your donation of <strong>{formatCurrency(donation.amount)}</strong> has been processed 
                    and will help make a positive impact. Thank you for your generosity!
                  </p>
                  
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <button 
                      className="btn btn-success"
                      style={styles.actionButton}
                      onClick={() => navigate('/donate')}
                    >
                      <i className="fas fa-heart me-2"></i>
                      Make Another Donation
                    </button>
                    
                    <button 
                      className="btn btn-outline-success"
                      style={styles.actionButton}
                      onClick={handleViewAllDonations}
                    >
                      <i className="fas fa-list me-2"></i>
                      View All My Donations
                    </button>
                    
                    <button 
                      className="btn btn-outline-primary"
                      style={styles.actionButton}
                      onClick={() => window.print()}
                    >
                      <i className="fas fa-print me-2"></i>
                      Print Receipt
                    </button>
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

export default UserDonationDetails;