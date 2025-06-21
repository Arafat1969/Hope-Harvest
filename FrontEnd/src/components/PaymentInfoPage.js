import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentService } from '../services/paymentService';

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
    padding: '2rem'
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: '0.5rem'
  },
  input: {
    borderRadius: '8px',
    border: '2px solid #e8f5e9',
    padding: '12px 16px',
    fontSize: '1rem',
    transition: 'all 0.3s ease'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    borderRadius: '25px',
    padding: '12px 40px',
    color: 'white',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  backButton: {
    background: 'transparent',
    border: '2px solid #4CAF50',
    borderRadius: '25px',
    padding: '10px 30px',
    color: '#4CAF50',
    fontSize: '1rem',
    fontWeight: '600',
    marginRight: '1rem'
  }
};

const PaymentInfoPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    if (location.state?.paymentMethod && location.state?.donationData) {
      setPaymentMethod(location.state.paymentMethod);
      setDonationData(location.state.donationData);
      console.log('💳 Payment info page loaded:', location.state);
    } else {
      navigate('/payment');
    }
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

  const isMobileBanking = ['bkash', 'nagad', 'rocket', 'upay', 'qcash'].includes(paymentMethod);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isMobileBanking) {
      if (!formData.mobileNumber || formData.mobileNumber.length !== 11) {
        setError('Please enter a valid 11-digit mobile number');
        return false;
      }
    } else {
      if (!formData.cardNumber || formData.cardNumber.length < 16) {
        setError('Please enter a valid card number');
        return false;
      }
      if (!formData.expiryDate) {
        setError('Please enter expiry date');
        return false;
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        setError('Please enter a valid CVV');
        return false;
      }
      if (!formData.cardholderName) {
        setError('Please enter cardholder name');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare payment initiate request
      const paymentInitiateRequest = {
        donationId: donationData.donationId,
        gatewayName: paymentMethod.toUpperCase(),
        amount: donationData.amount,
        organizationName: "Hope Harvest"
      };

      console.log('🚀 Initiating payment:', paymentInitiateRequest);

      const response = await paymentService.initiatePayment(paymentInitiateRequest);

      if (response.status === 'success') {
        console.log('✅ Payment initiated successfully:', response.data);
        
        // Navigate to OTP verification page
        navigate('/payment-otp', {
          state: {
            paymentResponse: response.data,
            paymentMethod: paymentMethod,
            donationData: donationData,
            formData: formData
          }
        });
      } else {
        setError(response.message || 'Payment initiation failed');
      }
    } catch (err) {
      console.error('❌ Payment initiation error:', err);
      setError('Payment initiation failed. Please try again.');
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

  if (!paymentMethod || !donationData) {
    return (
      <div style={styles.container}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading payment form...</p>
          </div>
        </div>
      </div>
    );
  }

  const colorScheme = paymentMethodColors[paymentMethod] || {};

  return (
    <div style={styles.container}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-success">Payment Details</h1>
          <p className="lead text-muted">Enter your {paymentMethodNames[paymentMethod]} information</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div style={{
              ...styles.paymentCard,
              background: colorScheme.background || styles.paymentCard.background,
              border: `2px solid ${colorScheme.border || '#e8f5e9'}`
            }}>
              {/* Payment Summary */}
              <div className="mb-4 p-3 bg-light rounded">
                <h6 className="text-success mb-2">Payment Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>Amount:</span>
                  <strong className="text-success">{formatCurrency(donationData.amount)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Method:</span>
                  <strong>{paymentMethodNames[paymentMethod]}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Organization:</span>
                  <strong>Hope Harvest</strong>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Payment Form */}
              <form onSubmit={handleSubmit}>
                {isMobileBanking ? (
                  // Mobile Banking Form
                  <div>
                    <div style={styles.inputGroup}>
                      <label style={{ ...styles.label, color: colorScheme.border === '#FFD600' ? '#FFD600' : styles.label.color }}>
                        <i className="fas fa-mobile-alt me-2"></i>
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        className="form-control"
                        style={{
                          ...styles.input,
                          border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                        }}
                        placeholder="01XXXXXXXXX"
                        value={formData.mobileNumber || ''}
                        onChange={handleInputChange}
                        maxLength="11"
                        required
                        onFocus={e => e.target.style.borderColor = colorScheme.background || '#4CAF50'}
                        onBlur={e => e.target.style.borderColor = colorScheme.border || '#e8f5e9'}
                      />
                      <small className="text-muted">Enter your registered {paymentMethodNames[paymentMethod]} number</small>
                    </div>
                  </div>
                ) : (
                  // Card Form
                  <div>
                    <div style={styles.inputGroup}>
                      <label style={{ ...styles.label, color: colorScheme.border === '#FFD600' ? '#FFD600' : styles.label.color }}>
                        <i className="fas fa-credit-card me-2"></i>
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        className="form-control"
                        style={{
                          ...styles.input,
                          border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                        }}
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber || ''}
                        onChange={handleInputChange}
                        maxLength="19"
                        required
                        onFocus={e => e.target.style.borderColor = colorScheme.background || '#4CAF50'}
                        onBlur={e => e.target.style.borderColor = colorScheme.border || '#e8f5e9'}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, color: colorScheme.border === '#FFD600' ? '#FFD600' : styles.label.color }}>
                            <i className="fas fa-calendar me-2"></i>
                            Expiry Date
                          </label>
                          <input
                            type="month"
                            name="expiryDate"
                            className="form-control"
                            style={{
                              ...styles.input,
                              border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                            }}
                            value={formData.expiryDate || ''}
                            onChange={handleInputChange}
                            required
                            onFocus={e => e.target.style.borderColor = colorScheme.background || '#4CAF50'}
                            onBlur={e => e.target.style.borderColor = colorScheme.border || '#e8f5e9'}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div style={styles.inputGroup}>
                          <label style={{ ...styles.label, color: colorScheme.border === '#FFD600' ? '#FFD600' : styles.label.color }}>
                            <i className="fas fa-lock me-2"></i>
                            CVV
                          </label>
                          <input
                            type="password"
                            name="cvv"
                            className="form-control"
                            style={{
                              ...styles.input,
                              border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                            }}
                            placeholder="123"
                            value={formData.cvv || ''}
                            onChange={handleInputChange}
                            maxLength="4"
                            required
                            onFocus={e => e.target.style.borderColor = colorScheme.background || '#4CAF50'}
                            onBlur={e => e.target.style.borderColor = colorScheme.border || '#e8f5e9'}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={{ ...styles.label, color: colorScheme.border === '#FFD600' ? '#FFD600' : styles.label.color }}>
                        <i className="fas fa-user me-2"></i>
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        className="form-control"
                        style={{
                          ...styles.input,
                          border: `2px solid ${colorScheme.border || '#e8f5e9'}`
                        }}
                        placeholder="John Doe"
                        value={formData.cardholderName || ''}
                        onChange={handleInputChange}
                        required
                        onFocus={e => e.target.style.borderColor = colorScheme.background || '#4CAF50'}
                        onBlur={e => e.target.style.borderColor = colorScheme.border || '#e8f5e9'}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    style={styles.backButton}
                    onClick={() => navigate('/payment', { state: { donationResponse: donationData } })}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back
                  </button>
                  <button
                    type="submit"
                    style={styles.submitButton}
                    disabled={loading}
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
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock me-2"></i>
                        Proceed to Payment
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Security Notice */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Your information is secure and encrypted with SSL
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfoPage;
