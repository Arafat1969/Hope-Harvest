import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { fundApplicationService } from '../services/fundApplicationService';
import { volunteerService } from '../services/volunteerService';

const styles = {
  dashboardCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  statCard: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    color: 'white',
    borderRadius: '0.75rem'
  },
  donationCard: {
    borderLeft: '4px solid #4CAF50'
  },
  campaignCard: {
    borderLeft: '4px solid #FF9800'
  },
  fundCard: {
    borderLeft: '4px solid #2196F3'
  },
  clickableCard: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent'
  },
  clickableCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    borderColor: '#e9ecef'
  }
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [campaignRequests, setCampaignRequests] = useState([]);
  const [fundApplications, setFundApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    campaignRequests: 0,
    fundApplications: 0
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Get user profile
      const userResponse = await authService.getProfile();
      if (userResponse.status === 'success') {
        console.log('User profile response:', userResponse.data); // Debug log
        setUser(userResponse.data);
        
        // Extract userId - check different possible field names
        const userId = userResponse.data.userId || userResponse.data.id || userResponse.data.user_id;
        console.log('Extracted userId:', userId); // Debug log
        
        if (userId) {
          // Get user donations
          try {
            const donationsResponse = await donationService.getUserDonations(userId);
            if (donationsResponse.status === 'success') {
              setDonations(donationsResponse.data || []);
              
              // Calculate donation stats
              const totalDonated = donationsResponse.data?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0;
              setStats(prev => ({
                ...prev,
                totalDonated,
                donationCount: donationsResponse.data?.length || 0
              }));
            }
          } catch (donationError) {
            console.warn('Donations not available:', donationError);
            setDonations([]);
          }
          
          // Get campaign requests with userId
          try {
            const campaignResponse = await campaignService.getUserCampaignRequests(userId);
            if (campaignResponse.status === 'success') {
              setCampaignRequests(campaignResponse.data || []);
              setStats(prev => ({
                ...prev,
                campaignRequests: campaignResponse.data?.length || 0
              }));
            }
          } catch (campaignError) {
            console.warn('Campaign requests not available:', campaignError);
            setCampaignRequests([]);
          }

          // Get fund applications with userId
          try {
            console.log("hii");
            const fundResponse = await fundApplicationService.getUserFundApplications(userId);
            console.log('Fund applications response:', fundResponse); // Debug log
            
            // Handle both direct array and wrapped response
            const fundData = fundResponse.data || fundResponse || [];
            setFundApplications(Array.isArray(fundData) ? fundData : []);
            setStats(prev => ({
              ...prev,
              fundApplications: Array.isArray(fundData) ? fundData.length : 0
            }));
          } catch (fundError) {
            console.warn('Fund applications not available:', fundError);
            setFundApplications([]);
            setStats(prev => ({
              ...prev,
              fundApplications: 0
            }));
          }
        } else {
          console.warn('No userId found in user profile response');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load dashboard data');
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
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'verified':
      case 'approved':
      case 'disbursed':
        return 'badge bg-success';
      case 'pending':
      case 'under_review':
        return 'badge bg-warning';
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  // Navigation handlers
  const handleDonationClick = (donationId) => {
    navigate(`/my-donations/${donationId}`);
  };

  const handleCampaignRequestClick = (requestId) => {
    navigate(`/my-campaign-requests/${requestId}`);
  };

  const handleFundApplicationClick = (applicationId) => {
    navigate(`/my-fund-applications/${applicationId}`);
  };

  // Updated volunteer click handler with volunteer status check
  const handleVolunteerClick = async () => {
    try {
      // Check if user is a registered volunteer
      const userId = user?.userId || user?.id || user?.user_id;
      if (userId) {
        try {
          const volunteerProfile = await volunteerService.getVolunteerProfile(userId);
          if (volunteerProfile && (volunteerProfile.data || volunteerProfile)) {
            // User is a registered volunteer, go to volunteer dashboard
            console.log('User is a registered volunteer, redirecting to volunteer dashboard');
            navigate('/volunteer-dashboard');
          } else {
            // Not a registered volunteer, go to volunteer activity
            console.log('User is not a registered volunteer, redirecting to volunteer activity');
            navigate('/volunteer-activity');
          }
        } catch (error) {
          // If error (likely 404), user is not a registered volunteer
          console.log('User is not a registered volunteer (API error):', error);
          navigate('/volunteer-activity');
        }
      } else {
        console.log('No user ID available, redirecting to volunteer activity');
        navigate('/volunteer-activity');
      }
    } catch (error) {
      console.error('Error checking volunteer status:', error);
      navigate('/volunteer-activity');
    }
  };

  // Hover effect handlers
  const handleCardHover = (e, isEntering) => {
    if (isEntering) {
      Object.assign(e.currentTarget.style, styles.clickableCardHover);
    } else {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
      e.currentTarget.style.borderColor = 'transparent';
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-outline-danger ms-3" 
            onClick={fetchUserData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={styles.dashboardCard}>
            <div className="card-body">
              <h2 className="text-success mb-3">
                Welcome back, {user?.firstName || 'User'}! 👋
              </h2>
              <p className="text-muted mb-0">
                Here's an overview of your contributions and activities
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-heart fa-3x mb-3"></i>
              <h3 className="mb-1">{formatCurrency(stats.totalDonated)}</h3>
              <p className="mb-0">Total Donated</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-hand-holding-heart fa-3x mb-3"></i>
              <h3 className="mb-1">{stats.donationCount}</h3>
              <p className="mb-0">Donations Made</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-bullhorn fa-3x mb-3"></i>
              <h3 className="mb-1">{stats.campaignRequests}</h3>
              <p className="mb-0">Campaign Requests</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-money-check-alt fa-3x mb-3"></i>
              <h3 className="mb-1">{stats.fundApplications}</h3>
              <p className="mb-0">Fund Applications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Donations */}
        <div className="col-lg-4 mb-4">
          <div className="card" style={styles.dashboardCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-success">
                <i className="fas fa-heart me-2"></i>
                Recent Donations
              </h5>
            </div>
            <div className="card-body">
              {donations.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-heart fa-2x mb-3"></i>
                  <p>No donations yet. Start making a difference today!</p>
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => navigate('/donate')}
                  >
                    Make Your First Donation
                  </button>
                </div>
              ) : (
                <div>
                  {donations.slice(0, 4).map((donation) => (
                    <div key={donation.donationId} className="border-bottom pb-3 mb-3">
                      <div 
                        style={{...styles.donationCard, ...styles.clickableCard}} 
                        className="p-2"
                        onClick={() => handleDonationClick(donation.donationId)}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleDonationClick(donation.donationId);
                          }
                        }}
                      >
                        <h6 className="mb-1">
                          {donation.campaignTitle || 'Campaign'}
                          <i className="fas fa-external-link-alt ms-2 text-muted" style={{fontSize: '0.8rem'}}></i>
                        </h6>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-success">{formatCurrency(donation.amount)}</strong>
                          <small className="text-muted">{formatDate(donation.donationDate)}</small>
                        </div>
                        <span className={getStatusBadgeClass(donation.status)}>
                          {donation.status || 'completed'}
                        </span>
                        {donation.message && (
                          <small className="d-block text-muted mt-1">
                            "{donation.message}"
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {donations.length > 4 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => navigate('/my-donations')}
                      >
                        View All Donations ({donations.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaign Requests */}
        <div className="col-lg-4 mb-4">
          <div className="card" style={styles.dashboardCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-success">
                <i className="fas fa-bullhorn me-2"></i>
                Campaign Requests
              </h5>
            </div>
            <div className="card-body">
              {campaignRequests.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-plus-circle fa-2x mb-3"></i>
                  <p>No campaign requests yet.</p>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => navigate('/request-campaign')}
                  >
                    Submit Request
                  </button>
                </div>
              ) : (
                <div>
                  {campaignRequests.slice(0, 4).map((request) => (
                    <div key={request.requestId} className="border-bottom pb-3 mb-3">
                      <div 
                        style={{...styles.campaignCard, ...styles.clickableCard}} 
                        className="p-2"
                        onClick={() => handleCampaignRequestClick(request.requestId)}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleCampaignRequestClick(request.requestId);
                          }
                        }}
                      >
                        <h6 className="mb-1">
                          {request.title}
                          <i className="fas fa-external-link-alt ms-2 text-muted" style={{fontSize: '0.8rem'}}></i>
                        </h6>
                        <small className="text-muted d-block mb-2">
                          Requested: {formatDate(request.requestDate)}
                        </small>
                        <span className={getStatusBadgeClass(request.status)}>
                          {request.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {campaignRequests.length > 4 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => navigate('/my-campaign-requests')}
                      >
                        View All Requests ({campaignRequests.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fund Applications */}
        <div className="col-lg-4 mb-4">
          <div className="card" style={styles.dashboardCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-success">
                <i className="fas fa-money-check-alt me-2"></i>
                Fund Applications
              </h5>
            </div>
            <div className="card-body">
              {fundApplications.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-file-invoice-dollar fa-2x mb-3"></i>
                  <p>No fund applications yet.</p>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => navigate('/apply-for-funds')}
                  >
                    Apply for Funds
                  </button>
                </div>
              ) : (
                <div>
                  {fundApplications.slice(0, 4).map((application) => (
                    <div key={application.applicationId} className="border-bottom pb-3 mb-3">
                      <div 
                        style={{...styles.fundCard, ...styles.clickableCard}} 
                        className="p-2"
                        onClick={() => handleFundApplicationClick(application.applicationId)}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleFundApplicationClick(application.applicationId);
                          }
                        }}
                      >
                        <h6 className="mb-1">
                          {application.purpose}
                          <i className="fas fa-external-link-alt ms-2 text-muted" style={{fontSize: '0.8rem'}}></i>
                        </h6>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <strong className="text-primary">{formatCurrency(application.amount)}</strong>
                          <small className="text-muted">{formatDate(application.submissionDate)}</small>
                        </div>
                        <span className={getStatusBadgeClass(application.status)}>
                          {application.status || 'Pending'}
                        </span>
                        {application.disbursedAmount && application.disbursedAmount > 0 && (
                          <small className="d-block text-success mt-1">
                            Disbursed: {formatCurrency(application.disbursedAmount)}
                          </small>
                        )}
                        {application.feedback && (
                          <small className="d-block text-muted mt-1">
                            "{application.feedback}"
                          </small>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {fundApplications.length > 4 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-outline-success btn-sm"
                        onClick={() => navigate('/my-fund-applications')}
                      >
                        View All Applications ({fundApplications.length})
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.dashboardCard}>
            <div className="card-body">
              <h5 className="text-success mb-3">Quick Actions</h5>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-2">
                  <button 
                    className="btn btn-success w-100"
                    onClick={() => navigate('/donate')}
                  >
                    <i className="fas fa-heart me-2"></i>
                    Make Donation
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => navigate('/request-campaign')}
                  >
                    <i className="fas fa-bullhorn me-2"></i>
                    Request Campaign
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => navigate('/apply-for-funds')}
                  >
                    <i className="fas fa-money-check-alt me-2"></i>
                    Apply for Funds
                  </button>
                </div>
                <div className="col-lg-3 col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={handleVolunteerClick}
                  >
                    <i className="fas fa-hands-helping me-2"></i>
                    Volunteer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;