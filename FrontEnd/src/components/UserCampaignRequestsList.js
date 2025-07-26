import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { authService } from '../services/authService';

const UserCampaignRequestsList = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchCampaignRequests();
  }, []);

  const fetchCampaignRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const userResponse = await authService.getProfile();
      if (userResponse.status === 'success') {
        const userId = userResponse.data.userId || userResponse.data.id || userResponse.data.user_id;
        
        if (userId) {
          const response = await campaignService.getUserCampaignRequests(userId);
          if (response.status === 'success') {
            setRequests(response.data || []);
          }
        } else {
          throw new Error('User ID not found');
        }
      }
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

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { badge: 'bg-success', icon: 'fas fa-check-circle', text: 'Approved' };
      case 'pending':
        return { badge: 'bg-warning text-dark', icon: 'fas fa-clock', text: 'Pending' };
      case 'rejected':
        return { badge: 'bg-danger', icon: 'fas fa-times-circle', text: 'Rejected' };
      case 'under_review':
        return { badge: 'bg-info', icon: 'fas fa-eye', text: 'Under Review' };
      default:
        return { badge: 'bg-secondary', icon: 'fas fa-question', text: status || 'Unknown' };
    }
  };

  const handleRequestClick = (requestId) => {
    navigate(`/my-campaign-requests/${requestId}`);
  };

  const filteredAndSortedRequests = requests
    .filter(request => {
      const matchesSearch = request.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || request.status?.toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aDate = new Date(a.startDate || 0);
      const bDate = new Date(b.startDate || 0);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Your Campaign Requests...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>Error Loading Campaign Requests</h4>
          <p>{error}</p>
          <button className="btn btn-danger" onClick={fetchCampaignRequests}>
            <i className="fas fa-sync-alt me-2"></i>Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)', color: 'white', borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h1 className="h3 mb-2">
                      <i className="fas fa-bullhorn me-2"></i>
                      My Campaign Requests
                    </h1>
                    <p className="mb-0 opacity-75">Total Requests: {requests.length}</p>
                  </div>
                  <div className="text-end">
                    <button 
                      className="btn btn-light me-2"
                      onClick={() => navigate('/dashboard')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => navigate('/request-campaign')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      New Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Requests List */}
        {filteredAndSortedRequests.length === 0 ? (
          <div className="text-center py-5">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body py-5">
                <i className="fas fa-bullhorn fa-4x text-muted mb-4"></i>
                <h4 className="text-muted">No Campaign Requests Found</h4>
                <p className="text-muted mb-4">
                  {searchTerm || statusFilter !== 'all' ? 'No requests match your criteria.' : 'You haven\'t submitted any campaign requests yet.'}
                </p>
                <button 
                  className="btn btn-warning"
                  onClick={() => navigate('/request-campaign')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Submit Your First Request
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredAndSortedRequests.map((request) => {
              const statusInfo = getStatusInfo(request.status);
              return (
                <div key={request.requestId} className="col-12 mb-3">
                  <div 
                    className="card shadow-sm border-0" 
                    style={{ 
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleRequestClick(request.requestId)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h5 className="text-warning mb-2">
                            <i className="fas fa-campaign me-2"></i>
                            {request.title}
                          </h5>
                          <p className="text-muted mb-1">
                            <i className="fas fa-calendar me-2"></i>
                            Duration: {formatDate(request.startDate)} - {formatDate(request.endDate)}
                          </p>
                          {request.feedback && (
                            <p className="text-muted mb-0">
                              <i className="fas fa-comment me-2"></i>
                              {request.feedback}
                            </p>
                          )}
                        </div>
                        <div className="col-md-3 text-center">
                          <span className={`badge ${statusInfo.badge} p-2`} style={{ fontSize: '0.9rem' }}>
                            <i className={`${statusInfo.icon} me-2`}></i>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="col-md-3 text-end">
                          <p className="text-muted mb-2">
                            <small>Request ID: {request.requestId.slice(0, 8)}...</small>
                          </p>
                          <div className="d-flex align-items-center justify-content-end">
                            <span className="text-muted me-2">View Details</span>
                            <i className="fas fa-arrow-right text-muted"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {filteredAndSortedRequests.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4 text-center">
                  <h5 className="text-warning mb-3">Request Summary</h5>
                  <div className="row">
                    <div className="col-md-3">
                      <h3 className="text-primary">{filteredAndSortedRequests.length}</h3>
                      <p className="text-muted mb-0">Total Requests</p>
                    </div>
                    <div className="col-md-3">
                      <h3 className="text-success">
                        {filteredAndSortedRequests.filter(r => r.status?.toLowerCase() === 'approved').length}
                      </h3>
                      <p className="text-muted mb-0">Approved</p>
                    </div>
                    <div className="col-md-3">
                      <h3 className="text-warning">
                        {filteredAndSortedRequests.filter(r => r.status?.toLowerCase() === 'pending').length}
                      </h3>
                      <p className="text-muted mb-0">Pending</p>
                    </div>
                    <div className="col-md-3">
                      <h3 className="text-danger">
                        {filteredAndSortedRequests.filter(r => r.status?.toLowerCase() === 'rejected').length}
                      </h3>
                      <p className="text-muted mb-0">Rejected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCampaignRequestsList;