import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
// --- CORRECT: Restored your original campaignService import ---
import { campaignService } from "../services/campaignService";

// A dedicated component for the circular progress bar for reusability and clarity.
const CircularProgress = ({ percentage, size = 140, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circular-progress-container">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#28a745" />
            <stop offset="100%" stopColor="#20c997" />
          </linearGradient>
        </defs>
        <circle
          className="progress-ring-bg"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-fg"
          strokeWidth={strokeWidth}
          stroke="url(#progressGradient)"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="progress-text">
        {`${Math.round(percentage)}%`}
        <span>Complete</span>
      </div>
    </div>
  );
};

const AdminDetailedCampaign = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId]);

  // --- CORRECT: Restored your original data fetching logic ---
  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching campaign details for ID:", campaignId);
      const response = await campaignService.getCampaignByIdAdmin(campaignId);

      console.log("Campaign details response:", response);
      setCampaign(response.data || response);
    } catch (error) {
      console.error("Error fetching campaign details:", error);
      setError(
        error.response?.data?.message ||
          "Failed to load campaign details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- Helper Functions (Unchanged) ---
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };
  const calculateProgress = (collected, goal) =>
    goal > 0 ? Math.min((collected / goal) * 100, 100) : 0;
  const calculateDaysRemaining = (endDate) => {
    if (!endDate) return "N/A";
    const diff = new Date(endDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Ended";
    if (days === 0) return "Last Day";
    return `${days} Day${days !== 1 ? "s" : ""} Left`;
  };

  // --- UI Handlers (Unchanged) ---
  const handleEditCampaign = () =>
    navigate(`/admin/campaigns/${campaignId}/edit`);
  const handleBackToCampaigns = () => navigate("/admin/campaigns");

  // --- CORRECT: Restored your original, detailed loading/error/not found states with updated styling ---
  if (loading) {
    return (
      <div className="page-container state-container">
        <div className="loading-spinner"></div>
        <h4 className="text-muted">Loading Campaign Details...</h4>
        <p className="text-muted">Fetching campaign information</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container state-container">
        <div
          className="alert alert-danger text-center p-4"
          style={{ maxWidth: "500px" }}
        >
          <i className="fas fa-exclamation-triangle fa-2x mb-3 d-block"></i>
          <h4>Error Loading Campaign</h4>
          <p>{error}</p>
          <div className="d-flex gap-2 justify-content-center mt-4">
            <button className="btn btn-danger" onClick={fetchCampaignDetails}>
              <i className="fas fa-sync-alt me-2"></i>Try Again
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleBackToCampaigns}
            >
              <i className="fas fa-arrow-left me-2"></i>Back to Campaigns
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="page-container state-container">
        <div className="alert alert-warning text-center">
          <h4>Campaign Not Found</h4>
          <p>The requested campaign could not be found.</p>
          <button
            className="btn btn-secondary mt-3"
            onClick={handleBackToCampaigns}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(
    campaign.collectedAmount,
    campaign.goalAmount
  );
  const daysRemaining = calculateDaysRemaining(campaign.endDate);
  const status = daysRemaining === "Ended" ? "Completed" : "Ongoing";

  return (
    <>
      <div className="page-container">
        <div className="container-fluid">
          {/* --- Header Section --- */}
          <header className="campaign-header">
            <div>
              <h3 className="header-subtitle">Campaign Dashboard</h3>
              <h1 className="header-title">{campaign.title}</h1>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={handleBackToCampaigns}
              >
                Back
              </button>
              <button
                className="btn btn-info"
                onClick={() =>
                  navigate(`/admin/campaigns/${campaignId}/analytics`)
                }
              >
                Analytics
              </button>
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/admin/campaigns/${campaignId}/donations`)
                }
              >
                Donations
              </button>
              <button className="btn btn-primary" onClick={handleEditCampaign}>
                Edit Campaign
              </button>
            </div>
          </header>

          {/* --- Main Content Grid --- */}
          <main className="main-grid">
            {/* --- Main Details Card --- */}
            <div className="card info-card main-details-card">
              <div className="card-image-container">
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="campaign-image"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/800x400?text=Image+Not+Available";
                  }}
                />
                <span className={`status-badge status-${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>
              <div className="card-body">
                {campaign.description && (
                  <div className="campaign-details-text">
                    <h5 className="details-title">Campaign Description</h5>
                    <p>{campaign.description}</p>
                  </div>
                )}
                {campaign.details && (
                  <div className="campaign-details-text">
                    <h5 className="details-title">Campaign Details</h5>
                    <p>{campaign.details}</p>
                  </div>
                )}
              </div>
            </div>

            {/* --- Financials Card --- */}
            <div className="card info-card">
              <div className="card-body text-center">
                <h5 className="card-title">Financials</h5>
                <CircularProgress percentage={progress} />
                <div className="financial-summary">
                  <div>
                    <span className="financial-label">Collected</span>
                    <span className="financial-value text-success">
                      {formatCurrency(campaign.collectedAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="financial-label">Goal</span>
                    <span className="financial-value">
                      {formatCurrency(campaign.goalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- Timeline Card --- */}
            <div className="card info-card">
              <div className="card-body">
                <h5 className="card-title">Timeline</h5>
                <div className="row">
                  <div className="col-md-6">
                    <div className="timeline-item">
                      <i className="fas fa-play-circle text-success"></i>
                      <div>
                        <strong>Start Date</strong>
                        <p>{formatDate(campaign.startDate)}</p>
                      </div>
                    </div>
                  </div>
				  <div className="col-md-6">
					<div className="timeline-item">
						<i className="fas fa-stop-circle text-danger"></i>
						<div>
						<strong>End Date</strong>
						<p>{formatDate(campaign.endDate)}</p>
						</div>
					</div>
				  </div>	
                </div>
                <div className="timeline-remaining">
                  <i className="fas fa-clock"></i>
                  <span>{daysRemaining}</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* --- Global Styles --- */}
      <style jsx global>{`
        :root {
          --primary-color: #007bff;
          --success-color: #28a745;
          --danger-color: #dc3545;
          --info-color: #17a2b8;
          --bg-color: #f4f7f9;
          --card-bg: #ffffff;
          --text-color: #343a40;
          --text-muted: #6c757d;
          --border-color: #e9ecef;
          --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          --card-hover-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
          --border-radius: 12px;
        }

        .page-container {
          background-color: var(--bg-color);
          min-height: 100vh;
          padding: 2rem;
        }

        /* --- Loading/Error States --- */
        .state-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid var(--border-color);
          border-top: 5px solid var(--danger-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* --- Header --- */
        .campaign-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .header-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }
        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin: 0;
        }
        .header-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .header-actions .btn {
          border-radius: 8px;
          font-weight: 600;
        }

        /* --- Main Grid Layout --- */
        .main-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: auto;
          gap: 2rem;
        }
        .main-details-card {
          grid-column: 1 / span 8;
          grid-row: 1 / span 2;
        }
        .main-grid > .card:nth-child(2) {
          grid-column: 9 / span 4;
        }
        .main-grid > .card:nth-child(3) {
          grid-column: 9 / span 4;
        }

        /* --- Card Styles --- */
        .info-card {
          background: var(--card-bg);
          border: none;
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--card-hover-shadow);
        }
        .card-title {
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        /* --- Main Details Card --- */
        .card-image-container {
          position: relative;
        }
        .campaign-image {
          width: 100%;
          height: 320px;
          object-fit: cover;
        }
        .status-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
          font-weight: 700;
          border-radius: 50px;
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .status-ongoing {
          background: var(--success-color);
        }
        .status-completed {
          background: var(--danger-color);
        }
        .campaign-description {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .campaign-details-text {
          background-color: var(--bg-color);
          padding: 1.25rem;
          border-radius: 8px;
        }
        .details-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        /* --- Circular Progress --- */
        .circular-progress-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .progress-ring-bg {
          stroke: var(--border-color);
        }
        .progress-ring-fg {
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
          transition: stroke-dashoffset 0.5s ease-out;
        }
        .progress-text {
          position: absolute;
          text-align: center;
          font-size: 2.25rem;
          font-weight: 700;
          color: var(--text-color);
        }
        .progress-text span {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* --- Financial Summary --- */
        .financial-summary {
          display: flex;
          justify-content: space-around;
          width: 100%;
        }
        .financial-summary > div {
          display: flex;
          flex-direction: column;
        }
        .financial-label {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .financial-value {
          font-size: 1.5rem;
          font-weight: 600;
        }

        /* --- Timeline --- */
        .timeline-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .timeline-item i {
          font-size: 1.75rem;
        }
        .timeline-item p {
          margin: 0;
          color: var(--text-muted);
        }
        .timeline-remaining {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
          padding: 1rem;
          background-color: var(--danger-color);
          color: white;
          border-radius: 8px;
          font-size: 1.2rem;
          font-weight: 600;
        }

        /* --- Responsive Design --- */
        @media (max-width: 1200px) {
          .main-details-card {
            grid-column: 1 / span 7;
          }
          .main-grid > .card:nth-child(2) {
            grid-column: 8 / span 5;
          }
          .main-grid > .card:nth-child(3) {
            grid-column: 8 / span 5;
          }
        }
        @media (max-width: 992px) {
          .main-grid {
            display: flex;
            flex-direction: column;
          }
          .header-title {
            font-size: 1.5rem;
          }
          .header-actions {
            flex-wrap: wrap;
            justify-content: flex-start;
          }
        }
      `}</style>
    </>
  );
};

export default AdminDetailedCampaign;
