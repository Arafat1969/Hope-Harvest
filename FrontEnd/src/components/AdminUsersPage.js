import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  userCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  userCardHover: {
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

const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await authService.getAllUsers();
      const usersData = response.data || response || [];
      console.log('Users fetched:', usersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || '?';
  };

  const getFullName = (firstName, lastName) => {
    return `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
  };

  const getFullAddress = (city, postalCode, country) => {
    const parts = [city, postalCode, country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'N/A';
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
      case 'moderator':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'fas fa-shield-alt';
      case 'volunteer':
        return 'fas fa-hands-helping';
      case 'user':
        return 'fas fa-user';
      case 'moderator':
        return 'fas fa-user-tie';
      default:
        return 'fas fa-user-circle';
    }
  };

  const handleViewDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const filteredAndSortedUsers = users
    .filter(user => {
      const matchesSearch = 
        getFullName(user.firstName, user.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phoneNumber?.includes(searchTerm) ||
        user.addressCity?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || 
        user.role?.toLowerCase() === filterRole.toLowerCase();
      
      const matchesVerification = filterVerification === 'all' ||
        (filterVerification === 'verified' && user.emailVerified) ||
        (filterVerification === 'unverified' && !user.emailVerified);
      
      return matchesSearch && matchesRole && matchesVerification;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return getFullName(a.firstName, a.lastName).localeCompare(getFullName(b.firstName, b.lastName));
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'role':
          return (a.role || '').localeCompare(b.role || '');
        case 'verification':
          return (b.emailVerified ? 1 : 0) - (a.emailVerified ? 1 : 0);
        case 'location':
          return (a.addressCity || '').localeCompare(b.addressCity || '');
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
          <p className="mt-3">Loading users...</p>
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
            onClick={fetchUsers}
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
                    <i className="fas fa-users me-2"></i>
                    Admin - All Users
                  </h2>
                  <p className="text-muted mb-0">
                    Manage and view all users across the platform
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
              <h5 className="text-primary">{users.length}</h5>
              <small className="text-muted">Total Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">
                {users.filter(u => u.emailVerified).length}
              </h5>
              <small className="text-muted">Verified Users</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">
                {users.filter(u => u.role?.toLowerCase() === 'admin').length}
              </h5>
              <small className="text-muted">Admins</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {new Set(users.map(u => u.addressCountry).filter(Boolean)).size}
              </h5>
              <small className="text-muted">Countries</small>
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
                <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
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
                <div className="col-lg-2 col-md-6 mb-3 mb-lg-0">
                  <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                <div className="col-lg-2 col-md-6 mb-3 mb-lg-0">
                  <select
                    className="form-select"
                    value={filterVerification}
                    onChange={(e) => setFilterVerification(e.target.value)}
                  >
                    <option value="all">All Verification</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
                <div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="role">Sort by Role</option>
                    <option value="verification">Sort by Verification</option>
                    <option value="location">Sort by Location</option>
                  </select>
                </div>
                <div className="col-lg-2 col-md-6">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchUsers}
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

      {/* Users List */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-list me-2"></i>
                Users List ({filteredAndSortedUsers.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredAndSortedUsers.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-users fa-3x mb-3"></i>
                  <h5>No users found</h5>
                  <p>No users match your current search and filter criteria.</p>
                </div>
              ) : (
                <div className="row">
                  {filteredAndSortedUsers.map((user) => (
                    <div key={user.userId} className="col-lg-6 col-md-12 mb-4">
                      <div 
                        className="card h-100" 
                        style={styles.userCard}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.userCardHover)}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div className="card-body">
                          <div className="d-flex align-items-start mb-3">
                            <div style={styles.avatarPlaceholder} className="me-3">
                              {getInitials(user.firstName, user.lastName)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1 text-primary">
                                    {getFullName(user.firstName, user.lastName)}
                                  </h6>
                                  <div className="d-flex align-items-center">
                                    <small className="text-muted">{user.email}</small>
                                    {getEmailVerificationBadge(user.emailVerified)}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <span className={getRoleBadgeClass(user.role)}>
                                    <i className={`${getRoleIcon(user.role)} me-1`}></i>
                                    {user.role || 'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <small className="text-muted d-block">Phone Number</small>
                              <small className="fw-bold">{user.phoneNumber || 'N/A'}</small>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">City</small>
                              <small className="fw-bold">{user.addressCity || 'N/A'}</small>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <small className="text-muted d-block">Full Address</small>
                              <small className="fw-bold">
                                {getFullAddress(user.addressCity, user.addressPostalCode, user.addressCountry)}
                              </small>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <small className="text-muted d-block">User ID</small>
                              <code className="small">{user.userId}</code>
                            </div>
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

export default AdminUsersPage;