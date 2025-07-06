import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  donationCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  donationCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  statusBadge: {
    borderRadius: '15px',
    fontSize: '0.75rem',
    fontWeight: '600'
  }
};

const AdminDonationsPage = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationService.getAllDonations();
      const donationsData = response.data || response || [];
      console.log('Donations fetched:', donationsData);
      setDonations(donationsData);
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

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'successful':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning text-dark';
      case 'failed':
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const handleViewDetails = (donationId) => {
    navigate(`/admin/donations/${donationId}`);
  };

  const filteredAndSortedDonations = donations
    .filter(donation => {
      const matchesSearch = 
        donation.campaignTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.organizationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.trackingKey?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        donation.paymentMethod?.toLowerCase().includes(filterStatus.toLowerCase());
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return parseFloat(b.amount) - parseFloat(a.amount);
        case 'campaign':
          return (a.campaignTitle || '').localeCompare(b.campaignTitle || '');
        case 'date':
        default:
          return new Date(b.donationDate) - new Date(a.donationDate);
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading donations...</p>
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
            onClick={fetchDonations}
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
                    <i className="fas fa-hand-holding-heart me-2"></i>
                    Admin - All Donations
                  </h2>
                  <p className="text-muted mb-0">
                    Manage and view all donations across the platform
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
              <h5 className="text-primary">{donations.length}</h5>
              <small className="text-muted">Total Donations</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">
                {formatCurrency(donations.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0))}
              </h5>
              <small className="text-muted">Total Amount</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">
                {new Set(donations.map(d => d.campaignTitle)).size}
              </h5>
              <small className="text-muted">Campaigns</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {donations.filter(d => d.donationDate && 
                  new Date(d.donationDate).toDateString() === new Date().toDateString()).length}
              </h5>
              <small className="text-muted">Today's Donations</small>
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
                      placeholder="Search by campaign, organization, transaction ID..."
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
                    <option value="all">All Payment Methods</option>
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="upay">UPay</option>
                    <option value="qcash">QCash</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">MasterCard</option>
                    <option value="americanexpress">American Express</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="campaign">Sort by Campaign</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchDonations}
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

      {/* Donations List */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-list me-2"></i>
                Donations List ({filteredAndSortedDonations.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredAndSortedDonations.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-heart fa-3x mb-3"></i>
                  <h5>No donations found</h5>
                  <p>No donations match your current search and filter criteria.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Campaign</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Payment Method</th>
                        <th>Organization</th>
                        <th>Tracking Key</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedDonations.map((donation) => (
                        <tr 
                          key={donation.donationId}
                          style={styles.donationCard}
                          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.donationCardHover)}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <td>
                            <div>
                              <strong className="text-primary">{donation.campaignTitle}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold text-success">
                              {formatCurrency(donation.amount)}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatDate(donation.donationDate)}
                            </small>
                          </td>
                          <td>
                            <span className={`badge bg-info`}>
                              {donation.paymentMethod || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {donation.organizationName || 'Anonymous'}
                            </small>
                          </td>
                          <td>
                            <code className="small">
                              {donation.trackingKey || 'N/A'}
                            </code>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleViewDetails(donation.donationId)}
                              title="View Details"
                            >
                              <i className="fas fa-eye me-1"></i>
                              View Details
                            </button>
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
      </div>
    </div>
  );
};

export default AdminDonationsPage;