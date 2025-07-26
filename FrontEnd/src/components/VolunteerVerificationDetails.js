import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { volunteerService } from '../services/volunteerService';

const VolunteerVerificationDetails = () => {
  const { verificationId } = useParams();
  const navigate = useNavigate();

  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form states for verification report
  const [recommendation, setRecommendation] = useState('');
  const [report, setReport] = useState('');
  const [recommendedAmount, setRecommendedAmount] = useState('');

  useEffect(() => {
    if (verificationId) {
      fetchVerificationDetails();
    }
  }, [verificationId]);

  const fetchVerificationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await volunteerService.getFundVerificationDetails(verificationId);
      const verificationData = response.data || response;
      
      setVerification(verificationData);
      console.log('Fetched verification details:', verificationData);
      
      // Set initial values if already submitted (check for null values)
      if (verificationData.recommendation !== null && verificationData.recommendation !== undefined) {
        setRecommendation(verificationData.recommendation);
        console.log('Initial recommendation set:', verificationData.recommendation);
      }
      if (verificationData.report !== null ) {
        setReport(verificationData.report);
        console.log('Initial report set:', verificationData.report);
      }
      if (verificationData.recommendedAmount !== null && verificationData.recommendedAmount !== undefined) {
        setRecommendedAmount(verificationData.recommendedAmount.toString());
        console.log('Initial recommended amount set:', verificationData.recommendedAmount);
      }
      
    } catch (error) {
      console.error('Error fetching verification details:', error);
      setError(
        error.response?.data?.message || 
        'Failed to load verification details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    
    if (!recommendation.trim() || !report.trim()) {
      alert('Please provide both recommendation and verification report.');
      return;
    }

    if (!recommendedAmount || recommendedAmount <= 0) {
      alert('Please provide a valid recommended amount.');
      return;
    }

    if (parseFloat(recommendedAmount) > parseFloat(verification.amount)) {
      alert('Recommended amount cannot exceed the requested amount.');
      return;
    }

    try {
      setSubmitting(true);

      // Prepare request data according to the DTO structure
      const reportData = {
        verificationId: verificationId,
        recommendation: recommendation.trim(),
        recommendedAmount: parseFloat(recommendedAmount),
        report: report.trim()
      };

      console.log('Submitting report data:', reportData);

      const response = await volunteerService.submitFundVerificationReport(verificationId, reportData);
      
      console.log('Report submission response:', response);
      
      // Refresh verification details to get updated data
      await fetchVerificationDetails();
      
      alert('Verification report submitted successfully!');

    } catch (error) {
      console.error('Error submitting report:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to submit report. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <span className="badge bg-warning text-dark px-3 py-2">Pending</span>;
      case 'UNDER_VERIFICATION':
        return <span className="badge bg-info px-3 py-2">{status}</span>;
      case 'APPROVED':
        return <span className="badge bg-success px-3 py-2">{status}</span>;
      case 'REJECTED':
        return <span className="badge bg-danger px-3 py-2">{status}</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{status || 'Unknown'}</span>;
    }
  };

  const getRecommendationBadge = (recommendation) => {
    switch (recommendation) {
      case 'Approve':
        return <span className="badge bg-success px-3 py-2">Approve</span>;
      case 'Partially Approve':
        return <span className="badge bg-warning text-dark px-3 py-2">Partially Approve</span>;
      case 'Completely Reject':
        return <span className="badge bg-danger px-3 py-2">Completely Reject</span>;
      case 'Partially Reject':
        return <span className="badge bg-info px-3 py-2">Partially Reject</span>;
      default:
        return <span className="badge bg-secondary px-3 py-2">{recommendation || 'N/A'}</span>;
    }
  };

  const isOverdue = () => {
    if (!verification?.verificationDueDate) return false;
    return new Date() > new Date(verification.verificationDueDate);
  };

  // Updated function to check for null values properly
  const hasSubmittedReport = () => {
    return verification?.recommendation !== null ;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-muted">Loading Verification Details...</h4>
              <p className="text-muted">Please wait while we fetch the verification information</p>
            </div>
          </div>
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
              <h4>Error Loading Verification</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button className="btn btn-danger me-2" onClick={fetchVerificationDetails}>
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/volunteer/verifications')}>
                  <i className="fas fa-arrow-left me-2"></i>Back to Verifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!verification) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Verification Not Found</h4>
              <p>The requested fund verification could not be found.</p>
              <button 
                className="btn btn-secondary mt-3"
                onClick={() => navigate('/volunteer/verifications')}
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Verifications
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div 
                className="card-body text-white"
                style={{
                  background: 'linear-gradient(135deg, #ffc107 0%, #ff8c00 100%)',
                  borderRadius: '12px'
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex align-items-center">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-4"
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        fontSize: '2rem'
                      }}
                    >
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1">Fund Verification Details</h1>
                      <p className="mb-1 opacity-90">Applicant: {verification.fullName}</p>
                      <p className="mb-0 opacity-75">Verification ID: {verification.verificationId}</p>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-2">
                      {getStatusBadge(verification.status)}
                      {isOverdue() && (
                        <span className="badge bg-danger ms-2 px-3 py-2">
                          <i className="fas fa-exclamation-triangle me-1"></i>Overdue
                        </span>
                      )}
                    </div>
                    <button 
                      className="btn btn-light me-2"
                      onClick={() => navigate('/volunteer/verifications')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      All Verifications
                    </button>
                    <button 
                      className="btn btn-outline-light"
                      onClick={() => navigate('/volunteer-dashboard')}
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

        <div className="row">
          {/* Main Details */}
          <div className="col-lg-8 mb-4">
            {/* Applicant Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-user me-2 text-primary"></i>
                  Applicant Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Full Name</label>
                    <p className="mb-0 fs-6">{verification.fullName}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Phone Number</label>
                    <p className="mb-0 fs-6">{verification.phoneNumber || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">National ID</label>
                    <p className="mb-0 fs-6">{verification.nationalId || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">External User ID</label>
                    <p className="mb-0 fs-6">
                      <code>{verification.externalUserId}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-file-alt me-2 text-success"></i>
                  Application Details
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label text-muted small fw-bold">Purpose</label>
                    <p className="mb-0 fs-6">{verification.purpose}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Requested Amount</label>
                    <p className="mb-0 fs-5 fw-bold text-success">
                      {formatCurrency(verification.amount)}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Application ID</label>
                    <p className="mb-0 fs-6">
                      <code>{verification.applicationId}</code>
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">Verification Due Date</label>
                    <p className="mb-0 fs-6 text-danger fw-bold">
                      <i className="fas fa-clock me-1"></i>
                      {formatDate(verification.verificationDueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-map-marker-alt me-2 text-info"></i>
                  Address Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">Union</label>
                    <p className="mb-0 fs-6">{verification.union || 'N/A'}</p>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">Upazilla</label>
                    <p className="mb-0 fs-6">{verification.upazilla || 'N/A'}</p>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">District</label>
                    <p className="mb-0 fs-6">{verification.district || 'N/A'}</p>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">Postal Code</label>
                    <p className="mb-0 fs-6">{verification.postalCode || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-university me-2 text-warning"></i>
                  Bank Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Account Number</label>
                    <p className="mb-0 fs-6">
                      <code>{verification.bankAccountNumber || 'N/A'}</code>
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Bank Name</label>
                    <p className="mb-0 fs-6">{verification.bankName || 'N/A'}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Branch</label>
                    <p className="mb-0 fs-6">{verification.bankBranch || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supporting Documents */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-file-alt me-2 text-secondary"></i>
                  Supporting Documents
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">NID Document</label>
                    {verification.nid ? (
                      <div>
                        <button 
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={() => window.open(verification.nid, '_blank')}
                          title="View NID Document"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          View NID
                        </button>
                      </div>
                    ) : (
                      <p className="mb-0 fs-6 text-muted">Not provided</p>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Nationality Proof</label>
                    {verification.nationalityProof ? (
                      <div>
                        <button 
                          className="btn btn-outline-success btn-sm w-100"
                          onClick={() => window.open(verification.nationalityProof, '_blank')}
                          title="View Nationality Proof"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          View Nationality Proof
                        </button>
                      </div>
                    ) : (
                      <p className="mb-0 fs-6 text-muted">Not provided</p>
                    )}
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">Other Document</label>
                    {verification.otherDocument ? (
                      <div>
                        <button 
                          className="btn btn-outline-info btn-sm w-100"
                          onClick={() => window.open(verification.otherDocument, '_blank')}
                          title="View Other Document"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          View Document
                        </button>
                      </div>
                    ) : (
                      <p className="mb-0 fs-6 text-muted">Not provided</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Click on any document button to view in a new tab. Documents are stored securely and may require authentication.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Verification Report Form/Display */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-warning">
                  <i className="fas fa-edit me-2"></i>
                  Verification Report
                </h5>
              </div>
              <div className="card-body">
                {hasSubmittedReport() ? (
                  /* Display completed verification report - All fields are NOT null */
                  <div>
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">Recommendation</label>
                      <div className="mb-2">
                        {getRecommendationBadge(verification.recommendation)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">Recommended Amount</label>
                      <p className="mb-0 fs-5 fw-bold text-success">
                        {formatCurrency(verification.recommendedAmount)}
                      </p>
                      {verification.recommendedAmount !== verification.amount && (
                        <small className="text-muted">
                          Original: {formatCurrency(verification.amount)}
                        </small>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">Verification Report</label>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-0 fs-6" style={{ whiteSpace: 'pre-wrap' }}>
                          {verification.report}
                        </p>
                      </div>
                    </div>

                    <div className="alert alert-success mb-3">
                      <i className="fas fa-info-circle me-2"></i>
                      <small>
                        Verification report has been submitted successfully. The application is now under admin review.
                      </small>
                    </div>

                    <button className="btn btn-secondary w-100" disabled>
                      <i className="fas fa-check me-2"></i>
                      Already Submitted
                    </button>
                  </div>
                ) : (
                  /* Show form for submission - Any field is null */
                  <form onSubmit={handleSubmitReport}>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Recommended Amount (BDT) *</label>
                      <input 
                        type="number"
                        className="form-control"
                        value={recommendedAmount}
                        onChange={(e) => setRecommendedAmount(e.target.value)}
                        placeholder="Enter recommended amount"
                        min="0"
                        max={verification?.amount}
                        step="0.01"
                        required
                      />
                      <div className="form-text">
                        Maximum: {formatCurrency(verification?.amount)}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Recommendation *</label>
                      <select 
                        className="form-select"
                        value={recommendation}
                        onChange={(e) => setRecommendation(e.target.value)}
                        required
                      >
                        <option value="">Choose recommendation...</option>
                        <option value="Approve">Approve the Application</option>
                        <option value="Partially Approve">Partially Approve with reduced amount</option>
                        <option value="Completely Reject">Completely Reject the Application</option>
                        <option value="Partially Reject">Partially Reject with resubmission of documents</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-bold">Verification Report *</label>
                      <textarea 
                        className="form-control"
                        rows="5"
                        value={report}
                        onChange={(e) => setReport(e.target.value)}
                        placeholder="Provide detailed verification report including your findings, observations, and reasoning for your recommendation..."
                        required
                        minLength={50}
                      />
                      <div className="form-text">
                        Minimum 50 characters required ({report.length}/50)
                      </div>
                    </div>

                    <button 
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={submitting || report.length < 50}
                    >
                      {submitting ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check me-2"></i>
                          Submit Report
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-header bg-white border-0" style={{ borderRadius: '12px 12px 0 0' }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-tools me-2 text-secondary"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={() => window.print()}
                  >
                    <i className="fas fa-print me-2"></i>
                    Print Details
                  </button>
                  <button 
                    className="btn btn-outline-info"
                    onClick={() => {
                      const data = JSON.stringify(verification, null, 2);
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `verification-${verification.verificationId}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <i className="fas fa-download me-2"></i>
                    Export Data
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => {
                      if (verification.phoneNumber) {
                        window.open(`tel:${verification.phoneNumber}`);
                      } else {
                        alert('Phone number not available for this applicant.');
                      }
                    }}
                  >
                    <i className="fas fa-phone me-2"></i>
                    Contact Applicant
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={fetchVerificationDetails}
                    disabled={loading}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerVerificationDetails;