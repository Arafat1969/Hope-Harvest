import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';

const styles = {
  pageCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  eventCard: {
    borderRadius: '0.5rem',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  eventCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  statusBadge: {
    borderRadius: '15px',
    fontSize: '0.75rem',
    fontWeight: '600'
  }
};

const AdminEventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEventsAdmin();
      const eventsData = response.data || response || [];
      console.log('Events fetched:', eventsData);
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events. Please try again.');
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatDate = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleDateString('en-US', {
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
      case 'ongoing':
        return 'badge bg-success';
      case 'scheduled':
      case 'upcoming':
        return 'badge bg-primary';
      case 'completed':
        return 'badge bg-info';
      case 'cancelled':
        return 'badge bg-danger';
      case 'postponed':
        return 'badge bg-warning text-dark';
      case 'draft':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  };

  const getEventStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ongoing':
        return 'fas fa-play-circle';
      case 'scheduled':
      case 'upcoming':
        return 'fas fa-clock';
      case 'completed':
        return 'fas fa-check-circle';
      case 'cancelled':
        return 'fas fa-times-circle';
      case 'postponed':
        return 'fas fa-pause-circle';
      case 'draft':
        return 'fas fa-edit';
      default:
        return 'fas fa-calendar';
    }
  };

  const isEventUpcoming = (startDate) => {
    if (!startDate) return false;
    return new Date(startDate) > new Date();
  };

  const isEventOngoing = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  const isEventCompleted = (endDate) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const handleViewDetails = (eventId) => {
    navigate(`/admin/events/${eventId}`);
  };

  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || 
        event.status?.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'budget':
          return parseFloat(b.budgetAmount || 0) - parseFloat(a.budgetAmount || 0);
        case 'status':
          return (a.status || '').localeCompare(b.status || '');
        case 'startDate':
        default:
          return new Date(a.startDate) - new Date(b.startDate);
      }
    });

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading events...</p>
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
            onClick={fetchEvents}
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
                    <i className="fas fa-calendar-alt me-2"></i>
                    Admin - All Events
                  </h2>
                  <p className="text-muted mb-0">
                    Manage and view all events across the platform
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-success"
                    onClick={() => navigate('/admin/events/create')}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Create Event
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
              <h5 className="text-primary">{events.length}</h5>
              <small className="text-muted">Total Events</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-success">
            <div className="card-body">
              <h5 className="text-success">
                {events.filter(e => isEventUpcoming(e.startDate)).length}
              </h5>
              <small className="text-muted">Upcoming Events</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-info">
            <div className="card-body">
              <h5 className="text-info">
                {events.filter(e => isEventOngoing(e.startDate, e.endDate)).length}
              </h5>
              <small className="text-muted">Ongoing Events</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-center border-warning">
            <div className="card-body">
              <h5 className="text-warning">
                {formatCurrency(events.reduce((sum, e) => sum + parseFloat(e.budgetAmount || 0), 0))}
              </h5>
              <small className="text-muted">Total Budget</small>
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
                      placeholder="Search by title, location..."
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
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="postponed">Postponed</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3 mb-md-0">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="startDate">Sort by Start Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="budget">Sort by Budget</option>
                    <option value="status">Sort by Status</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <button 
                    className="btn btn-outline-secondary w-100"
                    onClick={fetchEvents}
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

      {/* Events List */}
      <div className="row">
        <div className="col-12">
          <div className="card" style={styles.pageCard}>
            <div className="card-header bg-white">
              <h5 className="mb-0 text-danger">
                <i className="fas fa-list me-2"></i>
                Events List ({filteredAndSortedEvents.length})
              </h5>
            </div>
            <div className="card-body">
              {filteredAndSortedEvents.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="fas fa-calendar-alt fa-3x mb-3"></i>
                  <h5>No events found</h5>
                  <p>No events match your current search and filter criteria.</p>
                </div>
              ) : (
                <div className="row">
                  {filteredAndSortedEvents.map((event) => (
                    <div key={event.eventId} className="col-lg-6 col-md-12 mb-4">
                      <div 
                        className="card h-100" 
                        style={styles.eventCard}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.eventCardHover)}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div className="card-body d-flex flex-column">
                          {/* Header with title and status */}
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="flex-grow-1">
                              <h6 className="card-title text-primary mb-1">{event.title}</h6>
                              <div className="d-flex align-items-center">
                                <i className={`${getEventStatusIcon(event.status)} me-2`}></i>
                                <span className={getStatusBadgeClass(event.status)}>
                                  {event.status || 'Unknown'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="mb-3">
                            <div className="d-flex align-items-center">
                              <i className="fas fa-map-marker-alt text-muted me-2"></i>
                              <small className="text-muted">{event.location || 'Location TBD'}</small>
                            </div>
                          </div>

                          {/* Date and Time Info */}
                          <div className="mb-3">
                            <div className="row">
                              <div className="col-6">
                                <small className="text-muted d-block">Start Date</small>
                                <small className="fw-bold">{formatDate(event.startDate)}</small>
                              </div>
                              <div className="col-6">
                                <small className="text-muted d-block">End Date</small>
                                <small className="fw-bold">{formatDate(event.endDate)}</small>
                              </div>
                            </div>
                          </div>

                          {/* Budget */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">Budget Amount</small>
                              <span className="fw-bold text-success">
                                {formatCurrency(event.budgetAmount)}
                              </span>
                            </div>
                          </div>

                          {/* Event ID */}
                          <div className="mb-3">
                            <small className="text-muted d-block">Event ID</small>
                            <code className="small">{event.eventId}</code>
                          </div>

                          {/* Time indicators */}
                          <div className="mb-3">
                            {isEventUpcoming(event.startDate) && (
                              <small className="badge bg-primary me-2">
                                <i className="fas fa-clock me-1"></i>
                                Upcoming
                              </small>
                            )}
                            {isEventOngoing(event.startDate, event.endDate) && (
                              <small className="badge bg-success me-2">
                                <i className="fas fa-play me-1"></i>
                                Live Now
                              </small>
                            )}
                            {isEventCompleted(event.endDate) && (
                              <small className="badge bg-info me-2">
                                <i className="fas fa-check me-1"></i>
                                Completed
                              </small>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto">
                            <button
                              className="btn btn-outline-primary w-100"
                              onClick={() => handleViewDetails(event.eventId)}
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

export default AdminEventsPage;