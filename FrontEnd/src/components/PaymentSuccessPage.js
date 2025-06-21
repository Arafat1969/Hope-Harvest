import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  successCard: {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '3rem',
    textAlign: 'center'
  },
  successIcon: {
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 2rem',
    fontSize: '3rem',
    color: 'white',
    animation: 'pulse 2s infinite'
  },
  detailsCard: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '1.5rem',
    marginTop: '2rem'
  },
  actionButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 30px',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 10px',
    transition: 'all 0.3s ease'
  },
  secondaryButton: {
    background: 'transparent',
    border: '2px solid #4CAF50',
    borderRadius: '25px',
    padding: '10px 30px',
    color: '#4CAF50',
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 10px'
  }
};

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [confetti, setConfetti] = useState(true);

  useEffect(() => {
    if (location.state) {
      setPaymentData(location.state);
      console.log('🎉 Payment success page loaded:', location.state);
    } else {
      navigate('/');
    }

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [location.state, navigate]);
  const paymentMethodNames = {
    bkash: 'bKash',
    nagad: 'Nagad',
    rocket: 'Rocket',
    upay: 'Upay',
    qcash: 'Q-Cash',
    visa: 'Visa Card',
    mastercard: 'MasterCard',
    americanexpress: 'American Express'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateTransactionId = () => {
    return `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
  };

  if (!paymentData) {
    return (
      <div style={styles.container}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading payment confirmation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Confetti Effect */}
      {confetti && (
        <style>
          {`
            @keyframes confetti-fall {
              0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
            .confetti {
              position: fixed;
              width: 10px;
              height: 10px;
              background: #4CAF50;
              animation: confetti-fall 3s linear infinite;
              z-index: 1000;
            }
            .confetti:nth-child(odd) { background: #81C784; animation-delay: 0.5s; }
            .confetti:nth-child(even) { background: #A5D6A7; animation-delay: 1s; }
          `}
        </style>
      )}

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={styles.successCard}>
              {/* Success Icon */}
              <div style={styles.successIcon}>
                <i className="fas fa-check"></i>
              </div>

              {/* Success Message */}
              <h1 className="text-success mb-3">Payment Successful!</h1>
              <h4 className="text-muted mb-4">
                Thank you for your generous donation to Hope Harvest
              </h4>

              {/* Payment Summary */}
              <div style={styles.detailsCard}>
                <h5 className="text-success mb-3">
                  <i className="fas fa-receipt me-2"></i>
                  Payment Details
                </h5>
                
                <div className="row text-start">
                  <div className="col-md-6 mb-3">
                    <strong>Transaction ID:</strong><br />
                    <span className="text-muted">{generateTransactionId()}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Donation ID:</strong><br />
                    <span className="text-muted">{paymentData.donationData?.donationId}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Payment ID:</strong><br />
                    <span className="text-muted">{paymentData.paymentResponse?.paymentId}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Payment Method:</strong><br />
                    <span className="text-muted">{paymentMethodNames[paymentData.paymentMethod]}</span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Amount Donated:</strong><br />
                    <span className="text-success fw-bold fs-5">
                      {formatCurrency(paymentData.donationData?.amount)}
                    </span>
                  </div>
                  <div className="col-md-6 mb-3">
                    <strong>Date & Time:</strong><br />
                    <span className="text-muted">{formatDate(new Date())}</span>
                  </div>
                  <div className="col-12 mb-3">
                    <strong>Organization:</strong><br />
                    <span className="text-muted">{paymentData.paymentResponse?.organizationName}</span>
                  </div>
                </div>
              </div>

              {/* Impact Message */}
              <div className="mt-4 p-4 bg-success bg-opacity-10 rounded">
                <h6 className="text-success">
                  <i className="fas fa-heart me-2"></i>
                  Your Impact
                </h6>
                <p className="text-muted mb-0">
                  Your donation of <strong>{formatCurrency(paymentData.donationData?.amount)}</strong> will help us make a meaningful difference in communities across Bangladesh. Thank you for being part of our mission!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4">
                <button
                  style={styles.actionButton}
                  onClick={() => navigate('/campaigns')}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <i className="fas fa-hand-holding-heart me-2"></i>
                  Donate to Another Campaign
                </button>
                
                <button
                  style={styles.secondaryButton}
                  onClick={() => navigate('/')}
                >
                  <i className="fas fa-home me-2"></i>
                  Back to Home
                </button>
              </div>

              {/* Receipt Options */}
              <div className="mt-4">
                <p className="text-muted mb-2">
                  <i className="fas fa-envelope me-2"></i>
                  A donation receipt will be sent to your email shortly
                </p>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => window.print()}
                >
                  <i className="fas fa-download me-2"></i>
                  Download Receipt
                </button>
              </div>

              {/* Social Sharing */}
              <div className="mt-4">
                <p className="text-muted">Share your good deed:</p>
                <div>
                  <button className="btn btn-primary btn-sm me-2">
                    <i className="fab fa-facebook-f me-2"></i>
                    Facebook
                  </button>
                  <button className="btn btn-info btn-sm me-2">
                    <i className="fab fa-twitter me-2"></i>
                    Twitter
                  </button>
                  <button className="btn btn-success btn-sm">
                    <i className="fab fa-whatsapp me-2"></i>
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          @media print {
            .btn, button { display: none !important; }
            body { background: white !important; }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentSuccessPage;
