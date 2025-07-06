import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  successCard: {
    borderRadius: '0.5rem',
    border: '1px solid #28a745'
  },
  campaignImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '0.5rem'
  },
  statusBadge: {
    borderRadius: '15px',
    fontSize: '0.75rem',
    fontWeight: '600'
  }
};

const AdminCreateCampaignSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaignData, setCampaignData] = useState(null);

  useEffect(() => {
    // Get campaign data from navigation state
    const data = location.state?.campaignData;
    if (data) {
      setCampaignData(data);
    } else {
      // If no data, redirect back to create page
      navigate('/admin/create/campaigns');
    }
  }, [location.state, navigate]);

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
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'badge bg-success';
      case 'draft':
        return 'badge bg-secondary';
      case 'pending':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'fas fa-play-circle';
      case 'draft':
        return 'fas fa-edit';
      case 'pending':
        return 'fas fa-clock';
      default:
        return 'fas fa-bullhorn';
    }
  };

  if (!campaignData) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading campaign details...</p>
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
              <div className="text-center">
                <i className="fas fa-check-circle text-success fa-3x mb-3"></i>
                <h2 className="text-success mb-1">
                  Campaign Created Successfully!
                </h2>
                <p className="text-muted mb-0">
                  Your campaign has been created and is now available on the platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Details */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card" style={styles.successCard}>
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-success">
                  <i className="fas fa-bullhorn me-2"></i>
                  Campaign Details
                </h5>
                <span className={getStatusBadgeClass(campaignData.status)}>
                  <i className={`${getStatusIcon(campaignData.status)} me-1`}></i>
                  {campaignData.status || 'Created'}
                </span>
              </div>
            </div>
            <div className="card-body">
              {/* Campaign Image */}
              {campaignData.imageUrl && (
                <div className="row mb-4">
                  <div className="col-12">
                    <img
                      src={campaignData.imageUrl}
                      alt={campaignData.title}
                      style={styles.campaignImage}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x300?text=Campaign+Image';
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Campaign Title */}
              <div className="row mb-3">
                <div className="col-12">
                  <h3 className="text-primary mb-2">{campaignData.title}</h3>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">
                      <i className="fas fa-hashtag me-1"></i>
                      ID: {campaignData.campaignId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="card border-success">
                    <div className="card-body text-center">
                      <i className="fas fa-target text-success fa-2x mb-2"></i>
                      <h4 className="text-success">{formatCurrency(campaignData.goalAmount)}</h4>
                      <small className="text-muted">Goal Amount</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="fas fa-hand-holding-usd text-primary fa-2x mb-2"></i>
                      <h4 className="text-primary">{formatCurrency(campaignData.collectedAmount || 0)}</h4>
                      <small className="text-muted">Collected Amount</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted">Campaign Progress</span>
                    <span className="fw-bold">
                      {campaignData.goalAmount > 0 ? 
                        Math.round(((campaignData.collectedAmount || 0) / campaignData.goalAmount) * 100) : 0}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ 
                        width: `${campaignData.goalAmount > 0 ? 
                          Math.min(((campaignData.collectedAmount || 0) / campaignData.goalAmount) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Date Information */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-calendar-plus text-success me-3"></i>
                    <div>
                      <small className="text-muted d-block">Start Date</small>
                      <span className="fw-bold">{formatDate(campaignData.startDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-calendar-times text-danger me-3"></i>
                    <div>
                      <small className="text-muted d-block">End Date</small>
                      <span className="fw-bold">{formatDate(campaignData.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="row">
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/campaigns/${campaignData.campaignId}`)}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Campaign
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/admin/campaigns')}
                    >
                      <i className="fas fa-list me-2"></i>
                      All Campaigns
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => navigate('/admin/create/campaigns')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Create Another
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/admin-dashboard')}
                    >
                      <i className="fas fa-home me-2"></i>
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateCampaignSuccessPage;