import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';
import { authService } from '../services/authService';

const UserDonationsList = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('donationDate');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user profile to extract userId
      const userResponse = await authService.getProfile();
      if (userResponse.status === 'success') {
        const userId = userResponse.data.userId || userResponse.data.id || userResponse.data.user_id;
        
        if (userId) {
          const response = await donationService.getUserDonations(userId);
          if (response.status === 'success') {
            setDonations(response.data || []);
          }
        } else {
          throw new Error('User ID not found');
        }
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('Failed to load donations. Please try again.');
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
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleDonationClick = (donationId) => {
    navigate(`/my-donations/${donationId}`);
  };

  const filteredAndSortedDonations = donations
    .filter(donation => 
      donation.campaignTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'donationDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Your Donations...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger text-center">
          <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
          <h4>Error Loading Donations</h4>
          <p>{error}</p>
          <button className="btn btn-danger" onClick={fetchDonations}>
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
              <div className="card-body" style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)', color: 'white', borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h1 className="h3 mb-2">
                      <i className="fas fa-heart me-2"></i>
                      My Donations
                    </h1>
                    <p className="mb-0 opacity-75">Total Donations: {donations.length}</p>
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
                      onClick={() => navigate('/donate')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      New Donation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by campaign, transaction ID, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="donationDate">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="campaignTitle">Sort by Campaign</option>
            </select>
          </div>
          <div className="col-md-3">
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

        {/* Donations List */}
        {filteredAndSortedDonations.length === 0 ? (
          <div className="text-center py-5">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body py-5">
                <i className="fas fa-heart fa-4x text-muted mb-4"></i>
                <h4 className="text-muted">No Donations Found</h4>
                <p className="text-muted mb-4">
                  {searchTerm ? 'No donations match your search criteria.' : 'You haven\'t made any donations yet.'}
                </p>
                <button 
                  className="btn btn-success"
                  onClick={() => navigate('/donate')}
                >
                  <i className="fas fa-heart me-2"></i>
                  Make Your First Donation
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {filteredAndSortedDonations.map((donation) => (
              <div key={donation.donationId} className="col-12 mb-3">
                <div 
                  className="card shadow-sm border-0" 
                  style={{ 
                    borderRadius: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleDonationClick(donation.donationId)}
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
                        <h5 className="text-success mb-2">
                          <i className="fas fa-bullhorn me-2"></i>
                          {donation.campaignTitle || 'Campaign'}
                        </h5>
                        <p className="text-muted mb-1">
                          <i className="fas fa-building me-2"></i>
                          {donation.organizationName || 'Hope Harvest'}
                        </p>
                        <p className="text-muted mb-0">
                          <i className="fas fa-receipt me-2"></i>
                          Transaction: {donation.transactionId || 'N/A'}
                        </p>
                      </div>
                      <div className="col-md-3 text-center">
                        <h3 className="text-primary mb-1">{formatCurrency(donation.amount)}</h3>
                        <small className="text-muted">
                          <i className="fas fa-credit-card me-1"></i>
                          {donation.paymentMethod || 'N/A'}
                        </small>
                      </div>
                      <div className="col-md-3 text-end">
                        <p className="text-muted mb-2">{formatDate(donation.donationDate)}</p>
                        <div className="d-flex align-items-center justify-content-end">
                          <span className="badge bg-success me-2">Completed</span>
                          <i className="fas fa-arrow-right text-muted"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {filteredAndSortedDonations.length > 0 && (
          <div className="row mt-5">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4 text-center">
                  <h5 className="text-success mb-3">Donation Summary</h5>
                  <div className="row">
                    <div className="col-md-4">
                      <h3 className="text-primary">{filteredAndSortedDonations.length}</h3>
                      <p className="text-muted mb-0">Total Donations</p>
                    </div>
                    <div className="col-md-4">
                      <h3 className="text-success">
                        {formatCurrency(filteredAndSortedDonations.reduce((sum, d) => sum + (d.amount || 0), 0))}
                      </h3>
                      <p className="text-muted mb-0">Total Amount</p>
                    </div>
                    <div className="col-md-4">
                      <h3 className="text-info">
                        {formatCurrency(filteredAndSortedDonations.reduce((sum, d) => sum + (d.amount || 0), 0) / filteredAndSortedDonations.length)}
                      </h3>
                      <p className="text-muted mb-0">Average Donation</p>
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

export default UserDonationsList;