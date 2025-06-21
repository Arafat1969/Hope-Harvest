import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';

const styles = {
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32'
  },
  amountButton: {
    borderColor: '#4CAF50',
    color: '#4CAF50',
    transition: 'all 0.3s'
  },
  activeAmountButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    color: 'white'
  }
};

const DonationForm = ({ campaignId, onSuccess }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const passedCampaignData = useMemo(() => location.state || {}, [location.state]);
  
  const selectedCampaignId = passedCampaignData.campaignId || campaignId || '';
  
  const [formData, setFormData] = useState({
    campaignId: selectedCampaignId,
    amount: '',
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    isAnonymous: false,
    message: ''
  });
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(passedCampaignData.campaign || null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const predefinedAmounts = [500, 1000, 2000, 5000, 10000, 25000];
  useEffect(() => {
    fetchCampaigns();
  }, []);
  // Update form when campaign is passed from navigation
  useEffect(() => {
    if (passedCampaignData.campaignId) {
      console.log('🎯 Campaign passed from navigation:', passedCampaignData);
      setFormData(prev => ({
        ...prev,
        campaignId: passedCampaignData.campaignId
      }));
      
      // If full campaign data is available, set it
      if (passedCampaignData.campaign) {
        setSelectedCampaign(passedCampaignData.campaign);
      }
    }
  }, [passedCampaignData]);  // Debug authentication state
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userId = localStorage.getItem('userId');
    const userData = localStorage.getItem('userData');
    
    let parsedUserData = null;
    if (userData) {
      try {
        parsedUserData = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing userData:', e);
      }
    }
    
    console.log('🔐 Authentication Debug:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      userId: userId,
      userData: parsedUserData,
      userIdFromData: parsedUserData?.userId
    });
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignService.getAllCampaigns();
      if (response.status === 'success') {
        setCampaigns(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setFormData(prev => ({
      ...prev,
      amount: amount.toString()
    }));
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value;
    setSelectedAmount(null);
    setFormData(prev => ({
      ...prev,
      amount: value
    }));
  };
  const validateForm = () => {
    if (!formData.campaignId) {
      setError('Please select a campaign');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid donation amount');
      return false;
    }
    // Only validate donor information for non-anonymous donations
    if (!formData.isAnonymous) {
      if (!formData.donorName.trim()) {
        setError('Please enter your name');
        return false;
      }
      if (!formData.donorEmail.trim()) {
        setError('Please enter your email');
        return false;
      }
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Debug: Log the current form state
      console.log(' Form submission debug:', {
        isAnonymous: formData.isAnonymous,
        hasUserToken: !!localStorage.getItem('accessToken'),
        formData: { ...formData, amount: parseFloat(formData.amount) }
      });

      // Prepare donation data according to DonationRequestDTO
      const baseDonationData = {
        campaignId: formData.campaignId,
        amount: parseFloat(formData.amount),
        isAnonymous: formData.isAnonymous,
        status: "PENDING"
        // Note: paymentMethod will be set later during payment process
      };

      let response;      if (formData.isAnonymous) {
        // For anonymous donations, include donor information but set externalUserId to null
        const anonymousDonationData = {
          campaignId: formData.campaignId,
          amount: parseFloat(formData.amount),
          isAnonymous: formData.isAnonymous,
          status: "PENDING",
          externalUserId: null,
          donorName: formData.donorName || 'Anonymous',
          donorEmail: formData.donorEmail || '',
          donorPhone: formData.donorPhone || '',
          message: formData.message || ''
        };
        console.log('Making anonymous donation:', anonymousDonationData);
        response = await donationService.makeAnonymousDonation(anonymousDonationData);} else {
        // For authenticated donations, include externalUserId
        // Check for authentication token first
        const accessToken = localStorage.getItem('accessToken');
        let userId = localStorage.getItem('userId');
        
        // If userId not found directly, try to get it from stored userData JSON
        if (!userId) {
          const userData = localStorage.getItem('userData');
          if (userData) {
            try {
              const parsedUserData = JSON.parse(userData);
              userId = parsedUserData.userId;
            } catch (e) {
              console.error('Error parsing userData from localStorage:', e);
            }
          }
        }
        
        console.log('🔍 Authentication check:', {
          hasToken: !!accessToken,
          userId: userId,
          userDataFromStorage: localStorage.getItem('userData') ? 'Found' : 'Not found'
        });
        
        if (!accessToken) {
          setError('Please log in to make a non-anonymous donation');
          setLoading(false);
          return;
        }

        if (!userId) {
          setError('Unable to identify user. Please try logging out and logging back in.');
          setLoading(false);
          return;
        }        const authenticatedDonationData = {
          ...baseDonationData,
          externalUserId: userId,
          donorName: formData.donorName || '',
          donorEmail: formData.donorEmail || '',
          donorPhone: formData.donorPhone || '',
          message: formData.message || ''
        };
        
        console.log('Making authenticated donation:', authenticatedDonationData);
        response = await donationService.makeDonation(authenticatedDonationData);
      }      if (response.status === 'success') {
        setSuccess(`Donation submitted successfully! Donation ID: ${response.data.donationId}. Redirecting to payment...`);
        
        // Reset form
        setFormData({
          campaignId: campaignId || '',
          amount: '',
          donorName: '',
          donorEmail: '',
          donorPhone: '',
          isAnonymous: false,
          message: ''
        });
        setSelectedAmount(null);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }

        // Navigate to payment page with donation response
        setTimeout(() => {
          navigate('/payment', {
            state: {
              donationResponse: response.data
            }
          });
        }, 2000); // 2 second delay to show success message

        console.log('Donation response:', response.data);
      }
    } catch (error) {
      console.error('Donation error:', error);
      setError(error.response?.data?.message || 'Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card" style={styles.formContainer}>
            <div className="card-header bg-success text-white text-center">
              <h3 className="mb-0">
                <i className="fas fa-heart me-2"></i>
                Make a Donation
              </h3>
              <p className="mb-0 mt-2">Your generosity makes a difference</p>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </div>              )}

              {/* Selected Campaign Display */}
              {selectedCampaign && (
                <div className="mb-4">
                  <div className="card border-success">
                    <div className="card-header bg-success text-white">
                      <h6 className="mb-0">
                        <i className="fas fa-check-circle me-2"></i>
                        Selected Campaign
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {selectedCampaign.image && (
                          <div className="col-md-4">
                            <img 
                              src={selectedCampaign.image} 
                              alt={selectedCampaign.title}
                              className="img-fluid rounded"
                              style={{ maxHeight: '120px', objectFit: 'cover', width: '100%' }}
                            />
                          </div>
                        )}
                        <div className={selectedCampaign.image ? "col-md-8" : "col-12"}>
                          <h6 className="text-success">{selectedCampaign.title}</h6>
                          <p className="text-muted small mb-2">{selectedCampaign.description}</p>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">
                              <i className="fas fa-target me-1"></i>
                              Goal: {new Intl.NumberFormat('en-BD', {
                                style: 'currency',
                                currency: 'BDT',
                                minimumFractionDigits: 0
                              }).format(selectedCampaign.goalAmount)}
                            </small>
                            <small className="text-success fw-bold">
                              <i className="fas fa-chart-line me-1"></i>
                              {((selectedCampaign.collectedAmount / selectedCampaign.goalAmount) * 100).toFixed(1)}% Complete
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Campaign Selection */}
                <div className="mb-4">
                  <label htmlFor="campaignId" className="form-label fw-bold">
                    {selectedCampaign ? 'Change Campaign' : 'Select Campaign'} <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    id="campaignId"
                    name="campaignId"
                    value={formData.campaignId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Choose a campaign...</option>
                    {campaigns.map((campaign) => (
                      <option key={campaign.campaignId} value={campaign.campaignId}>
                        {campaign.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Selection */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Donation Amount (BDT) <span className="text-danger">*</span>
                  </label>
                  
                  {/* Predefined amounts */}
                  <div className="mb-3">
                    <div className="row g-2">
                      {predefinedAmounts.map((amount) => (
                        <div key={amount} className="col-4 col-md-2">
                          <button
                            type="button"
                            className={`btn w-100 ${
                              selectedAmount === amount
                                ? 'btn-success'
                                : 'btn-outline-success'
                            }`}
                            onClick={() => handleAmountSelect(amount)}
                          >
                            ৳{amount.toLocaleString()}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom amount */}
                  <div className="input-group">
                    <span className="input-group-text">৳</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter custom amount"
                      value={formData.amount}
                      onChange={handleCustomAmount}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Anonymous Donation Option */}
                <div className="mb-4">                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isAnonymous"
                      name="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label" htmlFor="isAnonymous">
                      <strong>Make this donation anonymous</strong>
                    </label>
                  </div>
                  <small className="text-muted">
                    {formData.isAnonymous 
                      ? "✓ Your donation will be processed anonymously. No personal information will be stored."
                      : "ℹ️ Your information will be collected for donation tracking and receipt purposes."
                    }
                  </small>
                </div>

                {/* Donor Information (if not anonymous) */}
                {!formData.isAnonymous && (
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="donorName" className="form-label">
                        Your Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="donorName"
                        name="donorName"
                        value={formData.donorName}
                        onChange={handleInputChange}
                        required={!formData.isAnonymous}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="donorEmail" className="form-label">
                        Email Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="donorEmail"
                        name="donorEmail"
                        value={formData.donorEmail}
                        onChange={handleInputChange}
                        required={!formData.isAnonymous}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="donorPhone" className="form-label">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="donorPhone"
                        name="donorPhone"
                        value={formData.donorPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Message */}
                <div className="mb-4">
                  <label htmlFor="message" className="form-label">
                    Message (Optional)
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="3"
                    placeholder="Leave a message of support..."
                    value={formData.message}
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-success btn-lg w-100"
                  style={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-heart me-2"></i>
                      Donate ৳{formData.amount ? parseFloat(formData.amount).toLocaleString() : '0'}
                    </>
                  )}
                </button>
              </form>

              {/* Security Note */}
              <div className="mt-4 text-center">
                <small className="text-muted">
                  <i className="fas fa-shield-alt me-1"></i>
                  Your payment information is secure and encrypted
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;
