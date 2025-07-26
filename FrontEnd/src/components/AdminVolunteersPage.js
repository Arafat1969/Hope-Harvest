import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';
import { authService } from '../services/authService';

const AdminVolunteersPage = () => {
  const navigate = useNavigate();
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

      // Then, enrich each volunteer with only first and last name from user details
      const enrichedData = await Promise.allSettled(
        volunteersData.map(async (volunteer) => {
          try {
            const userResponse = await authService.getUserById(volunteer.externalUserId);
            const userData = userResponse.data || userResponse || {};
            
            return {
              ...volunteer,
              firstName: userData.firstName || 'N/A',
              lastName: userData.lastName || 'N/A',
              fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'N/A'
            };
          } catch (error) {
            console.error(`Error fetching user details for volunteer ${volunteer.volunteerId}:`, error);
            return {
              ...volunteer,
              firstName: 'N/A',
              lastName: 'N/A',
              fullName: 'N/A'
            };
          }
        })
      );

      const enrichedVolunteers = enrichedData
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      console.log('Enriched volunteers:', enrichedVolunteers);
      setVolunteers(enrichedVolunteers);

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

  const handleVolunteerClick = (volunteerId) => {
    navigate(`/admin/volunteers/${volunteerId}`);
  };

  const filteredAndSortedVolunteers = volunteers
    .filter(volunteer => {
      const matchesSearch = 
        volunteer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.phoneNumber?.includes(searchTerm) ||
        volunteer.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        volunteer.lastName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'email':
          return (a.email || '').localeCompare(b.email || '');
        case 'phone':
          return (a.phoneNumber || '').localeCompare(b.phoneNumber || '');
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger mb-3" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted">Loading Volunteers...</h4>
          <p className="text-muted">Please wait while we fetch volunteer information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-danger text-center">
              <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
              <h4>Error Loading Volunteers</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button className="btn btn-danger me-2" onClick={fetchVolunteers}>
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/admin-dashboard')}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffe8e8 100%)', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body" style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', color: 'white', borderRadius: '15px' }}>
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div>
                    <h1 className="h3 mb-2">
                      <i className="fas fa-hands-helping me-2"></i>
                      Admin - All Volunteers
                    </h1>
                    <p className="mb-0 opacity-75">Total Volunteers: {volunteers.length}</p>
                  </div>
                  <div className="text-end">
                    <button 
                      className="btn btn-light me-2"
                      onClick={() => navigate('/admin-dashboard')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={fetchVolunteers}
                    >
                      <i className="fas fa-sync-alt me-2"></i>
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
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
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 mb-3 mb-md-0">
                    <select
                      className="form-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="email">Sort by Email</option>
                      <option value="phone">Sort by Phone</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="text-muted">
                      Showing {filteredAndSortedVolunteers.length} of {volunteers.length} volunteers
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteers List */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
              <div className="card-header bg-white" style={{ borderRadius: '15px 15px 0 0' }}>
                <h5 className="mb-0 text-danger">
                  <i className="fas fa-list me-2"></i>
                  Volunteers List
                </h5>
              </div>
              <div className="card-body p-0">
                {filteredAndSortedVolunteers.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-hands-helping fa-4x text-muted mb-4"></i>
                    <h4 className="text-muted">No Volunteers Found</h4>
                    <p className="text-muted mb-4">
                      {searchTerm ? 'No volunteers match your search criteria.' : 'No volunteers are registered yet.'}
                    </p>
                    {searchTerm && (
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="fas fa-times me-2"></i>
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {filteredAndSortedVolunteers.map((volunteer, index) => (
                      <button
                        key={volunteer.volunteerId}
                        type="button"
                        className="list-group-item list-group-item-action p-4 border-0"
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          borderRadius: index === 0 ? '0' : '0',
                          borderBottom: index === filteredAndSortedVolunteers.length - 1 ? 'none' : '1px solid #eee'
                        }}
                        onClick={() => handleVolunteerClick(volunteer.volunteerId)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8f9fa';
                          e.currentTarget.style.transform = 'translateX(5px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {/* Avatar */}
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: '50px',
                              height: '50px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {getInitials(volunteer.fullName)}
                          </div>

                          {/* Main Info */}
                          <div className="flex-grow-1">
                            <div className="row align-items-center">
                              <div className="col-md-4">
                                <h6 className="mb-1 text-danger fw-bold">{volunteer.fullName}</h6>
                                <small className="text-muted">
                                  <i className="fas fa-id-badge me-1"></i>
                                  ID: {volunteer.volunteerId.slice(0, 8)}...
                                </small>
                              </div>
                              <div className="col-md-3">
                                <small className="text-muted d-block">Email</small>
                                <span className="fw-bold">{volunteer.email || 'N/A'}</span>
                              </div>
                              <div className="col-md-3">
                                <small className="text-muted d-block">Phone</small>
                                <span className="fw-bold">{volunteer.phoneNumber || 'N/A'}</span>
                              </div>
                              <div className="col-md-2 text-end">
                                <span className="badge bg-success mb-2">Volunteer</span>
                                <div>
                                  <i className="fas fa-arrow-right text-muted"></i>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Note */}
        {filteredAndSortedVolunteers.length > 0 && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body text-center">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-2"></i>
                    Click on any volunteer to view their detailed information and manage their account.
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVolunteersPage;