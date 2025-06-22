import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';

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
  }
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [campaignRequests, setCampaignRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalDonated: 0,
    donationCount: 0,
    campaignRequests: 0
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
          const donationsResponse = await donationService.getUserDonations(userId);
          if (donationsResponse.status === 'success') {
            setDonations(donationsResponse.data || []);
            
            // Calculate stats
            const totalDonated = donationsResponse.data?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0;
            setStats(prev => ({
              ...prev,
              totalDonated,
              donationCount: donationsResponse.data?.length || 0
            }));
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
            // Set empty campaign requests if API not implemented yet
            setCampaignRequests([]);
            setStats(prev => ({
              ...prev,
              campaignRequests: 0
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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'verified':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'failed':
      case 'rejected':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
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
        <div className="col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-heart fa-3x mb-3"></i>
              <h3 className="mb-1">{formatCurrency(stats.totalDonated)}</h3>
              <p className="mb-0">Total Donated</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-hand-holding-heart fa-3x mb-3"></i>
              <h3 className="mb-1">{stats.donationCount}</h3>
              <p className="mb-0">Donations Made</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-bullhorn fa-3x mb-3"></i>
              <h3 className="mb-1">{stats.campaignRequests}</h3>
              <p className="mb-0">Campaign Requests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Recent Donations */}
        <div className="col-lg-8 mb-4">
          <div className="card" style={styles.dashboardCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-success">
                <i className="fas fa-list me-2"></i>
                Recent Donations
              </h5>
            </div>
            <div className="card-body">
              {donations.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-heart fa-2x mb-3"></i>
                  <p>No donations yet. Start making a difference today!</p>
                  <button className="btn btn-success">Make Your First Donation</button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {donations.slice(0, 5).map((donation) => (
                        <tr key={donation.donationId}>
                          <td>
                            <div style={styles.donationCard} className="p-2">
                              <strong>{donation.campaignTitle || 'Campaign'}</strong>
                              {donation.message && (
                                <small className="d-block text-muted">
                                  "{donation.message}"
                                </small>
                              )}
                            </div>
                          </td>
                          <td className="fw-bold text-success">
                            {formatCurrency(donation.amount)}
                          </td>
                          <td>
                            {new Date(donation.donationDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(donation.status)}>
                              {donation.status || 'completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {donations.length > 5 && (
                <div className="text-center mt-3">
                  <button className="btn btn-outline-success">
                    View All Donations
                  </button>
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
                  <p>No campaign requests yet.</p>                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => navigate('/request-campaign')}
                  >
                    Submit Request
                  </button>
                </div>
              ) : (
                <div>
                  {campaignRequests.slice(0, 3).map((request) => (
                    <div key={request.requestId} className="border-bottom pb-3 mb-3">
                      <div style={styles.campaignCard} className="p-2">
                        <h6 className="mb-1">{request.title}</h6>
                        <small className="text-muted d-block mb-2">
                          Requested: {new Date(request.requestDate).toLocaleDateString()}
                        </small>
                        <span className={getStatusBadgeClass(request.status)}>
                          {request.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {campaignRequests.length > 3 && (
                    <div className="text-center">
                      <button className="btn btn-outline-success btn-sm">
                        View All Requests
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
                <div className="col-md-3 mb-2">
                  <button className="btn btn-success w-100"
                    onClick={() => navigate('/donate')}
                  >
                    <i className="fas fa-heart me-2"></i>
                    Make Donation
                  </button>
                </div>                <div className="col-md-3 mb-2">
                  <button 
                    className="btn btn-outline-success w-100"
                    onClick={() => navigate('/request-campaign')}
                  >
                    <i className="fas fa-bullhorn me-2"></i>
                    Request Campaign
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-success w-100"
                    onClick={() => navigate('/volunteer-activity')}
                  >
                    <i className="fas fa-hands-helping me-2"></i>
                    Volunteer
                  </button>
                </div>
                <div className="col-md-3 mb-2">
                  <button className="btn btn-outline-success w-100">
                    <i className="fas fa-user me-2"></i>
                    Edit Profile
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
