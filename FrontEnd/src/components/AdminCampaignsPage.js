import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  itemCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  itemCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  statusBadge: {
    borderRadius: '15px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  campaignImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '0.375rem'
  }
};

const AdminCampaignsPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, campaignsRes] = await Promise.allSettled([
        campaignService.getAllCampaignCategoriesAdmin(),
        campaignService.getAllCampaignsAdmin()
      ]);

      if (categoriesRes.status === 'fulfilled') {
        const categoriesData = categoriesRes.value.data || categoriesRes.value || [];
        setCategories(categoriesData);
      }

      if (campaignsRes.status === 'fulfilled') {
        const campaignsData = campaignsRes.value.data || campaignsRes.value || [];
        setCampaigns(campaignsData);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load campaigns and categories. Please try again.');
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
      case 'active':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'completed':
        return 'badge bg-primary';
      case 'cancelled':
      case 'inactive':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const calculateProgress = (collected, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((collected / goal) * 100, 100);
  };

  const handleViewCategoryDetails = (categoryId) => {
    navigate(`/admin/campaigns/categories/${categoryId}`);
  };

  const handleViewCampaignDetails = (campaignId) => {
    navigate(`/admin/campaigns/${campaignId}`);
  };

  const filteredCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = 
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || 
        campaign.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    });

  const filteredCategories = categories
    .filter(category => 
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading campaigns and categories...</p>
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
            onClick={fetchData}
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
                    <i className="fas fa-bullhorn me-2"></i>
                    Admin - Campaigns & Categories
                  </h2>
                  <p className="text-muted mb-0">
                    Manage campaigns and categories across the platform
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={() => navigate('/admin/campaigns/create')}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create Campaign
                  </button>
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
      </div>

      {/* Statistics Summary */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card text-center border-primary">
            <div className="card-body">
              <h5 className="text-primary">{campaigns.length}</h5>
              <small className="text-muted">Total Campaigns</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">{categories.length}</h5>
              <small className="text-muted">Categories</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">
                {campaigns.filter(c => c.status?.toLowerCase() === 'active').length}
              </h5>
              <small className="text-muted">Active Campaigns</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {formatCurrency(campaigns.reduce((sum, c) => sum + parseFloat(c.collectedAmount || 0), 0))}
              </h5>
              <small className="text-muted">Total Collected</small>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-body">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`}
                    onClick={() => setActiveTab('campaigns')}
                  >
                    <i className="fas fa-bullhorn me-2"></i>
                    Campaigns ({campaigns.length})
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button 
                    className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                  >
                    <i className="fas fa-tags me-2"></i>
                    Categories ({categories.length})
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6 mb-3 mb-md-0">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={activeTab === 'campaigns' ? "Search campaigns..." : "Search categories..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                {activeTab === 'campaigns' && (
                  <div className="col-md-4 mb-3 mb-md-0">
                    <select
                      className="form-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                )}
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchData}
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

      {/* Content based on active tab */}
      {activeTab === 'campaigns' ? (
        // Campaigns Tab
        <div className="row">
          <div className="col-12">
            <div className="card" style={styles.pageCard}>
              <div className="card-header bg-white">
                <h5 className="mb-0 text-danger">
                  <i className="fas fa-bullhorn me-2"></i>
                  Campaigns List ({filteredCampaigns.length})
                </h5>
              </div>
              <div className="card-body">
                {filteredCampaigns.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-bullhorn fa-3x mb-3"></i>
                    <h5>No campaigns found</h5>
                    <p>No campaigns match your current search and filter criteria.</p>
                  </div>
                ) : (
                  <div className="row">
                    {filteredCampaigns.map((campaign) => (
                      <div key={campaign.campaignId} className="col-lg-4 col-md-6 mb-4">
                        <div 
                          className="card h-100" 
                          style={styles.itemCard}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.itemCardHover)}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          {campaign.imageUrl && (
                            <img 
                              src={campaign.imageUrl} 
                              alt={campaign.title}
                              style={styles.campaignImage}
                              className="card-img-top"
                            />
                          )}
                          <div className="card-body d-flex flex-column">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title text-primary mb-0">{campaign.title}</h6>
                              <span className={getStatusBadgeClass(campaign.status)}>
                                {campaign.status}
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <div className="d-flex justify-content-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{calculateProgress(campaign.collectedAmount, campaign.goalAmount).toFixed(1)}%</span>
                              </div>
                              <div className="progress mb-2" style={{height: '6px'}}>
                                <div 
                                  className="progress-bar bg-success" 
                                  style={{width: `${calculateProgress(campaign.collectedAmount, campaign.goalAmount)}%`}}
                                ></div>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small className="text-success fw-bold">{formatCurrency(campaign.collectedAmount)}</small>
                                <small className="text-muted">of {formatCurrency(campaign.goalAmount)}</small>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="row text-center">
                                <div className="col-6">
                                  <small className="text-muted d-block">Start Date</small>
                                  <small className="fw-bold">{formatDate(campaign.startDate)}</small>
                                </div>
                                <div className="col-6">
                                  <small className="text-muted d-block">End Date</small>
                                  <small className="fw-bold">{formatDate(campaign.endDate)}</small>
                                </div>
                              </div>
                            </div>

                            <div className="mt-auto">
                              <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => handleViewCampaignDetails(campaign.campaignId)}
                              >
                                <i className="fas fa-eye me-2"></i>
                                View Details
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
      ) : (
        // Categories Tab
        <div className="row">
          <div className="col-12">
            <div className="card" style={styles.pageCard}>
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-danger">
                  <i className="fas fa-tags me-2"></i>
                  Categories List ({filteredCategories.length})
                </h5>
                <button 
                  className="btn btn-success btn-sm"
                  onClick={() => navigate('/admin/campaigns/categories/create')}
                >
                  <i className="fas fa-plus me-2"></i>
                  Create Category
                </button>
              </div>
              <div className="card-body">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="fas fa-tags fa-3x mb-3"></i>
                    <h5>No categories found</h5>
                    <p>No categories match your current search criteria.</p>
                  </div>
                ) : (
                  <div className="row">
                    {filteredCategories.map((category) => (
                      <div key={category.categoryId} className="col-lg-4 col-md-6 mb-4">
                        <div 
                          className="card h-100" 
                          style={styles.itemCard}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.itemCardHover)}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                          }}
                        >
                          <div className="card-body d-flex flex-column">
                            <div className="text-center mb-3">
                              <i className="fas fa-tag fa-3x text-primary mb-2"></i>
                              <h5 className="card-title text-primary">{category.name}</h5>
                            </div>
                            
                            <p className="card-text text-muted flex-grow-1">
                              {category.description || 'No description available'}
                            </p>

                            <div className="mt-auto">
                              <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => handleViewCategoryDetails(category.categoryId)}
                              >
                                <i className="fas fa-eye me-2"></i>
                                View Details
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
      )}
    </div>
  );
};

export default AdminCampaignsPage;