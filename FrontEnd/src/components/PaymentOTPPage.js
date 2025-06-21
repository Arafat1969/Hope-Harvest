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
  otpCard: {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    padding: '3rem',
    textAlign: 'center'
  },
  otpInput: {
    width: '60px',
    height: '60px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    border: '2px solid #e8f5e9',
    borderRadius: '8px',
    margin: '0 8px',
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
  resendButton: {
    background: 'transparent',
    border: 'none',
    color: '#4CAF50',
    fontSize: '1rem',
    textDecoration: 'underline',
    cursor: 'pointer'
  }
};

const PaymentOTPPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [donationData, setDonationData] = useState(null);

  useEffect(() => {
    if (location.state?.paymentResponse) {
      setPaymentResponse(location.state.paymentResponse);
      setPaymentMethod(location.state.paymentMethod);
      setDonationData(location.state.donationData);
      console.log('🔐 OTP page loaded:', location.state);
    } else {
      navigate('/payment');
    }
  }, [location.state, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);
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

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      // Prepare payment verify request
      const paymentVerifyRequest = {
        paymentId: paymentResponse.paymentId,
        otp: otpValue,
        organizationName: paymentResponse.organizationName
      };

      console.log('🔐 Verifying payment:', paymentVerifyRequest);

      const response = await paymentService.verifyPayment(paymentVerifyRequest);

      if (response.status === 'success') {
        console.log('✅ Payment verified successfully:', response);
        
        // Navigate to success page
        navigate('/payment-success', {
          state: {
            paymentMethod: paymentMethod,
            donationData: donationData,
            paymentResponse: paymentResponse
          }
        });
      } else {
        setError(response.message || 'OTP verification failed');
      }
    } catch (err) {
      console.error('❌ OTP verification error:', err);
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    // For now, just reset the timer
    setTimeLeft(300);
    setError('');
    console.log('🔄 OTP resend requested');
    // Here you would call the resend OTP API if available
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  if (!paymentResponse) {
    return (
      <div style={styles.container}>
        <div className="container">
          <div className="text-center">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading verification page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div style={styles.otpCard}>
              {/* Header */}
              <div className="mb-4">
                <div className="text-success mb-3">
                  <i className="fas fa-mobile-alt fa-3x"></i>
                </div>
                <h2 className="text-success mb-3">Verify Your Payment</h2>
                <p className="text-muted">
                  We've sent a 6-digit verification code to your registered {paymentMethodNames[paymentMethod]} account
                </p>
              </div>

              {/* Payment Info */}
              <div className="mb-4 p-3 bg-light rounded">
                <div className="d-flex justify-content-between mb-2">
                  <span>Payment ID:</span>
                  <strong>{paymentResponse.paymentId}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Amount:</span>
                  <strong className="text-success">{formatCurrency(donationData?.amount)}</strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Organization:</span>
                  <strong>{paymentResponse.organizationName}</strong>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold text-success mb-3">
                    Enter Verification Code
                  </label>
                  <div className="d-flex justify-content-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        style={styles.otpInput}
                        onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                        onBlur={(e) => e.target.style.borderColor = '#e8f5e9'}
                      />
                    ))}
                  </div>
                </div>

                {/* Timer */}
                <div className="mb-4">
                  {timeLeft > 0 ? (
                    <p className="text-muted">
                      <i className="fas fa-clock me-2"></i>
                      Code expires in: <strong className="text-warning">{formatTime(timeLeft)}</strong>
                    </p>
                  ) : (
                    <p className="text-danger">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      Verification code has expired
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={loading || timeLeft === 0}
                  className="w-100 mb-3"
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Verify & Complete Payment
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <button
                  type="button"
                  style={styles.resendButton}
                  onClick={handleResendOTP}
                  disabled={timeLeft > 240} // Can resend after 1 minute
                >
                  <i className="fas fa-redo me-2"></i>
                  Didn't receive code? Resend OTP
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-4">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Check your {paymentMethodNames[paymentMethod]} app or SMS for the verification code
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOTPPage;
