import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  paymentCard: {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '2rem',
    marginBottom: '2rem'
  },
  methodCard: {
    border: '2px solid #e8f5e9',
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
    background: 'white'
  },
  selectedMethod: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(76, 175, 80, 0.2)'
  },
  methodIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    marginRight: '1rem'
  },
  proceedButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 40px',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }
};

// Color schemes for payment methods
const paymentMethodColors = {
  bkash: { background: '#E2136E', border: '#fff' },
  nagad: { background: '#E51A1A', border: '#fff' },
  qcash: { background: '#D32F2F', border: '#fff' },
  rocket: { background: '#7B1FA2', border: '#fff' },
  upay: { background: '#002B5C', border: '#FFD600' },
  visa: { background: '#1A1F71', border: '#fff' },
  mastercard: { background: '#EB001B', border: '#fff' },
  americanexpress: { background: '#006FCF', border: '#fff' }
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    // Get donation data from navigation state
    if (location.state?.donationResponse) {
      setDonationData(location.state.donationResponse);
      console.log('💰 Payment page loaded with donation:', location.state.donationResponse);
    } else {
      // Redirect to donate page if no donation data
      navigate('/donate');
    }
  }, [location.state, navigate]);
  const paymentMethods = {
    mobileBanking: [
      { id: 'bkash', name: 'bKash', icon: 'https://i.postimg.cc/fTV7C9cy/BKash-Logo.png', color: '#E2136E' },
      { id: 'nagad', name: 'Nagad', icon: 'https://i.postimg.cc/fRx9qjJz/Nagad-Logo.png', color: '#FF6B35' },
      { id: 'rocket', name: 'Rocket', icon: 'https://i.postimg.cc/T1DwLfbd/Rocket-Logo.png', color: '#8E44AD' },
      { id: 'upay', name: 'Upay', icon: 'https://i.postimg.cc/Zn8BRpXY/Upay-Logo.png', color: '#3498DB' },
      { id: 'qcash', name: 'Q-Cash', icon: 'https://i.postimg.cc/C1dd0jLf/Qcash-Logo.png', color: '#27AE60' }
    ],
    cards: [
      { id: 'visa', name: 'Visa Card', icon: 'https://i.postimg.cc/kgzn0DhT/Visa-Logo.png', color: '#1A1F71' },
      { id: 'mastercard', name: 'MasterCard', icon: 'https://i.postimg.cc/L6Gtb8DT/Mastercard-Logo.png', color: '#EB001B' },
      { id: 'americanexpress', name: 'American Express', icon: 'https://i.postimg.cc/44Lbp5hj/American-Express-Logo.png', color: '#006FCF' }
    ]
  };

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleProceed = () => {
    if (!selectedMethod || !donationData) {
      alert('Please select a payment method');
      return;
    }

    // Navigate to payment info page with selected method and donation data
    navigate('/payment-info', {
      state: {
        paymentMethod: selectedMethod,
        donationData: donationData
      }
    });
  };

  if (!donationData) {
    return (
      <div style={styles.container}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading payment options...</p>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success">Complete Your Donation</h1>
          <p className="lead text-muted">Choose your preferred payment method</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {/* Donation Summary */}
            <div style={styles.paymentCard}>
              <h4 className="text-success mb-3">
                <i className="fas fa-receipt me-2"></i>
                Donation Summary
              </h4>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Donation ID:</strong> {donationData.donationId}</p>
                  <p><strong>Amount:</strong> <span className="text-success fs-5 fw-bold">{formatCurrency(donationData.amount)}</span></p>
                </div>
                <div className="col-md-6">
                  <p><strong>Status:</strong> <span className="badge bg-warning">Payment Pending</span></p>
                  <p><strong>Organization:</strong> Hope Harvest</p>
                </div>
              </div>
            </div>

            {/* Mobile Banking Methods */}
            <div style={styles.paymentCard}>
              <h5 className="text-success mb-4">
                <i className="fas fa-mobile-alt me-2"></i>
                Mobile Banking
              </h5>
              <div className="row">
                {paymentMethods.mobileBanking.map((method) => {
                  const colorScheme = paymentMethodColors[method.id] || {};
                  return (
                    <div key={method.id} className="col-md-6 mb-3">
                      <div
                        style={{
                          ...styles.methodCard,
                          background: colorScheme.background || styles.methodCard.background,
                          border: `2px solid ${colorScheme.border || '#e8f5e9'}`,
                          ...(selectedMethod === method.id ? styles.selectedMethod : {})
                        }}
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        <div className="d-flex align-items-center">
                          <div style={{
                            ...styles.methodIcon,
                            backgroundColor: colorScheme.background || 'white',
                            border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                          }}>
                            <img
                              src={method.icon}
                              alt={method.name}
                              style={{
                                width: '35px',
                                height: '35px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                background: 'white'
                              }}
                            />
                          </div>
                          <div>
                            <h6 className="mb-1" style={{ color: colorScheme.border === '#FFD600' ? '#FFD600' : '#fff' }}>{method.name}</h6>
                            <small className="text-muted">Mobile banking payment</small>
                          </div>
                          {selectedMethod === method.id && (
                            <div className="ms-auto">
                              <i className="fas fa-check-circle text-success fs-4"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card Methods */}
            <div style={styles.paymentCard}>
              <h5 className="text-success mb-4">
                <i className="fas fa-credit-card me-2"></i>
                Card Payment
              </h5>
              <div className="row">
                {paymentMethods.cards.map((method) => {
                  const colorScheme = paymentMethodColors[method.id] || {};
                  return (
                    <div key={method.id} className="col-md-6 mb-3">
                      <div
                        style={{
                          ...styles.methodCard,
                          background: colorScheme.background || styles.methodCard.background,
                          border: `2px solid ${colorScheme.border || '#e8f5e9'}`,
                          ...(selectedMethod === method.id ? styles.selectedMethod : {})
                        }}
                        onClick={() => handleMethodSelect(method.id)}
                      >
                        <div className="d-flex align-items-center">
                          <div style={{
                            ...styles.methodIcon,
                            backgroundColor: colorScheme.background || 'white',
                            border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                          }}>
                            <img
                              src={method.icon}
                              alt={method.name}
                              style={{
                                width: '35px',
                                height: '35px',
                                objectFit: 'contain',
                                borderRadius: '4px',
                                background: 'white'
                              }}
                            />
                          </div>
                          <div>
                            <h6 className="mb-1" style={{ color: colorScheme.border === '#FFD600' ? '#FFD600' : '#fff' }}>{method.name}</h6>
                            <small className="text-muted">Secure card payment</small>
                          </div>
                          {selectedMethod === method.id && (
                            <div className="ms-auto">
                              <i className="fas fa-check-circle text-success fs-4"></i>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Proceed Button */}
            <div className="text-center">
              <button
                style={styles.proceedButton}
                onClick={handleProceed}
                disabled={!selectedMethod}
                onMouseOver={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-arrow-right me-2"></i>
                Proceed to Payment
              </button>
            </div>

            {/* Security Notice */}
            <div className="text-center mt-4">
              <small className="text-muted">
                <i className="fas fa-shield-alt me-1"></i>
                Your payment information is secure and encrypted
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
