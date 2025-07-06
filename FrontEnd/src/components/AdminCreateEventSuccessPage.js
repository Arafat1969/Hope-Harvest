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
  statusBadge: {
    borderRadius: '15px',
    fontSize: '0.75rem',
    fontWeight: '600'
  }
};

const AdminCreateEventSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    // Get event data from navigation state
    const data = location.state?.eventData;
    if (data) {
      setEventData(data);
    } else {
      // If no data, redirect back to create page
      navigate('/admin/create/events');
    }
  }, [location.state, navigate]);

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
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
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
        return 'badge bg-primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'ongoing':
        return 'fas fa-play-circle';
      case 'scheduled':
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

  if (!eventData) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading event details...</p>
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
                  Event Created Successfully!
                </h2>
                <p className="text-muted mb-0">
                  Your event has been created and is now available for management
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <div className="card" style={styles.successCard}>
            <div className="card-header bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-success">
                  <i className="fas fa-calendar-alt me-2"></i>
                  Event Details
                </h5>
                <span className={getStatusBadgeClass(eventData.status)}>
                  <i className={`${getStatusIcon(eventData.status)} me-1`}></i>
                  {eventData.status || 'Created'}
                </span>
              </div>
            </div>
            <div className="card-body">
              {/* Event Title & ID */}
              <div className="row mb-3">
                <div className="col-12">
                  <h3 className="text-primary mb-2">{eventData.title}</h3>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">
                      <i className="fas fa-hashtag me-1"></i>
                      Event ID: {eventData.eventId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="row mb-4">
                <div className="col-12">
                  <h6 className="text-muted">Description</h6>
                  <p>{eventData.description}</p>
                </div>
              </div>

              {/* Date and Location Information */}
              <div className="row mb-4">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-calendar-plus text-success me-3"></i>
                    <div>
                      <small className="text-muted d-block">Start Date & Time</small>
                      <span className="fw-bold">{formatDateTime(eventData.startDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-calendar-times text-danger me-3"></i>
                    <div>
                      <small className="text-muted d-block">End Date & Time</small>
                      <span className="fw-bold">{formatDateTime(eventData.endDate)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="row mb-4">
                <div className="col-12">
                  <div className="d-flex align-items-start">
                    <i className="fas fa-map-marker-alt text-primary me-3 mt-1"></i>
                    <div>
                      <small className="text-muted d-block">Event Location</small>
                      <div className="fw-bold">
                        <div>{eventData.locationAddress}</div>
                        <div>{eventData.locationCity}, {eventData.locationDistrict}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="card border-primary">
                    <div className="card-body text-center">
                      <i className="fas fa-money-bill-wave text-primary fa-2x mb-2"></i>
                      <h4 className="text-primary">{formatCurrency(eventData.budgetAmount)}</h4>
                      <small className="text-muted">Budget Amount</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-info">
                    <div className="card-body text-center">
                      <i className="fas fa-boxes text-info fa-2x mb-2"></i>
                      <h4 className="text-info">{eventData.requiredGoods?.length || 0}</h4>
                      <small className="text-muted">Required Items</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Required Goods */}
              {eventData.requiredGoods && eventData.requiredGoods.length > 0 && (
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-muted mb-3">Required Goods</h6>
                    <div className="table-responsive">
                      <table className="table table-sm table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit</th>
                            <th>Unit Price</th>
                            <th>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {eventData.requiredGoods.map((good, index) => (
                            <tr key={index}>
                              <td>{good.item}</td>
                              <td>{good.quantity}</td>
                              <td>{good.unit}</td>
                              <td>{formatCurrency(good.unitPrice)}</td>
                              <td>{formatCurrency(good.totalPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="table-light">
                          <tr>
                            <th colSpan="4">Total Cost:</th>
                            <th>{formatCurrency(eventData.requiredGoods.reduce((sum, good) => sum + (good.totalPrice || 0), 0))}</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Report Section (if available) */}
              {eventData.report && (
                <div className="row mb-4">
                  <div className="col-12">
                    <h6 className="text-muted">Event Report</h6>
                    <div className="alert alert-info">
                      {eventData.report}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="row">
                <div className="col-12">
                  <div className="d-flex flex-wrap gap-3 justify-content-center">
                    <button
                      className="btn btn-success"
                      onClick={() => navigate(`/admin/events/${eventData.eventId}`)}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Event Details
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/admin/events')}
                    >
                      <i className="fas fa-list me-2"></i>
                      All Events
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => navigate('/admin/create/events')}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Create Another Event
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

export default AdminCreateEventSuccessPage;