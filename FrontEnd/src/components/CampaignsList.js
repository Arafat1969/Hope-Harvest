import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';

const styles = {
  cardHeader: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  campaignCard: {
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  progressBar: {
    backgroundColor: '#e8f5e9'
  },
  progressBarFill: {
    backgroundColor: '#4CAF50'
  },  donateButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32'
  },
  viewDetailsButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
    color: 'white'
  },
  categoryButton: {
    backgroundColor: '#81c784',
    borderColor: '#66bb6a',
    color: 'white',
    transition: 'all 0.3s'
  },
  activeCategory: {
    backgroundColor: '#2E7D32',
    borderColor: '#1B5E20'
  }
};

const CampaignsList = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchCategories();
  }, []);
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getAllCampaigns();
      console.log('🔍 Full API Response:', response); 
      if (response.status === 'success') {
        console.log('📊 Campaigns Data:', response.data); // Debug: Campaigns array
        setCampaigns(response.data || []);
      }
    } catch (error) {
      console.error('❌ Error fetching campaigns:', error);
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await campaignService.getCampaignCategories();
      if (response.status === 'success') {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCampaignsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      const response = await campaignService.getCampaignsByCategory(categoryId);
      if (response.status === 'success') {
        setCampaigns(response.data || []);
      }
      setSelectedCategory(categoryId);
    } catch (error) {
      console.error('Error fetching campaigns by category:', error);
      setError('Failed to load campaigns for this category');
    } finally {
      setLoading(false);
    }
  };  const handleDonate = async (campaignId, campaignData = null) => {
    // Navigate to donation page with selected campaign
    console.log('Navigating to donate page for campaign:', campaignId);
    
    // If we have campaign data, pass it along; otherwise just pass the ID
    const navigationState = campaignData 
      ? { campaignId, campaign: campaignData }
      : { campaignId };
      
    navigate('/donate', { state: navigationState });
  };
  const handleViewDetails = async (campaignId) => {
    try {
      setDetailsLoading(true);
      setShowDetailsModal(true);
      console.log('Fetching details for campaign:', campaignId);
      
      const response = await campaignService.getCampaignDetails(campaignId);
      console.log('Campaign details response:', response);
      
      if (response.status === 'success') {
        setSelectedCampaign(response.data);
      } else {
        console.error('Failed to fetch campaign details:', response.message);
        setError('Failed to load campaign details');
      }
    } catch (err) {
      console.error('Error fetching campaign details:', err);
      setError('Failed to load campaign details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const calculateProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.min((raised / target) * 100, 100);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading campaigns...</p>
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
            onClick={fetchCampaigns}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 text-success fw-bold">Active Campaigns</h1>
        <p className="lead text-muted">
          Support our ongoing campaigns and make a difference in communities
        </p>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            <button
              className={`btn ${!selectedCategory ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => {
                setSelectedCategory(null);
                fetchCampaigns();
              }}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.categoryId}
                className={`btn ${
                  selectedCategory === category.categoryId
                    ? 'btn-success'
                    : 'btn-outline-success'
                }`}
                onClick={() => fetchCampaignsByCategory(category.categoryId)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Campaigns Grid */}
      <div className="row">
        {campaigns.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="text-muted">
              <i className="fas fa-heart fa-3x mb-3"></i>
              <h4>No campaigns available</h4>
              <p>Check back soon for new campaigns!</p>
            </div>
          </div>
        ) : (          campaigns.map((campaign) => (
            <div key={campaign.campaignId} className="col-lg-4 col-md-6 mb-4">
              {/* Debug: Print campaign details */}
              {console.log(`🖼️ Campaign "${campaign.title}" - Image:`, campaign.image)}
              {console.log('� All campaign properties:', Object.keys(campaign))}
              {console.log('📷 Image related properties:', {
                imageUrl: campaign.imageUrl,
                image: campaign.image,
                thumbnail: campaign.thumbnail,
                photo: campaign.photo,
                picture: campaign.picture
              })}
              {console.log('�📋 Full Campaign Object:', campaign)}
              <div 
                className="card h-100 shadow-sm"
                style={styles.campaignCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}              >{campaign.image ? (
                  <div className="position-relative">
                    <img
                      src={campaign.image}
                      className="card-img-top"
                      alt={campaign.title}
                      style={{ 
                        height: '220px', 
                        objectFit: 'cover',
                        borderRadius: '0.375rem 0.375rem 0 0'
                      }}
                    />
                    <div 
                      className="position-absolute top-0 end-0 m-2"
                      style={{
                        backgroundColor: 'rgba(76, 175, 80, 0.9)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      <i className="fas fa-eye me-1"></i>
                      {Math.floor(Math.random() * 500) + 100} views
                    </div>
                  </div>
                ) : (
                  <div 
                    className="card-img-top d-flex align-items-center justify-content-center"
                    style={{ 
                      height: '220px', 
                      backgroundColor: '#e8f5e9',
                      borderRadius: '0.375rem 0.375rem 0 0'
                    }}
                  >
                    <div className="text-center text-muted">
                      <i className="fas fa-image fa-3x mb-2"></i>
                      <p className="mb-0">No Image Available</p>
                    </div>
                  </div>
                )}
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title text-success">{campaign.title}</h5>
                  <p className="card-text flex-grow-1">{campaign.description}</p>
                  
                  {/* Progress */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">Progress</small>
                      <small className="text-muted">
                        {calculateProgress(campaign.collectedAmount, campaign.goalAmount).toFixed(1)}%
                      </small>
                    </div>
                    <div className="progress" style={styles.progressBar}>
                      <div
                        className="progress-bar"
                        style={{
                          ...styles.progressBarFill,
                          width: `${calculateProgress(campaign.collectedAmount, campaign.goalAmount)}%`
                        }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                      <span className="fw-bold text-success">
                        {formatCurrency(campaign.collectedAmount)}
                      </span>
                      <span className="text-muted">
                        Goal: {formatCurrency(campaign.goalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Info */}
                  <div className="mb-3">
                    {campaign.endDate && (
                      <small className="text-muted d-block">
                        <i className="fas fa-calendar-alt me-1"></i>
                        Ends: {new Date(campaign.endDate).toLocaleDateString()}
                      </small>
                    )}
                    {campaign.location && (
                      <small className="text-muted d-block">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {campaign.location}
                      </small>
                    )}
                  </div>                  {/* Action Buttons */}
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-success flex-fill"
                      style={styles.viewDetailsButton}
                      onClick={() => handleViewDetails(campaign.campaignId)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#388E3C';
                        e.currentTarget.style.borderColor = '#388E3C';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#4CAF50';
                        e.currentTarget.style.borderColor = '#4CAF50';
                      }}
                    >
                      <i className="fas fa-info-circle me-2"></i>
                      View Details
                    </button>                    <button
                      className="btn btn-success flex-fill"
                      style={styles.donateButton}
                      onClick={() => handleDonate(campaign.campaignId, campaign)}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#1B5E20';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = '#2E7D32';
                      }}
                    >
                      <i className="fas fa-heart me-2"></i>
                      Donate Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-5">
        <div className="card bg-light">
          <div className="card-body py-4">
            <h4 className="text-success">Want to start your own campaign?</h4>
            <p className="text-muted mb-3">
              Have a project idea that can help your community? Submit a campaign request!
            </p>
            <button className="btn btn-outline-success">
              Request New Campaign
            </button>
          </div>        </div>
      </div>

      {/* Campaign Details Modal */}
      {showDetailsModal && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setShowDetailsModal(false)}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header" style={styles.cardHeader}>
                <h5 className="modal-title text-white">
                  <i className="fas fa-info-circle me-2"></i>
                  Campaign Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              
              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading campaign details...</p>
                  </div>
                ) : selectedCampaign ? (
                  <div>
                    {/* Campaign Image */}
                    {selectedCampaign.image && (
                      <div className="mb-4">
                        <img 
                          src={selectedCampaign.image} 
                          alt={selectedCampaign.title}
                          className="img-fluid rounded"
                          style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    
                    {/* Campaign Info */}
                    <div className="row">
                      <div className="col-md-8">
                        <h4 className="text-success mb-3">{selectedCampaign.title}</h4>
                        
                        {/* Category */}
                        {selectedCampaign.category && (
                          <div className="mb-3">
                            <span className="badge bg-success me-2">
                              <i className="fas fa-tag me-1"></i>
                              {selectedCampaign.category.name || selectedCampaign.category.categoryName}
                            </span>
                          </div>
                        )}
                        
                        {/* Description */}
                        <div className="mb-4">
                          <h6 className="text-success">Description</h6>
                          <p className="text-muted">{selectedCampaign.description}</p>
                        </div>
                        
                        {/* Details */}
                        {selectedCampaign.details && (
                          <div className="mb-4">
                            <h6 className="text-success">Details</h6>
                            <p className="text-muted">{selectedCampaign.details}</p>
                          </div>
                        )}
                        
                        {/* Expected Impact */}
                        {selectedCampaign.expectedImpact && (
                          <div className="mb-4">
                            <h6 className="text-success">Expected Impact</h6>
                            <p className="text-muted">{selectedCampaign.expectedImpact}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Progress Sidebar */}
                      <div className="col-md-4">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="text-success mb-3">
                              <i className="fas fa-chart-line me-2"></i>
                              Progress
                            </h6>
                            
                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <small className="text-muted">Raised</small>
                                <small className="text-muted">
                                  {calculateProgress(selectedCampaign.collectedAmount, selectedCampaign.goalAmount).toFixed(1)}%
                                </small>
                              </div>
                              <div className="progress mb-3" style={styles.progressBar}>
                                <div
                                  className="progress-bar"
                                  style={{
                                    ...styles.progressBarFill,
                                    width: `${calculateProgress(selectedCampaign.collectedAmount, selectedCampaign.goalAmount)}%`
                                  }}
                                ></div>
                              </div>
                              
                              {/* Amounts */}
                              <div className="text-center">
                                <div className="mb-2">
                                  <span className="fw-bold text-success fs-5">
                                    {formatCurrency(selectedCampaign.collectedAmount)}
                                  </span>
                                  <br />
                                  <small className="text-muted">Raised</small>
                                </div>
                                <div>
                                  <span className="text-muted">
                                    Goal: {formatCurrency(selectedCampaign.goalAmount)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="fas fa-exclamation-triangle text-warning fa-3x mb-3"></i>
                    <h6>Failed to load campaign details</h6>
                    <p className="text-muted">Please try again later.</p>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowDetailsModal(false)}
                >
                  Close
                </button>
                {selectedCampaign && (
                  <button 
                    type="button" 
                    className="btn btn-success"                    onClick={() => {
                      setShowDetailsModal(false);
                      handleDonate(selectedCampaign.campaignId, selectedCampaign);
                    }}
                    style={styles.donateButton}
                  >
                    <i className="fas fa-heart me-2"></i>
                    Donate Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsList;
