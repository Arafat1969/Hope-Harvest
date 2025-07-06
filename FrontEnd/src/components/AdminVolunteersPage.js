import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  volunteerCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  volunteerCardHover: {
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

const AdminVolunteersPage = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [enrichedVolunteers, setEnrichedVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      
      // First, get all volunteers
      const volunteersResponse = await volunteerService.getAllVolunteersAdmin();
      const volunteersData = volunteersResponse.data || volunteersResponse || [];
      console.log('Volunteers fetched:', volunteersData);
      setVolunteers(volunteersData);

      // Then, enrich each volunteer with user details
      const enrichedData = await Promise.allSettled(
        volunteersData.map(async (volunteer) => {
          try {
            const userResponse = await authService.getUserById(volunteer.externalUserId);
            const userData = userResponse.data || userResponse || {};
            
            return {
              ...volunteer,
              userDetails: userData,
              fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'N/A',
              location: userData.addressCity ? 
                `${userData.addressCity}, ${userData.addressCountry || ''}`.trim() : 'N/A'
            };
          } catch (error) {
            console.error(`Error fetching user details for volunteer ${volunteer.volunteerId}:`, error);
            return {
              ...volunteer,
              userDetails: null,
              fullName: 'N/A',
              location: 'N/A'
            };
          }
        })
      );

      const enrichedVolunteers = enrichedData
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      console.log('Enriched volunteers:', enrichedVolunteers);
      setEnrichedVolunteers(enrichedVolunteers);

    } catch (error) {
      console.error('Error fetching volunteers:', error);
      setError('Failed to load volunteers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (fullName) => {
    if (!fullName || fullName === 'N/A') return '?';
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getEmailVerificationBadge = (emailVerified) => {
    return emailVerified ? (
      <span className="badge bg-success ms-2">
        <i className="fas fa-check-circle me-1"></i>
        Verified
      </span>
    ) : (
      <span className="badge bg-warning text-dark ms-2">
        <i className="fas fa-exclamation-circle me-1"></i>
        Unverified
      </span>
    );
  };

  const getRoleBadgeClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'badge bg-danger';
      case 'volunteer':
        return 'badge bg-success';
      case 'user':
        return 'badge bg-primary';
      default:
        return 'badge bg-secondary';
    }
  };

  const handleViewDetails = (volunteerId) => {
    navigate(`/admin/volunteers/${volunteerId}`);
  };

  const filteredAndSortedVolunteers = enrichedVolunteers
    .filter(volunteer => {
      const matchesSearch = 
        volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.phoneNumber?.includes(searchTerm) ||
        volunteer.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || 
        volunteer.userDetails?.role?.toLowerCase() === filterRole.toLowerCase();
      
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'role':
          return (a.userDetails?.role || '').localeCompare(b.userDetails?.role || '');
        case 'verification':
          return (b.userDetails?.emailVerified ? 1 : 0) - (a.userDetails?.emailVerified ? 1 : 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading volunteers and user details...</p>
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
            onClick={fetchVolunteers}
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
                    <i className="fas fa-hands-helping me-2"></i>
                    Admin - All Volunteers
                  </h2>
                  <p className="text-muted mb-0">
                    Manage and view all volunteers across the platform
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
              <h5 className="text-primary">{enrichedVolunteers.length}</h5>
              <small className="text-muted">Total Volunteers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">
                {enrichedVolunteers.filter(v => v.userDetails?.emailVerified).length}
              </h5>
              <small className="text-muted">Verified Emails</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">
                {enrichedVolunteers.filter(v => v.userDetails?.role?.toLowerCase() === 'volunteer').length}
              </h5>
              <small className="text-muted">Active Volunteers</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {new Set(enrichedVolunteers.map(v => v.userDetails?.addressCity).filter(Boolean)).size}
              </h5>
              <small className="text-muted">Cities Covered</small>
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
                      placeholder="Search by name, email, phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="role">Sort by Role</option>
                    <option value="verification">Sort by Verification</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchVolunteers}
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

      {/* Volunteers List */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-list me-2"></i>
                Volunteers List ({filteredAndSortedVolunteers.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredAndSortedVolunteers.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-hands-helping fa-3x mb-3"></i>
                  <h5>No volunteers found</h5>
                  <p>No volunteers match your current search and filter criteria.</p>
                </div>
              ) : (
                <div className="row">
                  {filteredAndSortedVolunteers.map((volunteer) => (
                    <div key={volunteer.volunteerId} className="col-lg-6 col-md-12 mb-4">
                      <div 
                        className="card h-100" 
                        style={styles.volunteerCard}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.volunteerCardHover)}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start mb-3">
                            <div style={styles.avatarPlaceholder} className="me-3">
                              {getInitials(volunteer.fullName)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1 text-primary">{volunteer.fullName}</h6>
                                  <div className="d-flex align-items-center">
                                    <small className="text-muted">{volunteer.email}</small>
                                    {volunteer.userDetails && getEmailVerificationBadge(volunteer.userDetails.emailVerified)}
                                  </div>
                                </div>
                                <span className={getRoleBadgeClass(volunteer.userDetails?.role)}>
                                  {volunteer.userDetails?.role || 'Unknown'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Phone Number</small>
                              <small className="fw-bold">
                                {volunteer.phoneNumber || volunteer.userDetails?.phoneNumber || 'N/A'}
                              </small>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">Location</small>
                              <small className="fw-bold">{volunteer.location}</small>
                            </div>
                          </div>

                          {volunteer.userDetails?.addressPostalCode && (
                            <div className="row mb-3">
                              <div className="col-12">
                                <small className="text-muted d-block">Postal Code</small>
                                <small className="fw-bold">{volunteer.userDetails.addressPostalCode}</small>
                              </div>
                            </div>
                          )}

                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Volunteer ID</small>
                              <code className="small">{volunteer.volunteerId}</code>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">User ID</small>
                              <code className="small">{volunteer.externalUserId}</code>
                            </div>
                          </div>

                          <div className="mt-auto">
                            <button
                              className="btn btn-outline-primary w-100"
                              onClick={() => handleViewDetails(volunteer.volunteerId)}
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
    </div>
  );
};

export default AdminVolunteersPage;