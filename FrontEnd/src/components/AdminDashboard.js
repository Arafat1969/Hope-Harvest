import { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { campaignService } from '../services/campaignService';
import { donationService } from '../services/donationService';

const styles = {
  adminCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  statCard: {
    background: 'linear-gradient(135deg, #FF5722 0%, #D84315 100%)',
    color: 'white',
    borderRadius: '0.75rem'
  },
  pendingCard: {
    borderLeft: '4px solid #FF9800'
  },
  approvedCard: {
    borderLeft: '4px solid #4CAF50'
  },
  rejectedCard: {
    borderLeft: '4px solid #F44336'
  }
};

const AdminDashboard = () => {
  const [adminStats, setAdminStats] = useState({
    totalCampaigns: 0,
    totalDonations: 0,
    totalUsers: 0,
    pendingCampaigns: 0,
    totalFundsRaised: 0
  });  const [recentDonations, setRecentDonations] = useState([]);
  const [campaignRequests, setCampaignRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);
  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin statistics and data using admin APIs
      const [campaignsRes, donationStatsRes, userStatsRes, campaignRequestsRes, recentDonationsRes] = await Promise.allSettled([
        campaignService.getAllCampaignsAdmin(),
        donationService.getDonationStatistics(),
        authService.getUserStatistics(),
        campaignService.getAllCampaignRequests(),
        donationService.getRecentDonations(5)
      ]);

      // Handle campaigns data
      if (campaignsRes.status === 'fulfilled' && campaignsRes.value.status === 'success') {
        const campaigns = campaignsRes.value.data || [];
        setAdminStats(prev => ({
          ...prev,
          totalCampaigns: campaigns.length,
          totalFundsRaised: campaigns.reduce((sum, c) => sum + (c.currentAmount || 0), 0)
        }));
      }

      // Handle donation statistics
      if (donationStatsRes.status === 'fulfilled' && donationStatsRes.value.status === 'success') {
        const donationStats = donationStatsRes.value.data || {};
        setAdminStats(prev => ({
          ...prev,
          totalDonations: donationStats.totalDonations || 0,
          totalFundsRaised: donationStats.totalAmount || prev.totalFundsRaised
        }));
      }

      // Handle user statistics
      if (userStatsRes.status === 'fulfilled' && userStatsRes.value.status === 'success') {
        const userStats = userStatsRes.value.data || {};
        setAdminStats(prev => ({
          ...prev,
          totalUsers: userStats.totalUsers || 0
        }));
      }

      // Handle campaign requests
      if (campaignRequestsRes.status === 'fulfilled' && campaignRequestsRes.value.status === 'success') {
        const requests = campaignRequestsRes.value.data || [];
        setCampaignRequests(requests);
        setAdminStats(prev => ({
          ...prev,
          pendingCampaigns: requests.filter(r => r.status === 'pending').length
        }));
      } else {
        // Fallback mock data if API not implemented yet
        setCampaignRequests([
          {
            id: 1,
            title: "Emergency Flood Relief - Sylhet",
            requester: "Mohammad Rahman",
            requestDate: "2025-06-15",
            status: "pending",
            targetAmount: 500000
          },
          {
            id: 2,
            title: "Winter Clothing Distribution",
            requester: "Fatima Khatun",
            requestDate: "2025-06-14",
            status: "pending",
            targetAmount: 200000
          }
        ]);
      }

      // Handle recent donations
      if (recentDonationsRes.status === 'fulfilled' && recentDonationsRes.value.status === 'success') {
        const donations = recentDonationsRes.value.data || [];
        setRecentDonations(donations);
      } else {
        // Fallback mock data
        setRecentDonations([
          {
            id: 1,
            donor: "Anonymous",
            amount: 5000,
            campaign: "Flood Relief Fund",
            date: "2025-06-19",
            status: "completed"
          },
          {
            id: 2,
            donor: "Sarah Ahmed",
            amount: 2000,
            campaign: "Education Support",
            date: "2025-06-19",
            status: "completed"
          }
        ]);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  };
  const handleCampaignAction = async (requestId, action) => {
    try {
      // Use admin APIs to approve/reject campaign requests
      if (action === 'approve') {
        await campaignService.approveCampaignRequest(requestId);
      } else if (action === 'reject') {
        await campaignService.rejectCampaignRequest(requestId, 'Rejected by admin');
      }
      
      // Update local state
      setCampaignRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
            : req
        )
      );

      // Update pending count
      setAdminStats(prev => ({
        ...prev,
        pendingCampaigns: prev.pendingCampaigns - 1
      }));

    } catch (error) {
      console.error(`Error ${action}ing campaign:`, error);
      // Show error message to user
      alert(`Failed to ${action} campaign. Please try again.`);
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
      case 'approved':
      case 'completed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
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
                Manage campaigns, donations, and user activities across the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-5">
        <div className="col-lg-2 col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-bullhorn fa-2x mb-3"></i>
              <h4 className="mb-1">{adminStats.totalCampaigns}</h4>
              <p className="mb-0 small">Total Campaigns</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-hand-holding-heart fa-2x mb-3"></i>
              <h4 className="mb-1">{adminStats.totalDonations}</h4>
              <p className="mb-0 small">Total Donations</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-3"></i>
              <h4 className="mb-1">{adminStats.totalUsers}</h4>
              <p className="mb-0 small">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-lg-2 col-md-4 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-clock fa-2x mb-3"></i>
              <h4 className="mb-1">{adminStats.pendingCampaigns}</h4>
              <p className="mb-0 small">Pending Requests</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 col-md-8 mb-3">
          <div className="card" style={styles.statCard}>
            <div className="card-body text-center">
              <i className="fas fa-money-bill-wave fa-2x mb-3"></i>
              <h4 className="mb-1">{formatCurrency(adminStats.totalFundsRaised)}</h4>
              <p className="mb-0 small">Total Funds Raised</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Campaign Requests Management */}
        <div className="col-lg-8 mb-4">
          <div className="card" style={styles.adminCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-tasks me-2"></i>
                Campaign Requests Management
              </h5>
            </div>
            <div className="card-body">
              {campaignRequests.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-inbox fa-2x mb-3"></i>
                  <p>No pending campaign requests</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Campaign Title</th>
                        <th>Requester</th>
                        <th>Target Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaignRequests.map((request) => (
                        <tr key={request.id}>
                          <td>
                            <div style={request.status === 'pending' ? styles.pendingCard : 
                                       request.status === 'approved' ? styles.approvedCard : 
                                       styles.rejectedCard} 
                                 className="p-2">
                              <strong>{request.title}</strong>
                            </div>
                          </td>
                          <td>{request.requester}</td>
                          <td className="fw-bold text-primary">
                            {formatCurrency(request.targetAmount)}
                          </td>
                          <td>
                            {new Date(request.requestDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span className={getStatusBadgeClass(request.status)}>
                              {request.status}
                            </span>
                          </td>
                          <td>
                            {request.status === 'pending' && (
                              <div className="btn-group" role="group">
                                <button
                                  className="btn btn-success btn-sm"
                                  onClick={() => handleCampaignAction(request.id, 'approve')}
                                >
                                  <i className="fas fa-check"></i>
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleCampaignAction(request.id, 'reject')}
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Donations */}
        <div className="col-lg-4 mb-4">
          <div className="card" style={styles.adminCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-heart me-2"></i>
                Recent Donations
              </h5>
            </div>
            <div className="card-body">
              {recentDonations.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="fas fa-heart fa-2x mb-3"></i>
                  <p>No recent donations</p>
                </div>
              ) : (
                <div>
                  {recentDonations.map((donation) => (
                    <div key={donation.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{donation.donor}</h6>
                          <small className="text-muted">{donation.campaign}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold text-success">
                            {formatCurrency(donation.amount)}
                          </div>
                          <span className={getStatusBadgeClass(donation.status)}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                      <small className="text-muted">
                        {new Date(donation.date).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Admin Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.adminCard}>
            <div className="card-body">
              <h5 className="text-danger mb-3">Quick Admin Actions</h5>
              <div className="row">
                <div className="col-md-2 mb-2">
                  <button className="btn btn-danger w-100">
                    <i className="fas fa-plus me-2"></i>
                    Create Campaign
                  </button>
                </div>
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-danger w-100">
                    <i className="fas fa-users me-2"></i>
                    Manage Users
                  </button>
                </div>
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-danger w-100">
                    <i className="fas fa-chart-bar me-2"></i>
                    View Reports
                  </button>
                </div>
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-danger w-100">
                    <i className="fas fa-cog me-2"></i>
                    Settings
                  </button>
                </div>
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-danger w-100">
                    <i className="fas fa-money-check-alt me-2"></i>
                    Payments
                  </button>
                </div>
                <div className="col-md-2 mb-2">
                  <button className="btn btn-outline-danger w-100">
                    <i className="fas fa-file-export me-2"></i>
                    Export Data
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
