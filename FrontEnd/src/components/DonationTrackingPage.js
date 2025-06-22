import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    padding: '1.5rem',
    textAlign: 'center'
  },
  searchButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    transition: 'all 0.3s ease'
  },
  detailsCard: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '1.5rem',
    marginTop: '1.5rem'
  }
};

const DonationTrackingPage = () => {
  const [trackingKey, setTrackingKey] = useState('');
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trackingKey.trim()) {
      setError('Please enter a tracking key');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await donationService.getAnonymousDonation(trackingKey);
      console.log('Donation found:', result);
      setDonation(result);
      setError('');
    } catch (err) {
      console.error('Error fetching donation:', err);
      setError('Donation not found. Please check the tracking key and try again.');
      setDonation(null);
    } finally {
      setLoading(false);
    }
  };

  // Format date and currency functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div style={styles.container}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 className="mb-1">
                  <i className="fas fa-search-dollar me-2"></i>
                  Track Your Donation
                </h2>
                <p className="mb-0">Enter your tracking key to view donation details</p>
              </div>
              
              <div className="card-body p-4">
                <form onSubmit={handleSearch}>
                  <div className="mb-4">
                    <label htmlFor="trackingKey" className="form-label fw-bold">Tracking Key</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-key text-success"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="trackingKey"
                        placeholder="Enter tracking key (e.g. TRK-1234abcd)"
                        value={trackingKey}
                        onChange={(e) => setTrackingKey(e.target.value)}
                        required
                      />
                      <button 
                        className="btn btn-success btn-lg"
                        type="submit"
                        disabled={loading}
                        style={styles.searchButton}
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Searching...</>
                        ) : (
                          <><i className="fas fa-search me-2"></i>Track</>
                        )}
                      </button>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      <i className="fas fa-info-circle me-1"></i>
                      The tracking key was provided in your donation confirmation email or receipt
                    </small>
                  </div>
                </form>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                {donation && (
                  <div className="mt-4 animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="fas fa-check fa-3x"></i>
                      </div>
                      <h4 className="text-success mt-3 mb-1">Donation Found!</h4>
                      <p className="text-muted">Thank you for your generosity</p>
                    </div>
                    
                    <div style={styles.detailsCard}>
                      <h5 className="mb-3 text-success">
                        <i className="fas fa-receipt me-2"></i>
                        Donation Details
                      </h5>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <strong>Campaign:</strong>
                          <p className="text-muted mb-0">{donation.data.campaignTitle}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Amount:</strong>
                          <p className="text-success fw-bold mb-0">{formatCurrency(donation.data.amount)}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Date:</strong>
                          <p className="text-muted mb-0">{formatDate(donation.data.donationDate)}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Payment Method:</strong>
                          <p className="text-muted mb-0">{donation.data.paymentMethod}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Organization:</strong>
                          <p className="text-muted mb-0">{donation.data.organizationName}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Transaction ID:</strong>
                          <p className="text-muted mb-0">{donation.data.transactionId}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Donation ID:</strong>
                          <p className="text-muted mb-0">{donation.data.donationId}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Tracking Key:</strong>
                          <p className="text-muted mb-0">{donation.data.trackingKey}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-muted mb-4">
                        Thank you for your contribution. Your generosity makes our work possible!
                      </p>
                      
                      <div className="d-flex justify-content-center flex-wrap gap-3">
                        <button 
                          className="btn btn-outline-secondary btn-lg"
                          onClick={() => navigate('/')}
                        >
                          <i className="fas fa-home me-2"></i>
                          Back to Home
                        </button>
                        <button 
                          className="btn btn-success btn-lg"
                          onClick={() => navigate('/campaigns')}
                        >
                          <i className="fas fa-hand-holding-heart me-2"></i>
                          Donate Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!donation && !error && (
                  <div className="text-center py-4">
                    <img 
                      src="/assets/donation-search.svg" 
                      alt="Track Donation" 
                      style={{ maxWidth: '200px', opacity: 0.7 }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <p className="text-muted mt-3">
                      Enter your tracking key to view your donation information
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-muted">
                <i className="fas fa-question-circle me-2"></i>
                Can't find your tracking key? <a href="/contact" className="text-success">Contact support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTrackingPage;
