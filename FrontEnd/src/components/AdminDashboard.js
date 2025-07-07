import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';
import { volunteerService } from '../services/volunteerService';
import { eventService } from '../services/eventService';
import { fundApplicationService } from '../services/fundApplicationService';

const styles = {
  adminCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  statCard: {
    background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
    color: 'white',
    borderRadius: '0.75rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  statCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalUsers: 0,
    pendingCampaigns: 0,
    totalFundsRaised: 0,
    successfulDonations: 0,
    failedDonations: 0,
    pendingDonations: 0,
    totalVolunteers: 0,
    totalEvents: 0,
    totalFundApplications: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch all admin statistics
      const [
        campaignsRes, 
        donationStatsRes, 
        userRes, 
        campaignRequestsRes, 
        donationsRes,
        volunteersRes,
        eventsRes,
        fundApplicationsRes
      ] = await Promise.allSettled([
        campaignService.getAllCampaignsAdmin(),
        donationService.getDonationStatistics(),
        authService.getAllUsers(),
        campaignService.getAllCampaignRequests(),
        donationService.getAllDonations(),
        volunteerService.getAllVolunteersAdmin(),
        eventService.getAllEventsAdmin(),
        fundApplicationService.getAllFundApplicationsAdmin()
      ]);

      // Initialize stats object
      let stats = {
        totalCampaigns: 0,
        totalDonations: 0,
        totalUsers: 0,
        pendingCampaigns: 0,
        totalFundsRaised: 0,
        successfulDonations: 0,
        failedDonations: 0,
        pendingDonations: 0,
        totalVolunteers: 0,
        totalEvents: 0,
        totalFundApplications: 0
      };

      // Handle campaigns data
      if (campaignsRes.status === 'fulfilled' && campaignsRes.value) {
        const campaigns = campaignsRes.value.data || campaignsRes.value || [];
        stats.totalCampaigns = campaigns.length;
        stats.totalFundsRaised = campaigns.reduce((sum, campaign) => sum + (parseFloat(campaign.collectedAmount) || 0), 0);
      }

      // Handle donation statistics
      if (donationStatsRes.status === 'fulfilled' && donationStatsRes.value) {
        const donationStats = donationStatsRes.value.data || donationStatsRes.value || {};
        stats.totalDonations = donationStats.totalDonations || 0;
        stats.successfulDonations = donationStats.successfulDonations || 0;
        stats.failedDonations = donationStats.failedDonations || 0;
        stats.pendingDonations = donationStats.pendingDonations || 0;
        if (donationStats.totalAmount) {
          stats.totalFundsRaised = parseFloat(donationStats.totalAmount);
        }
      }

      // Handle user statistics
      if (userRes.status === 'fulfilled' && userRes.value) {
        const users = userRes.value.data || userRes.value || [];
        stats.totalUsers = users.length;
      }

      // Handle campaign requests
      if (campaignRequestsRes.status === 'fulfilled' && campaignRequestsRes.value) {
        const requests = campaignRequestsRes.value.data || campaignRequestsRes.value || [];
        stats.pendingCampaigns = requests.filter(r => r.status?.toLowerCase() === 'pending').length;
      }

      // Handle volunteers
      if (volunteersRes.status === 'fulfilled' && volunteersRes.value) {
        const volunteers = volunteersRes.value.data || volunteersRes.value || [];
        stats.totalVolunteers = volunteers.length;
      }

      // Handle events
      if (eventsRes.status === 'fulfilled' && eventsRes.value) {
        const events = eventsRes.value.data || eventsRes.value || [];
        stats.totalEvents = events.length;
      }

      // Handle fund applications
      if (fundApplicationsRes.status === 'fulfilled' && fundApplicationsRes.value) {
        const fundApplications = fundApplicationsRes.value.data || fundApplicationsRes.value || [];
        console.log(fundApplications);
        stats.totalFundApplications = fundApplications.length;
      }

      setAdminStats(stats);

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin dashboard data');
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

  const handleCardClick = (route) => {
    navigate(route);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading admin dashboard...</p>
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
            onClick={fetchAdminData}
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
          <div className="card" style={styles.adminCard}>
            <div className="card-body">
              <h2 className="text-danger mb-3">
                <i className="fas fa-shield-alt me-2"></i>
                Admin Dashboard 🛡️
              </h2>
              <p className="text-muted mb-0">
                Manage campaigns, donations, events, volunteers, and user activities across the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/campaigns')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-bullhorn fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.totalCampaigns}</h3>
              <p className="mb-0">Total Campaigns</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/donations')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-hand-holding-heart fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.totalDonations}</h3>
              <p className="mb-0">Total Donations</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/volunteers')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-hands-helping fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.totalVolunteers}</h3>
              <p className="mb-0">Total Volunteers</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/events')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-calendar-alt fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.totalEvents}</h3>
              <p className="mb-0">Total Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Statistics Cards */}
      <div className="row mb-5">
        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/users')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-users fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.totalUsers}</h3>
              <p className="mb-0">Total Users</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/fund-applications')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-money-check-alt fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.totalFundApplications}</h3>
              <p className="mb-0">Fund Applications</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div 
            className="card" 
            style={styles.statCard}
            onClick={() => handleCardClick('/admin/campaign-requests')}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.statCardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div className="card-body text-center">
              <i className="fas fa-clock fa-3x mb-3"></i>
              <h3 className="mb-1">{adminStats.pendingCampaigns}</h3>
              <p className="mb-0">Pending Requests</p>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-money-bill-wave fa-3x mb-3"></i>
              <h3 className="mb-1">{formatCurrency(adminStats.totalFundsRaised)}</h3>
              <p className="mb-0">Total Funds Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Statistics Row */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <i className="fas fa-check-circle text-success fa-2x mb-2"></i>
              <h5 className="text-success">{adminStats.successfulDonations}</h5>
              <small className="text-muted">Successful Donations</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <i className="fas fa-hourglass-half text-warning fa-2x mb-2"></i>
              <h5 className="text-warning">{adminStats.pendingDonations}</h5>
              <small className="text-muted">Pending Donations</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-danger">
            <div className="card-body text-center">
              <i className="fas fa-times-circle text-danger fa-2x mb-2"></i>
              <h5 className="text-danger">{adminStats.failedDonations}</h5>
              <small className="text-muted">Failed Donations</small>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.adminCard}>
            <div className="card-body">
              <h5 className="text-danger mb-3">
                <i className="fas fa-tools me-2"></i>
                Quick Admin Actions
              </h5>
              <div className="row">
                <div className="col-lg-2 col-md-4 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate('/admin/create/category')}
                  >
                    <i className="fas fa-bullhorn me-2"></i>
                    Create Category
                  </button>
                </div>
                <div className="col-lg-2 col-md-4 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate('/admin/create/campaigns')}
                  >
                    <i className="fas fa-bullhorn me-2"></i>
                    Create Campaigns
                  </button>
                </div>
                <div className="col-lg-2 col-md-4 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate('/admin/create/events')}
                  >
                    <i className="fas fa-hands-helping me-2"></i>
                    Create Event
                  </button>
                </div>
                <div className="col-lg-2 col-md-4 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate('/admin/create/team')}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    Create Team
                  </button>
                </div>
                <div className="col-lg-2 col-md-4 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate('/admin/fund-applications')}
                  >
                    <i className="fas fa-money-check-alt me-2"></i>
                    Fund Applications
                  </button>
                </div>
                <div className="col-lg-2 col-md-4 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={() => navigate('/admin/campaign-requests')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>
                    Campaign Requests
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

export default AdminDashboard;