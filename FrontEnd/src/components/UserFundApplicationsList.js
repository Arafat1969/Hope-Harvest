import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fundApplicationService } from '../services/fundApplicationService';
import { authService } from '../services/authService';

const UserFundApplicationsList = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchFundApplications();
  }, []);

  const fetchFundApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const userResponse = await authService.getProfile();
      if (userResponse.status === 'success') {
        const userId = userResponse.data.userId || userResponse.data.id || userResponse.data.user_id;
        
        if (userId) {
          const response = await fundApplicationService.getUserFundApplications(userId);
          const fundData = response.data || response || [];
          setApplications(Array.isArray(fundData) ? fundData : []);
        } else {
          throw new Error('User ID not found');
        }
      }
    } catch (error) {
      console.error('Error fetching fund applications:', error);
      setError('Failed to load fund applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    //if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
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
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return { badge: 'bg-success', icon: 'fas fa-check-circle', text: 'Approved' };
      case 'PENDING':
        return { badge: 'bg-warning text-dark', icon: 'fas fa-clock', text: 'Pending' };
      case 'REJECTED':
        return { badge: 'bg-danger', icon: 'fas fa-times-circle', text: 'Rejected' };
      case 'DISBURSED':
        return { badge: 'bg-primary', icon: 'fas fa-money-check-alt', text: 'Disbursed' };
      case 'VERIFIED':
        return { badge: 'bg-info', icon: 'fas fa-shield-alt', text: 'Verified' };
      default:
        return { badge: 'bg-secondary', icon: 'fas fa-question', text: status || 'Unknown' };
    }
  };

  const handleApplicationClick = (applicationId) => {
    navigate(`/my-fund-applications/${applicationId}`);
  };

  const filteredAndSortedApplications = applications
    .filter(application => {
      const matchesSearch = application.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           application.district?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || application.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aDate = new Date(a.submissionDate || 0);
      const bDate = new Date(b.submissionDate || 0);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Your Fund Applications...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>Error Loading Fund Applications</h4>
          <p>{error}</p>
          <button className="btn btn-danger" onClick={fetchFundApplications}>
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
              <div className="card-body" style={{ background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)', color: 'white', borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h1 className="h3 mb-2">
                      <i className="fas fa-money-check-alt me-2"></i>
                      My Fund Applications
                    </h1>
                    <p className="mb-0 opacity-75">Total Applications: {applications.length}</p>
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
                      onClick={() => navigate('/apply-for-funds')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      New Application
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
                placeholder="Search by purpose or district..."
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
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DISBURSED">Disbursed</option>
              <option value="VERIFIED">Verified</option>
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

        {/* Applications List */}
        {filteredAndSortedApplications.length === 0 ? (
          <div className="text-center py-5">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body py-5">
                <i className="fas fa-file-invoice-dollar fa-4x text-muted mb-4"></i>
                <h4 className="text-muted">No Fund Applications Found</h4>
                <p className="text-muted mb-4">
                  {searchTerm || statusFilter !== 'all' ? 'No applications match your criteria.' : 'You haven\'t submitted any fund applications yet.'}
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/apply-for-funds')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Submit Your First Application
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredAndSortedApplications.map((application) => {
              const statusInfo = getStatusInfo(application.status);
              return (
                <div key={application.applicationId} className="col-12 mb-3">
                  <div 
                    className="card shadow-sm border-0" 
                    style={{ 
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => handleApplicationClick(application.applicationId)}
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
                          <h5 className="text-primary mb-2">
                            <i className="fas fa-bullseye me-2"></i>
                            {application.purpose}
                          </h5>
                          <p className="text-muted mb-1">
                            <i className="fas fa-map-marker-alt me-2"></i>
                            {application.district}, {application.upazilla}
                          </p>
                          <p className="text-muted mb-0">
                            <i className="fas fa-calendar me-2"></i>
                            Submitted: {formatDate(application.submissionDate)}
                          </p>
                        </div>
                        <div className="col-md-3 text-center">
                          <h4 className="text-success mb-1">{formatCurrency(application.amount)}</h4>
                          { (
                            <small className="text-info d-block">
                              Disbursed: {formatCurrency(application.disbursedAmount)}
                            </small>
                          )}
                          <span className={`badge ${statusInfo.badge} mt-2`} style={{ fontSize: '0.8rem' }}>
                            <i className={`${statusInfo.icon} me-1`}></i>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div className="col-md-3 text-end">
                          {application.disbursementDate && (
                            <p className="text-muted mb-2">
                              <small>Disbursed: {formatDate(application.disbursementDate)}</small>
                            </p>
                          )}
                          <div className="d-flex align-items-center justify-content-end">
                            <span className="text-muted me-2">View Details</span>
                            <i className="fas fa-arrow-right text-muted"></i>
                          </div>
                        </div>
                      </div>
                      {application.feedback && (
                        <div className="row mt-3">
                          <div className="col-12">
                            <div className="alert alert-light border mb-0" style={{ borderRadius: '8px' }}>
                              <small className="text-muted">
                                <i className="fas fa-comment me-2"></i>
                                <strong>Feedback:</strong> {application.feedback}
                              </small>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {filteredAndSortedApplications.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4 text-center">
                  <h5 className="text-primary mb-3">Application Summary</h5>
                  <div className="row">
                    <div className="col-md-2">
                      <h3 className="text-primary">{filteredAndSortedApplications.length}</h3>
                      <p className="text-muted mb-0">Total</p>
                    </div>
                    <div className="col-md-2">
                      <h3 className="text-warning">
                        {filteredAndSortedApplications.filter(a => a.status?.toUpperCase() === 'PENDING').length}
                      </h3>
                      <p className="text-muted mb-0">Pending</p>
                    </div>
                    <div className="col-md-2">
                      <h3 className="text-success">
                        {filteredAndSortedApplications.filter(a => a.status?.toUpperCase() === 'APPROVED').length}
                      </h3>
                      <p className="text-muted mb-0">Approved</p>
                    </div>
                    <div className="col-md-2">
                      <h3 className="text-info">
                        {filteredAndSortedApplications.filter(a => a.status?.toUpperCase() === 'DISBURSED').length}
                      </h3>
                      <p className="text-muted mb-0">Disbursed</p>
                    </div>
                    <div className="col-md-2">
                      <h3 className="text-success">
                        {formatCurrency(filteredAndSortedApplications.reduce((sum, a) => sum + (a.amount || 0), 0))}
                      </h3>
                      <p className="text-muted mb-0">Total Requested</p>
                    </div>
                    <div className="col-md-2">
                      <h3 className="text-primary">
                        {formatCurrency(filteredAndSortedApplications.reduce((sum, a) => sum + (a.disbursedAmount || 0), 0))}
                      </h3>
                      <p className="text-muted mb-0">Total Disbursed</p>
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

export default UserFundApplicationsList;