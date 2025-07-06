import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fundApplicationService } from '../services/fundApplicationService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  applicationCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  applicationCardHover: {
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

const AdminFundApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [sortBy, setSortBy] = useState('amount');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fundApplicationService.getAllFundApplicationsAdmin();
      const applicationsData = response.data || response || [];
      console.log('Fund applications fetched:', applicationsData);
      setApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching fund applications:', error);
      setError('Failed to load fund applications. Please try again.');
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

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const parseAddress = (addressJson) => {
    try {
      if (!addressJson) return 'N/A';
      
      // If it's already an object
      if (typeof addressJson === 'object') {
        const addr = addressJson;
        const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : 'N/A';
      }
      
      // If it's a JSON string
      const parsed = JSON.parse(addressJson);
      const parts = [parsed.street, parsed.city, parsed.state, parsed.country].filter(Boolean);
      return parts.length > 0 ? parts.join(', ') : 'N/A';
    } catch (error) {
      // If parsing fails, return as string or fallback
      return typeof addressJson === 'string' ? addressJson : 'N/A';
    }
  };

  const getDocumentCount = (documents) => {
    if (!documents) return 0;
    if (Array.isArray(documents)) return documents.length;
    return 0;
  };

  const getPurposeIcon = (purpose) => {
    const purposeLower = purpose?.toLowerCase() || '';
    if (purposeLower.includes('medical') || purposeLower.includes('health')) {
      return 'fas fa-heartbeat';
    } else if (purposeLower.includes('education') || purposeLower.includes('school')) {
      return 'fas fa-graduation-cap';
    } else if (purposeLower.includes('business') || purposeLower.includes('startup')) {
      return 'fas fa-briefcase';
    } else if (purposeLower.includes('emergency') || purposeLower.includes('urgent')) {
      return 'fas fa-exclamation-triangle';
    } else if (purposeLower.includes('housing') || purposeLower.includes('home')) {
      return 'fas fa-home';
    } else {
      return 'fas fa-hand-holding-usd';
    }
  };

  const getPurposeColor = (purpose) => {
    const purposeLower = purpose?.toLowerCase() || '';
    if (purposeLower.includes('medical') || purposeLower.includes('health')) {
      return 'text-danger';
    } else if (purposeLower.includes('education') || purposeLower.includes('school')) {
      return 'text-primary';
    } else if (purposeLower.includes('business') || purposeLower.includes('startup')) {
      return 'text-success';
    } else if (purposeLower.includes('emergency') || purposeLower.includes('urgent')) {
      return 'text-warning';
    } else if (purposeLower.includes('housing') || purposeLower.includes('home')) {
      return 'text-info';
    } else {
      return 'text-secondary';
    }
  };

  const handleViewDetails = (applicationId) => {
    navigate(`/admin/fund-applications/${applicationId}`);
  };

  const filteredAndSortedApplications = applications
    .filter(application => {
      const matchesSearch = 
        application.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.phoneNumber?.includes(searchTerm) ||
        application.nationalId?.includes(searchTerm) ||
        application.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPurpose = filterPurpose === 'all' || 
        application.purpose?.toLowerCase().includes(filterPurpose.toLowerCase());
      
      return matchesSearch && matchesPurpose;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'amount':
          return parseFloat(b.amount || 0) - parseFloat(a.amount || 0);
        case 'purpose':
          return (a.purpose || '').localeCompare(b.purpose || '');
        default:
          return 0;
      }
    });

  // Get unique purposes for filter
  const uniquePurposes = [...new Set(applications.map(app => {
    const purpose = app.purpose?.toLowerCase() || '';
    if (purpose.includes('medical') || purpose.includes('health')) return 'medical';
    if (purpose.includes('education') || purpose.includes('school')) return 'education';
    if (purpose.includes('business') || purpose.includes('startup')) return 'business';
    if (purpose.includes('emergency') || purpose.includes('urgent')) return 'emergency';
    if (purpose.includes('housing') || purpose.includes('home')) return 'housing';
    return 'other';
  }).filter(Boolean))];

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading fund applications...</p>
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
            onClick={fetchApplications}
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
                    <i className="fas fa-money-check-alt me-2"></i>
                    Admin - Fund Applications
                  </h2>
                  <p className="text-muted mb-0">
                    Review and manage all fund applications across the platform
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
              <h5 className="text-primary">{applications.length}</h5>
              <small className="text-muted">Total Applications</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">
                {formatCurrency(applications.reduce((sum, app) => sum + parseFloat(app.amount || 0), 0))}
              </h5>
              <small className="text-muted">Total Amount Requested</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">
                {formatCurrency(applications.length > 0 ? 
                  applications.reduce((sum, app) => sum + parseFloat(app.amount || 0), 0) / applications.length : 0)}
              </h5>
              <small className="text-muted">Average Amount</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {applications.reduce((sum, app) => sum + getDocumentCount(app.documents), 0)}
              </h5>
              <small className="text-muted">Total Documents</small>
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
                      placeholder="Search by name, phone, ID, purpose..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={filterPurpose}
                    onChange={(e) => setFilterPurpose(e.target.value)}
                  >
                    <option value="all">All Purposes</option>
                    {uniquePurposes.map(purpose => (
                      <option key={purpose} value={purpose}>
                        {purpose.charAt(0).toUpperCase() + purpose.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="amount">Sort by Amount (High to Low)</option>
                    <option value="name">Sort by Name</option>
                    <option value="purpose">Sort by Purpose</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchApplications}
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

      {/* Applications List */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-list me-2"></i>
                Fund Applications ({filteredAndSortedApplications.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredAndSortedApplications.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-money-check-alt fa-3x mb-3"></i>
                  <h5>No fund applications found</h5>
                  <p>No applications match your current search and filter criteria.</p>
                </div>
              ) : (
                <div className="row">
                  {filteredAndSortedApplications.map((application) => (
                    <div key={application.applicationId} className="col-lg-6 col-md-12 mb-4">
                      <div 
                        className="card h-100" 
                        style={styles.applicationCard}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.applicationCardHover)}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div className="card-body d-flex flex-column">
                          {/* Header with name and amount */}
                          <div className="d-flex align-items-start mb-3">
                            <div style={styles.avatarPlaceholder} className="me-3">
                              {getInitials(application.fullName)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1 text-primary">{application.fullName || 'N/A'}</h6>
                                  <small className="text-muted">{application.phoneNumber || 'No phone'}</small>
                                </div>
                                <div className="text-end">
                                  <h5 className="text-success mb-0">{formatCurrency(application.amount)}</h5>
                                  <small className="text-muted">Requested</small>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Purpose */}
                          <div className="mb-3">
                            <div className="d-flex align-items-center">
                              <i className={`${getPurposeIcon(application.purpose)} ${getPurposeColor(application.purpose)} me-2`}></i>
                              <small className="text-muted me-2">Purpose:</small>
                              <span className="fw-bold">{application.purpose || 'Not specified'}</span>
                            </div>
                          </div>

                          {/* National ID */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <small className="text-muted d-block">National ID</small>
                              <code className="small">{application.nationalId || 'N/A'}</code>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <small className="text-muted d-block">Address</small>
                              <small className="fw-bold">{parseAddress(application.addressJson)}</small>
                            </div>
                          </div>

                          {/* Documents */}
                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Documents</small>
                              <span className="badge bg-info">
                                <i className="fas fa-file me-1"></i>
                                {getDocumentCount(application.documents)} files
                              </span>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Application ID</small>
                              <code className="small">{application.applicationId}</code>
                            </div>
                          </div>

                          {/* External User ID */}
                          <div className="row mb-3">
                            <div className="col-12">
                              <small className="text-muted d-block">User ID</small>
                              <code className="small">{application.externalUserId}</code>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto">
                            <button
                              className="btn btn-outline-primary w-100"
                              onClick={() => handleViewDetails(application.applicationId)}
                            >
                              <i className="fas fa-eye me-2"></i>
                              View Details & Review
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

export default AdminFundApplicationsPage;