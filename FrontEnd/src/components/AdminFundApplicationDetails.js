import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fundApplicationService } from "../services/fundApplicationService";
import { volunteerService } from "../services/volunteerService";
import { authService } from "../services/authService";

const AdminFundApplicationDetails = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [assigningVolunteer, setAssigningVolunteer] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [selectedVolunteerId, setSelectedVolunteerId] = useState("");
  const [showVolunteerForm, setShowVolunteerForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [disbursedAmount, setDisbursedAmount] = useState('');

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
      fetchVolunteers();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching application details for ID:", applicationId);
      const response = await fundApplicationService.getFundApplicationAdmin(
        applicationId
      );

      console.log("Application details response:", response);
      const applicationData = response.data || response;
      setApplication(applicationData);
    } catch (error) {
      console.error("Error fetching application details:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load application details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      // Get all volunteers
      const volunteersResponse = await volunteerService.getAllVolunteersAdmin();
      const volunteersData =
        volunteersResponse.data || volunteersResponse || [];

      // Enrich volunteers with user details (names)
      const enrichedVolunteers = await Promise.allSettled(
        volunteersData.map(async (volunteer) => {
          try {
            const userResponse = await authService.getUserById(
              volunteer.externalUserId
            );
            const userData = userResponse.data || userResponse || {};

            return {
              ...volunteer,
              fullName:
                `${userData.firstName || ""} ${
                  userData.lastName || ""
                }`.trim() || "N/A",
            };
          } catch (error) {
            console.error(
              `Error fetching user details for volunteer ${volunteer.volunteerId}:`,
              error
            );
            return {
              ...volunteer,
              fullName: "N/A",
            };
          }
        })
      );

      const validVolunteers = enrichedVolunteers
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value)
        .filter((volunteer) => volunteer.fullName !== "N/A");

      setVolunteers(validVolunteers);
    } catch (error) {
      console.error("Error fetching volunteers:", error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setUpdating(true);

      // Get current date-time for disbursementDate
      const getCurrentZonedDateTime = () => {
        return new Date().toISOString(); // This gives UTC ISO string with Z
      };

      const statusData = {
        status: newStatus,
        feedback: feedback.trim() || null,
        disbursedAmount: disbursedAmount ? parseFloat(disbursedAmount) : null,
        disbursementDate: (newStatus === 'APPROVED' || newStatus === 'REJECTED') ? getCurrentZonedDateTime() : null
      };

      console.log("Updating status with data:", statusData);

      await fundApplicationService.updateFundVerificationStatus(
        applicationId,
        statusData
      );

      // Refresh application details
      await fetchApplicationDetails();

      // Reset form
      setFeedback('');
      setDisbursedAmount('');

      // Show success message
      const statusText = newStatus === 'APPROVED' ? 'approved' : 'rejected';
      alert(`Application ${statusText} successfully!`);

    } catch (error) {
      console.error("Error updating status:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleVolunteerAssignment = async (e) => {
    e.preventDefault();

    if (!selectedVolunteerId) {
      alert("Please select a volunteer to assign.");
      return;
    }

    try {
      setAssigningVolunteer(true);

      // First assign the volunteer
      const volunteerData = {
        volunteerId: selectedVolunteerId,
      };

      console.log("Assigning volunteer with data:", volunteerData);

      await fundApplicationService.assignVolunteerForVerification(
        applicationId,
        volunteerData
      );

      // Then update status to UNDER_VERIFICATION
      const statusData = {
        status: 'UNDER_VERIFICATION',
        feedback: null,
        disbursedAmount: null,
        disbursementDate: null
      };

      await fundApplicationService.updateFundVerificationStatus(
        applicationId,
        statusData
      );

      // Refresh application details
      await fetchApplicationDetails();

      // Reset form
      setSelectedVolunteerId("");
      setShowVolunteerForm(false);

      // Show success message
      alert("Volunteer assigned and application sent for verification successfully!");

    } catch (error) {
      console.error("Error assigning volunteer:", error);
      alert(
        error.response?.data?.message ||
          "Failed to assign volunteer. Please try again."
      );
    } finally {
      setAssigningVolunteer(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "N/A";
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return (
          <span className="badge bg-warning text-dark px-3 py-2">Pending</span>
        );
      case "UNDER_VERIFICATION":
        return (
          <span className="badge bg-info px-3 py-2">Under Verification</span>
        );
      case "APPROVED":
        return <span className="badge bg-success px-3 py-2">Approved</span>;
      case "REJECTED":
        return <span className="badge bg-danger px-3 py-2">Rejected</span>;
      default:
        return (
          <span className="badge bg-secondary px-3 py-2">
            {status || "Unknown"}
          </span>
        );
    }
  };

  const getAssignedVolunteerName = () => {
    if (!application?.assignedVolunteerId) return "Not assigned";

    const assignedVolunteer = volunteers.find(
      (v) => v.volunteerId === application.assignedVolunteerId
    );
    return assignedVolunteer?.fullName || "Unknown Volunteer";
  };

  const canUpdateStatus = () => {
    return ["PENDING", "UNDER_VERIFICATION"].includes(
      application?.status?.toUpperCase()
    );
  };

  const canAssignVolunteer = () => {
    return application?.status?.toUpperCase() === "PENDING" && !application?.assignedVolunteerId;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="text-center">
              <div
                className="spinner-border text-primary mb-3"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
              <h4 className="text-muted">Loading Application Details...</h4>
              <p className="text-muted">
                Please wait while we fetch the application information
              </p>
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
              <h4>Error Loading Application</h4>
              <p>{error}</p>
              <div className="mt-4">
                <button
                  className="btn btn-danger me-2"
                  onClick={fetchApplicationDetails}
                >
                  <i className="fas fa-sync-alt me-2"></i>Try Again
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/admin/fund-applications")}
                >
                  <i className="fas fa-arrow-left me-2"></i>Back to Applications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4>Application Not Found</h4>
              <p>The requested fund application could not be found.</p>
              <button
                className="btn btn-secondary mt-3"
                onClick={() => navigate("/admin/fund-applications")}
              >
                <i className="fas fa-arrow-left me-2"></i>Back to Applications
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}>
      <div className="container py-5">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-body text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                  borderRadius: "12px",
                }}
              >
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex align-items-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-4"
                      style={{
                        width: "80px",
                        height: "80px",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        fontSize: "2rem",
                      }}
                    >
                      <i className="fas fa-money-check-alt"></i>
                    </div>
                    <div>
                      <h1 className="h3 mb-1">Fund Application Details</h1>
                      <p className="mb-1 opacity-90">
                        Applicant: {application.fullName}
                      </p>
                      <p className="mb-0 opacity-75">
                        Application ID: {application.applicationId}
                      </p>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="mb-2">
                      {getStatusBadge(application.status)}
                    </div>
                    <button
                      className="btn btn-light me-2"
                      onClick={() => navigate("/admin/fund-applications")}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      All Applications
                    </button>
                    <button
                      className="btn btn-outline-light"
                      onClick={() => navigate("/admin-dashboard")}
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
          {/* Main Application Details */}
          <div className="col-lg-8 mb-4">
            {/* Basic Information */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-header bg-white border-0"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-user me-2 text-primary"></i>
                  Applicant Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Full Name
                    </label>
                    <p className="mb-0 fs-6">{application.fullName}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Phone Number
                    </label>
                    <p className="mb-0 fs-6">
                      {application.phoneNumber || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      National ID
                    </label>
                    <p className="mb-0 fs-6">
                      {application.nationalId || "N/A"}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      External User ID
                    </label>
                    <p className="mb-0 fs-6">
                      <code>{application.externalUserId}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-header bg-white border-0"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-file-alt me-2 text-success"></i>
                  Application Details
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Purpose
                    </label>
                    <p className="mb-0 fs-6">{application.purpose}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Requested Amount
                    </label>
                    <p className="mb-0 fs-5 fw-bold text-success">
                      {formatCurrency(application.amount)}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Submission Date
                    </label>
                    <p className="mb-0 fs-6">
                      {formatDate(application.submissionDate)}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Current Status
                    </label>
                    <div>{getStatusBadge(application.status)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-header bg-white border-0"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-map-marker-alt me-2 text-info"></i>
                  Address Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Union
                    </label>
                    <p className="mb-0 fs-6">{application.union || "N/A"}</p>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Upazilla
                    </label>
                    <p className="mb-0 fs-6">{application.upazilla || "N/A"}</p>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      District
                    </label>
                    <p className="mb-0 fs-6">{application.district || "N/A"}</p>
                  </div>
                  <div className="col-md-3 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Postal Code
                    </label>
                    <p className="mb-0 fs-6">
                      {application.postalCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-header bg-white border-0"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-university me-2 text-warning"></i>
                  Bank Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Account Number
                    </label>
                    <p className="mb-0 fs-6">
                      <code>{application.bankAccountNumber || "N/A"}</code>
                    </p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Bank Name
                    </label>
                    <p className="mb-0 fs-6">{application.bankName || "N/A"}</p>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Branch
                    </label>
                    <p className="mb-0 fs-6">
                      {application.bankBranch || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div
              className="card border-0 shadow-sm mb-4"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-header bg-white border-0"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-file-alt me-2 text-secondary"></i>
                  Supporting Documents
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label text-muted small fw-bold">
                      NID Document
                    </label>
                    {application.nid ? (
                      <div>
                        <button
                          className="btn btn-outline-primary btn-sm w-100"
                          onClick={() => window.open(application.nid, "_blank")}
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
                    <label className="form-label text-muted small fw-bold">
                      Nationality Proof
                    </label>
                    {application.nationalityProof ? (
                      <div>
                        <button
                          className="btn btn-outline-success btn-sm w-100"
                          onClick={() =>
                            window.open(application.nationalityProof, "_blank")
                          }
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
                    <label className="form-label text-muted small fw-bold">
                      Other Document
                    </label>
                    {application.otherDocument ? (
                      <div>
                        <button
                          className="btn btn-outline-info btn-sm w-100"
                          onClick={() =>
                            window.open(application.otherDocument, "_blank")
                          }
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

                {/* Document Summary */}
                <div className="mt-3 pt-3 border-top">
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Click on any document button to view in a new tab. Documents
                    are stored securely and may require authentication.
                  </small>
                </div>
              </div>
            </div>

            {/* Verification Details */}
            {(application.assignedVolunteerId ||
              application.recommendation ||
              application.report) && (
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "12px" }}
              >
                <div
                  className="card-header bg-white border-0"
                  style={{ borderRadius: "12px 12px 0 0" }}
                >
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-shield-alt me-2 text-primary"></i>
                    Verification Details
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small fw-bold">
                        Assigned Volunteer
                      </label>
                      <p className="mb-0 fs-6">{getAssignedVolunteerName()}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label text-muted small fw-bold">
                        Recommended Amount
                      </label>
                      <p className="mb-0 fs-6">
                        {formatCurrency(application.recommendedAmount)}
                      </p>
                    </div>
                    {application.recommendation && (
                      <div className="col-12 mb-3">
                        <label className="form-label text-muted small fw-bold">
                          Recommendation
                        </label>
                        <p className="mb-0 fs-6">
                          {application.recommendation}
                        </p>
                      </div>
                    )}
                    {application.report && (
                      <div className="col-12 mb-3">
                        <label className="form-label text-muted small fw-bold">
                          Verification Report
                        </label>
                        <p className="mb-0 fs-6">{application.report}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Status Management */}
            {canUpdateStatus() && (
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "12px" }}
              >
                <div
                  className="card-header bg-white border-0"
                  style={{ borderRadius: "12px 12px 0 0" }}
                >
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-cogs me-2 text-primary"></i>
                    Application Management
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Current Status
                    </label>
                    <div>{getStatusBadge(application.status)}</div>
                  </div>

                  {/* Status Management Form */}
                  <form onSubmit={(e) => e.preventDefault()}>
                    {/* Feedback Field */}
                    <div className="mb-3">
                      <label htmlFor="feedback" className="form-label fw-bold">
                        Feedback / Comments
                      </label>
                      <textarea
                        className="form-control"
                        id="feedback"
                        rows="3"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Enter feedback or comments about this application..."
                      />
                      <div className="form-text">
                        Provide any feedback or reasons for your decision
                      </div>
                    </div>

                    {/* Disbursed Amount Field */}
                    <div className="mb-3">
                      <label htmlFor="disbursedAmount" className="form-label fw-bold">
                        Disbursed Amount (BDT)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="disbursedAmount"
                        value={disbursedAmount}
                        onChange={(e) => setDisbursedAmount(e.target.value)}
                        placeholder="Enter disbursed amount"
                        min="0"
                        max={application.amount}
                        step="0.01"
                      />
                      <div className="form-text">
                        Maximum: {formatCurrency(application.amount)}
                        {application.recommendedAmount && (
                          <span className="text-info ms-2">
                            (Recommended: {formatCurrency(application.recommendedAmount)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="row g-2">
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-success w-100"
                          onClick={() => handleStatusUpdate('APPROVED')}
                          disabled={updating}
                        >
                          {updating ? (
                            <>
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Approve
                            </>
                          )}
                        </button>
                      </div>
                      <div className="col-6">
                        <button
                          type="button"
                          className="btn btn-danger w-100"
                          onClick={() => handleStatusUpdate('REJECTED')}
                          disabled={updating}
                        >
                          {updating ? (
                            <>
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-times me-2"></i>
                              Reject
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Help Text */}
                    <div className="mt-3 pt-3 border-top">
                      <small className="text-muted">
                        <i className="fas fa-info-circle me-1"></i>
                        Both approve and reject actions will be recorded with timestamp. 
                        Feedback and disbursed amount are optional but recommended.
                      </small>
                    </div>
                  </form>

                  {/* Current Status Info */}
                  {application.status?.toUpperCase() === 'UNDER_VERIFICATION' && (
                    <div className="alert alert-info mt-3 mb-0">
                      <i className="fas fa-info-circle me-2"></i>
                      <small>
                        Application is under verification by: <strong>{getAssignedVolunteerName()}</strong>
                        <br />
                        You can approve or reject the application at any time.
                      </small>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Volunteer Assignment - Only for PENDING status with no volunteer */}
            {canAssignVolunteer() && (
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "12px" }}
              >
                <div
                  className="card-header bg-white border-0"
                  style={{ borderRadius: "12px 12px 0 0" }}
                >
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-user-plus me-2 text-success"></i>
                    Assign Volunteer
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Current Assignment
                    </label>
                    <p className="mb-0 text-muted">
                      {getAssignedVolunteerName()}
                    </p>
                  </div>

                  {!showVolunteerForm ? (
                    <button
                      className="btn btn-outline-success w-100"
                      onClick={() => setShowVolunteerForm(true)}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Assign Volunteer
                    </button>
                  ) : (
                    <form onSubmit={handleVolunteerAssignment}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">
                          Select Volunteer
                        </label>
                        <select
                          className="form-select"
                          value={selectedVolunteerId}
                          onChange={(e) =>
                            setSelectedVolunteerId(e.target.value)
                          }
                          required
                        >
                          <option value="">Choose a volunteer...</option>
                          {volunteers.map((volunteer) => (
                            <option
                              key={volunteer.volunteerId}
                              value={volunteer.volunteerId}
                            >
                              {volunteer.fullName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-success flex-fill"
                          disabled={assigningVolunteer || !selectedVolunteerId}
                        >
                          {assigningVolunteer ? (
                            <>
                              <div
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                              Assigning...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-check me-2"></i>
                              Assign
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setShowVolunteerForm(false);
                            setSelectedVolunteerId("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* Show assigned volunteer info for non-pending status or when volunteer is already assigned */}
            {(application.assignedVolunteerId && !canAssignVolunteer()) && (
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "12px" }}
              >
                <div
                  className="card-header bg-white border-0"
                  style={{ borderRadius: "12px 12px 0 0" }}
                >
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-user-check me-2 text-info"></i>
                    Assigned Volunteer
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      Volunteer
                    </label>
                    <p className="mb-0 fs-6 text-success fw-bold">
                      <i className="fas fa-user me-2"></i>
                      {getAssignedVolunteerName()}
                    </p>
                  </div>
                  
                  <div className="alert alert-info mb-0">
                    <i className="fas fa-info-circle me-2"></i>
                    <small>
                      Volunteer assignment is permanent and cannot be changed once assigned.
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* Final Status (for approved/rejected) */}
            {["APPROVED", "REJECTED"].includes(
              application.status?.toUpperCase()
            ) && (
              <div
                className="card border-0 shadow-sm mb-4"
                style={{ borderRadius: "12px" }}
              >
                <div
                  className="card-header bg-white border-0"
                  style={{ borderRadius: "12px 12px 0 0" }}
                >
                  <h5 className="mb-0 text-dark">
                    <i className="fas fa-flag-checkered me-2 text-info"></i>
                    Final Status
                  </h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label text-muted small fw-bold">
                      Status
                    </label>
                    <div>{getStatusBadge(application.status)}</div>
                  </div>

                  {application.feedback && (
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">
                        Feedback
                      </label>
                      <p className="mb-0 fs-6">{application.feedback}</p>
                    </div>
                  )}

                  {application.disbursedAmount && (
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">
                        Disbursed Amount
                      </label>
                      <p className="mb-0 fs-5 fw-bold text-success">
                        {formatCurrency(application.disbursedAmount)}
                      </p>
                    </div>
                  )}

                  {application.disbursementDate && (
                    <div className="mb-3">
                      <label className="form-label text-muted small fw-bold">
                        Disbursement Date
                      </label>
                      <p className="mb-0 fs-6">
                        {formatDate(application.disbursementDate)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "12px" }}
            >
              <div
                className="card-header bg-white border-0"
                style={{ borderRadius: "12px 12px 0 0" }}
              >
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-tools me-2 text-secondary"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-download me-2"></i>
                    Export Details
                  </button>
                  <button className="btn btn-outline-info">
                    <i className="fas fa-print me-2"></i>
                    Print Application
                  </button>
                  <button className="btn btn-outline-warning">
                    <i className="fas fa-envelope me-2"></i>
                    Contact Applicant
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={fetchApplicationDetails}
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

export default AdminFundApplicationDetails;