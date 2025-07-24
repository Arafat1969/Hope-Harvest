import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // Form state for editing
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    details: '',
    goalAmount: '',
    startDate: '',
    endDate: '',
    categoryId: '',
    expectedImpact: '',
    imageUrls: ['']
  });

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
      fetchCategories();
    }
  }, [campaignId]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching campaign details for ID:", campaignId);
      const response = await campaignService.getCampaignByIdAdmin(campaignId);

      console.log("Campaign details response:", response);
      const campaignData = response.data || response;
      setCampaign(campaignData);
      
      // Initialize edit form with current campaign data
      setEditForm({
        title: campaignData.title || '',
        description: campaignData.description || '',
        details: campaignData.details || '',
        goalAmount: campaignData.goalAmount || '',
        startDate: campaignData.startDate ? campaignData.startDate.split('T')[0] : '',
        endDate: campaignData.endDate ? campaignData.endDate.split('T')[0] : '',
        categoryId: campaignData.categoryId || '',
        expectedImpact: campaignData.expectedImpact || '',
        imageUrls: campaignData.imageUrl ? [campaignData.imageUrl] : ['']
      });
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

  const fetchCategories = async () => {
    try {
      const response = await campaignService.getAllCampaignCategoriesAdmin();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Helper Functions
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

  // Image Upload Functions
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('https://api.imgbb.com/1/upload?key=fb30e28eaa1aa590e4676b9284b04709', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        return result.data.url; // Returns the direct image URL
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleFileSelect = async (files) => {
    const validFiles = Array.from(files).filter(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file.`);
        return false;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingImage(true);
    
    try {
      for (const file of validFiles) {
        console.log(`Uploading ${file.name}...`);
        const imageUrl = await uploadImageToImgBB(file);
        
        setEditForm(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, imageUrl]
        }));
        
        console.log(`Successfully uploaded: ${imageUrl}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  // Edit handlers
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form when starting to edit
      setEditForm({
        title: campaign.title || '',
        description: campaign.description || '',
        details: campaign.details || '',
        goalAmount: campaign.goalAmount || '',
        startDate: campaign.startDate ? campaign.startDate.split('T')[0] : '',
        endDate: campaign.endDate ? campaign.endDate.split('T')[0] : '',
        categoryId: campaign.categoryId || '',
        expectedImpact: campaign.expectedImpact || '',
        imageUrls: campaign.imageUrl ? [campaign.imageUrl] : ['']
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...editForm.imageUrls];
    newImageUrls[index] = value;
    setEditForm(prev => ({
      ...prev,
      imageUrls: newImageUrls
    }));
  };

  const addImageUrl = () => {
    setEditForm(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, '']
    }));
  };

  const removeImageUrl = (index) => {
    if (editForm.imageUrls.length > 1) {
      const newImageUrls = editForm.imageUrls.filter((_, i) => i !== index);
      setEditForm(prev => ({
        ...prev,
        imageUrls: newImageUrls
      }));
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      // Prepare the data for API call
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        details: editForm.details,
        goalAmount: parseFloat(editForm.goalAmount),
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        categoryId: editForm.categoryId,
        expectedImpact: editForm.expectedImpact,
        imageUrls: editForm.imageUrls.filter(url => url.trim() !== '')
      };

      console.log("Updating campaign with data:", updateData);
      
      await campaignService.updateCampaign(campaignId, updateData);
      
      // Reload campaign details to show updated information
      await fetchCampaignDetails();
      
      setIsEditing(false);
      setError(null);
      
    } catch (error) {
      console.error("Error updating campaign:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update campaign. Please try again."
      );
    } finally {
      setUpdating(false);
    }
  };

  // UI Handlers
  const handleBackToCampaigns = () => navigate("/admin/campaigns");

  if (loading) {
    return (
      <div className="page-container state-container">
        <div className="loading-spinner"></div>
        <h4 className="text-muted">Loading Campaign Details...</h4>
        <p className="text-muted">Fetching campaign information</p>
      </div>
    );
  }

  if (error && !campaign) {
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
          {/* Header Section */}
          <header className="campaign-header">
            <div>
              <h3 className="header-subtitle">Campaign Dashboard</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="form-control form-control-lg"
                  placeholder="Campaign Title"
                  style={{ fontSize: '2rem', fontWeight: '700', border: '2px solid #007bff' }}
                />
              ) : (
                <h1 className="header-title">{campaign.title}</h1>
              )}
            </div>
            <div className="header-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={handleBackToCampaigns}
                disabled={updating}
              >
                Back
              </button>
              <button
                className="btn btn-info"
                onClick={() =>
                  navigate(`/admin/campaigns/${campaignId}/analytics`)
                }
                disabled={isEditing || updating}
              >
                Analytics
              </button>
              <button
                className="btn btn-success"
                onClick={() =>
                  navigate(`/admin/campaigns/${campaignId}/donations`)
                }
                disabled={isEditing || updating}
              >
                Donations
              </button>
              {isEditing ? (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={handleSaveChanges}
                    disabled={updating || uploadingImage}
                  >
                    {updating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={handleEditToggle}
                    disabled={updating || uploadingImage}
                  >
                    <i className="fas fa-times me-2"></i>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn btn-primary" onClick={handleEditToggle}>
                  <i className="fas fa-edit me-2"></i>
                  Edit Campaign
                </button>
              )}
            </div>
          </header>

          {/* Error Alert */}
          {error && campaign && (
            <div className="alert alert-danger mb-4">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Main Content */}
          {isEditing ? (
            <form onSubmit={handleSaveChanges}>
              <div className="main-grid">
                {/* Edit Form Card */}
                <div className="card info-card edit-form-card">
                  <div className="card-body">
                    <h5 className="card-title">Edit Campaign Details</h5>
                    
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          value={editForm.description}
                          onChange={handleInputChange}
                          className="form-control"
                          rows="3"
                          placeholder="Campaign description"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Goal Amount (BDT)</label>
                        <input
                          type="number"
                          name="goalAmount"
                          value={editForm.goalAmount}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Goal amount"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Start Date</label>
                        <input
                          type="date"
                          name="startDate"
                          value={editForm.startDate}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">End Date</label>
                        <input
                          type="date"
                          name="endDate"
                          value={editForm.endDate}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Category</label>
                        <select
                          name="categoryId"
                          value={editForm.categoryId}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select Category</option>
                          {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Expected Impact</label>
                        <input
                          type="text"
                          name="expectedImpact"
                          value={editForm.expectedImpact}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Expected impact"
                        />
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label">Details</label>
                        <textarea
                          name="details"
                          value={editForm.details}
                          onChange={handleInputChange}
                          className="form-control"
                          rows="4"
                          placeholder="Detailed campaign information"
                        />
                      </div>
                      
                      {/* Image Upload Section */}
                      <div className="col-12 mb-3">
                        <label className="form-label">Campaign Images</label>
                        
                        {/* Manual URL Input */}
                        <div className="mb-3">
                          <h6 className="text-muted mb-2">Add Image URLs</h6>
                          {editForm.imageUrls.map((url, index) => (
                            <div key={index} className="mb-2 d-flex gap-2">
                              <input
                                type="url"
                                value={url}
                                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                className="form-control"
                                placeholder="Image URL"
                              />
                              {editForm.imageUrls.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-outline-danger"
                                  onClick={() => removeImageUrl(index)}
                                  disabled={uploadingImage}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={addImageUrl}
                            disabled={uploadingImage}
                          >
                            <i className="fas fa-plus me-2"></i>
                            Add URL Field
                          </button>
                        </div>

                        {/* File Upload Area */}
                        <div 
                          className={`upload-area ${dragOver ? 'dragging' : ''}`}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => document.getElementById('editImageInput').click()}
                        >
                          <input
                            type="file"
                            id="editImageInput"
                            multiple
                            accept="image/*"
                            onChange={handleFileInputChange}
                            style={{ display: 'none' }}
                            disabled={uploadingImage}
                          />
                          
                          {uploadingImage ? (
                            <div>
                              <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Uploading...</span>
                              </div>
                              <h6 className="text-primary">Uploading Images...</h6>
                              <p className="text-muted mb-0 small">Please wait while we upload your images</p>
                            </div>
                          ) : (
                            <div>
                              <i className="fas fa-cloud-upload-alt fa-2x text-primary mb-2"></i>
                              <h6 className="text-primary">Upload New Images</h6>
                              <p className="text-muted mb-0 small">
                                Drag and drop images here, or click to select files
                              </p>
                              <small className="text-muted">
                                Supports: JPG, PNG, GIF (Max 10MB per image)
                              </small>
                            </div>
                          )}
                        </div>

                        {/* Display Current Images */}
                        {editForm.imageUrls.length > 0 && editForm.imageUrls.some(url => url.trim() !== '') && (
                          <div className="mt-3">
                            <h6 className="text-muted mb-3">
                              Current Images ({editForm.imageUrls.filter(url => url.trim() !== '').length})
                            </h6>
                            <div className="row">
                              {editForm.imageUrls.filter(url => url.trim() !== '').map((url, index) => (
                                <div key={index} className="col-md-4 col-lg-3 mb-3">
                                  <div className="card">
                                    <img
                                      src={url}
                                      alt={`Campaign image ${index + 1}`}
                                      className="card-img-top image-preview"
                                      onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150x150?text=Failed+to+Load';
                                      }}
                                    />
                                    <div className="card-body p-2">
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-sm w-100"
                                        onClick={() => removeImageUrl(editForm.imageUrls.indexOf(url))}
                                        disabled={uploadingImage}
                                      >
                                        <i className="fas fa-trash me-1"></i>
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Current Financials Card */}
                <div className="card info-card">
                  <div className="card-body text-center">
                    <h5 className="card-title">Current Financials</h5>
                    <CircularProgress percentage={progress} />
                    <div className="financial-summary">
                      <div>
                        <span className="financial-label">Collected</span>
                        <span className="financial-value text-success">
                          {formatCurrency(campaign.collectedAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="financial-label">Current Goal</span>
                        <span className="financial-value">
                          {formatCurrency(campaign.goalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <main className="main-grid">
              {/* Main Details Card */}
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

              {/* Financials Card */}
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

              {/* Timeline Card */}
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
          )}
        </div>
      </div>

      {/* Global Styles */}
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

        /* Loading/Error States */
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

        /* Header */
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

        /* Main Grid Layout */
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
        .edit-form-card {
          grid-column: 1 / span 8;
          grid-row: 1 / span 2;
        }
        .main-grid > .card:nth-child(2) {
          grid-column: 9 / span 4;
        }
        .main-grid > .card:nth-child(3) {
          grid-column: 9 / span 4;
        }

        /* Card Styles */
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

        /* Form Styles */
        .form-label {
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }
        .form-control {
          border-radius: 8px;
          border: 1px solid var(--border-color);
          padding: 0.75rem;
          transition: all 0.3s ease;
        }
        .form-control:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        }

        /* Upload Area Styles */
        .upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          background-color: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }
        .upload-area:hover {
          border-color: #007bff;
          background-color: #e3f2fd;
        }
        .upload-area.dragging {
          border-color: #28a745;
          background-color: #e8f5e9;
        }

        /* Image Preview */
        .image-preview {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 4px;
        }

        /* Main Details Card */
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

        /* Circular Progress */
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

        /* Financial Summary */
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

        /* Timeline */
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

        /* Responsive Design */
        @media (max-width: 1200px) {
          .main-details-card, .edit-form-card {
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