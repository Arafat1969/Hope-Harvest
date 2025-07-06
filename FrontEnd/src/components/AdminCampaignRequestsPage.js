import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  requestCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  requestCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  statusBadge: {
    borderRadius: '15px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  avatarPlaceholder: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#6c757d'
  }
};

const AdminCampaignRequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAllCampaignRequests();
      const requestsData = response.data || response || [];
      console.log('Campaign requests fetched:', requestsData);
      setRequests(requestsData);
    } catch (error) {
      console.error('Error fetching campaign requests:', error);
      setError('Failed to load campaign requests. Please try again.');
    } finally {
      setLoading(false);
    }
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
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'approved':
        return 'badge bg-success';
      case 'rejected':
        return 'badge bg-danger';
      case 'under_review':
      case 'under review':
        return 'badge bg-info';
      case 'cancelled':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'fas fa-clock';
      case 'approved':
        return 'fas fa-check-circle';
      case 'rejected':
        return 'fas fa-times-circle';
      case 'under_review':
      case 'under review':
        return 'fas fa-search';
      case 'cancelled':
        return 'fas fa-ban';
      default:
        return 'fas fa-question-circle';
    }
  };

  const getInitials = (email) => {
    if (!email) return '?';
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const isPastDue = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const isStartingSoon = (startDate) => {
    if (!startDate) return false;
    const start = new Date(startDate);
    const now = new Date();
    const diffDays = (start - now) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const handleViewDetails = (requestId) => {
    navigate(`/admin/campaign-requests/${requestId}`);
  };

  const handleQuickAction = async (requestId, action) => {
    try {
      let statusData = {};
      if (action === 'approve') {
        statusData = { status: 'APPROVED' };
      } else if (action === 'reject') {
        statusData = { status: 'REJECTED', feedback: 'Rejected by admin' };
      } else if (action === 'review') {
        statusData = { status: 'UNDER_REVIEW' };
      }

      await campaignService.updateCampaignRequestStatus(requestId, statusData);
      await fetchRequests(); // Refresh the list
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request. Please try again.`);
    }
  };

  const filteredAndSortedRequests = requests
    .filter(request => {
      const matchesSearch = 
        request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.proposerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.proposerPhone?.includes(searchTerm);
      
      const matchesStatus = filterStatus === 'all' || 
        request.status?.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'email':
          return (a.proposerEmail || '').localeCompare(b.proposerEmail || '');
        case 'startDate':
        default:
          return new Date(a.startDate || 0) - new Date(b.startDate || 0);
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading campaign requests...</p>
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
            onClick={fetchRequests}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="text-danger mb-1">
                    <i className="fas fa-clock me-2"></i>
                    Admin - Campaign Requests
                  </h2>
                  <p className="text-muted mb-0">
                    Review and manage all campaign requests submitted by users
                  </p>
                </div>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => navigate('/admin-dashboard')}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="text-primary">{requests.length}</h5>
              <small className="text-muted">Total Requests</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {requests.filter(r => r.status?.toLowerCase() === 'pending').length}
              </h5>
              <small className="text-muted">Pending Review</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">
                {requests.filter(r => r.status?.toLowerCase() === 'approved').length}
              </h5>
              <small className="text-muted">Approved</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-danger">
            <div className="card-body">
              <h5 className="text-danger">
                {requests.filter(r => r.status?.toLowerCase() === 'rejected').length}
              </h5>
              <small className="text-muted">Rejected</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4 mb-3 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by title, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="under_review">Under Review</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="startDate">Sort by Start Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="status">Sort by Status</option>
                    <option value="email">Sort by Email</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchRequests}
                  >
                    <i className="fas fa-sync-alt me-1"></i>
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-list me-2"></i>
                Campaign Requests ({filteredAndSortedRequests.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredAndSortedRequests.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-clock fa-3x mb-3"></i>
                  <h5>No campaign requests found</h5>
                  <p>No requests match your current search and filter criteria.</p>
                </div>
              ) : (
                <div className="row">
                  {filteredAndSortedRequests.map((request) => (
                    <div key={request.requestId} className="col-lg-6 col-md-12 mb-4">
                      <div 
                        className="card h-100" 
                        style={styles.requestCard}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.requestCardHover)}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div className="card-body d-flex flex-column">
                          {/* Header with title and status */}
                          <div className="d-flex align-items-start mb-3">
                            <div style={styles.avatarPlaceholder} className="me-3">
                              {getInitials(request.proposerEmail)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1 text-primary">{request.title || 'Untitled Request'}</h6>
                                  <small className="text-muted">{request.proposerEmail}</small>
                                </div>
                                <div className="text-end">
                                  <span className={getStatusBadgeClass(request.status)}>
                                    <i className={`${getStatusIcon(request.status)} me-1`}></i>
                                    {request.status || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <small className="text-muted d-block">Contact Phone</small>
                              <small className="fw-bold">{request.proposerPhone || 'N/A'}</small>
                            </div>
                          </div>

                          {/* Date Range */}
                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Start Date</small>
                              <small className="fw-bold">{formatDate(request.startDate)}</small>
                              {isStartingSoon(request.startDate) && (
                                <small className="badge bg-info ms-1">Soon</small>
                              )}
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">End Date</small>
                              <small className="fw-bold">{formatDate(request.endDate)}</small>
                              {isPastDue(request.endDate) && (
                                <small className="badge bg-warning ms-1">Past Due</small>
                              )}
                            </div>
                          </div>

                          {/* Feedback */}
                          {request.feedback && (
                            <div className="row mb-3">
                              <div className="col-12">
                                <small className="text-muted d-block">Feedback</small>
                                <small className="text-italic">{request.feedback}</small>
                              </div>
                            </div>
                          )}

                          {/* IDs */}
                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Request ID</small>
                              <code className="small">{request.requestId}</code>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">User ID</small>
                              <code className="small">{request.externalUserId}</code>
                            </div>
                          </div>

                          {/* Quick Actions for Pending Requests */}
                          {request.status?.toLowerCase() === 'pending' && (
                            <div className="row mb-3">
                              <div className="col-12">
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-success btn-sm flex-fill"
                                    onClick={() => handleQuickAction(request.requestId, 'approve')}
                                  >
                                    <i className="fas fa-check me-1"></i>
                                    Approve
                                  </button>
                                  <button 
                                    className="btn btn-danger btn-sm flex-fill"
                                    onClick={() => handleQuickAction(request.requestId, 'reject')}
                                  >
                                    <i className="fas fa-times me-1"></i>
                                    Reject
                                  </button>
                                  <button 
                                    className="btn btn-info btn-sm flex-fill"
                                    onClick={() => handleQuickAction(request.requestId, 'review')}
                                  >
                                    <i className="fas fa-search me-1"></i>
                                    Review
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Main Action Button */}
                          <div className="mt-auto">
                            <button
                              className="btn btn-outline-primary w-100"
                              onClick={() => handleViewDetails(request.requestId)}
                            >
                              <i className="fas fa-eye me-2"></i>
                              View Full Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignRequestsPage;