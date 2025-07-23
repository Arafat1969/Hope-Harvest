import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fundApplicationService } from '../services/fundApplicationService';

const styles = {
  mainContainer: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  headerCard: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    borderRadius: '25px',
    padding: '3rem 2rem',
    color: 'white',
    marginBottom: '3rem',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  formCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '2.5rem',
    boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
    border: '1px solid #e8f5e9'
  },
  sectionTitle: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: '1.4rem',
    marginBottom: '1.5rem',
    borderBottom: '2px solid #e8f5e9',
    paddingBottom: '0.5rem'
  },
  inputGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: '0.5rem',
    display: 'block'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e8f5e9',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e8f5e9',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    minHeight: '120px',
    resize: 'vertical'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e8f5e9',
    borderRadius: '10px',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    outline: 'none',
    backgroundColor: 'white'
  },
  documentCard: {
    border: '2px solid #e8f5e9',
    borderRadius: '15px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    backgroundColor: '#fafafa',
    transition: 'all 0.3s ease'
  },
  documentCardRequired: {
    borderColor: '#ffeb3b',
    backgroundColor: '#fffde7'
  },
  documentHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  documentIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    fontSize: '1.5rem',
    color: 'white'
  },
  uploadArea: {
    border: '2px dashed #4CAF50',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    backgroundColor: '#f8fff8',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  uploadAreaActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#2E7D32'
  },
  uploadedFile: {
    background: '#e8f5e9',
    border: '1px solid #4CAF50',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    margin: '0.5rem 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  submitButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '15px 40px',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
    width: '100%'
  },
  cancelButton: {
    background: 'transparent',
    border: '2px solid #6c757d',
    borderRadius: '50px',
    padding: '15px 40px',
    color: '#6c757d',
    fontWeight: '600',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    marginRight: '1rem'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '0.5rem'
  },
  errorText: {
    color: '#dc3545',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  }
};

const uploadPdfToPdfCo = async (file) => {
  const apiKey = "2005104@ugrad.cse.buet.ac.bd_s8uwbn6n1QX7fsEYzLfj9GuHA9GYTNqdGRiKT3mViELGAhXXD65MHPMYN5dzHpNH";

  const formData = new FormData();
  formData.append("x-api-key", apiKey);
  formData.append("name", file.name);
  formData.append("file", file);

  try {
    const response = await fetch("https://api.pdf.co/v1/file/upload", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
      },
      body: formData,
    });

    const result = await response.json();

    if (result.error === false && result.url) {
      console.log("PDF uploaded successfully:", result.url);
      return result.url;
    } else {
      console.error("Upload failed:", result.message);
      return null;
    }
  } catch (err) {
    console.error("Error during upload:", err);
    return null;
  }
};

const FundApplicationForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    phoneNumber: '',
    purpose: '',
    amount: '',
    addressJson: JSON.stringify({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Bangladesh'
    }),
    bankAccountNumber: '',
    bankAccountType: 'savings',
    bankAccountBranch: ''
  });

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh'
  });

  // Separate document states
  const [nidDocument, setNidDocument] = useState(null);
  const [nationalityDocument, setNationalityDocument] = useState(null);
  const [otherDocuments, setOtherDocuments] = useState([]);
  
  const [uploading, setUploading] = useState({
    nid: false,
    nationality: false,
    other: false
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const documentTypes = [
    { 
      key: 'nid', 
      label: 'National ID Card', 
      required: true, 
      description: 'Upload a clear copy of your National ID card (both sides if applicable)',
      icon: 'fas fa-id-card',
      color: '#f44336'
    },
    { 
      key: 'nationality', 
      label: 'Nationality Proof', 
      required: true, 
      description: 'Upload your passport, birth certificate, or other nationality proof',
      icon: 'fas fa-passport',
      color: '#2196F3'
    },
    { 
      key: 'other', 
      label: 'Additional Documents', 
      required: false, 
      description: 'Upload income certificate, medical documents, or other supporting documents',
      icon: 'fas fa-folder-open',
      color: '#FF9800'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => {
      const newAddress = {
        ...prev,
        [name]: value
      };
      
      setFormData(prevForm => ({
        ...prevForm,
        addressJson: JSON.stringify(newAddress)
      }));
      
      return newAddress;
    });
  };

  const handleFileUpload = async (files, documentType) => {
    if (!files || files.length === 0) return;

    setUploading(prev => ({ ...prev, [documentType]: true }));

    try {
      if (documentType === 'nid' || documentType === 'nationality') {
        const file = files[0];
        
        if (file.type !== 'application/pdf') {
          alert(`${file.name} is not a PDF file. Please upload PDF files only.`);
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is too large. Please upload files smaller than 10MB.`);
          return;
        }

        console.log(`Uploading ${documentType} file:`, file.name);
        const uploadedUrl = await uploadPdfToPdfCo(file);
        
        if (uploadedUrl) {
          const documentData = {
            name: file.name,
            url: uploadedUrl,
            type: file.type,
            size: file.size
          };

          if (documentType === 'nid') {
            setNidDocument(documentData);
          } else if (documentType === 'nationality') {
            setNationalityDocument(documentData);
          }

          setErrors(prev => ({
            ...prev,
            [documentType]: ''
          }));
        } else {
          alert(`Failed to upload ${file.name}. Please try again.`);
        }
      } else if (documentType === 'other') {
        const newUploadedDocs = [];

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          if (file.type !== 'application/pdf') {
            alert(`${file.name} is not a PDF file. Please upload PDF files only.`);
            continue;
          }

          if (file.size > 10 * 1024 * 1024) {
            alert(`${file.name} is too large. Please upload files smaller than 10MB.`);
            continue;
          }

          console.log('Uploading other document:', file.name);
          const uploadedUrl = await uploadPdfToPdfCo(file);
          
          if (uploadedUrl) {
            newUploadedDocs.push({
              name: file.name,
              url: uploadedUrl,
              type: file.type,
              size: file.size
            });
          } else {
            alert(`Failed to upload ${file.name}. Please try again.`);
          }
        }

        setOtherDocuments(prev => [...prev, ...newUploadedDocs]);
      }

    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const removeDocument = (documentType, index = null) => {
    if (documentType === 'nid') {
      setNidDocument(null);
    } else if (documentType === 'nationality') {
      setNationalityDocument(null);
    } else if (documentType === 'other' && index !== null) {
      setOtherDocuments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.nationalId.trim()) newErrors.nationalId = 'National ID is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Valid amount is required';
    if (!address.street.trim()) newErrors.street = 'Street address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state.trim()) newErrors.state = 'State/Division is required';
    if (!formData.bankAccountNumber.trim()) newErrors.bankAccountNumber = 'Bank account number is required';
    if (!formData.bankAccountBranch.trim()) newErrors.bankAccountBranch = 'Bank branch is required';

    if (!nidDocument) newErrors.nid = 'National ID document is required';
    if (!nationalityDocument) newErrors.nationality = 'Nationality proof document is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User ID not found. Please log in again.');
      }

      const documents = [];
      if (nidDocument) documents.push(nidDocument.url);
      if (nationalityDocument) documents.push(nationalityDocument.url);
      if (otherDocuments.length > 0) {
        documents.push(...otherDocuments.map(doc => doc.url));
      }

      const applicationData = {
        ...formData,
        externalUserId: userId,
        amount: parseFloat(formData.amount),
        documents: documents,
        addressJson: formData.addressJson
      };

      console.log('Submitting application data:', applicationData);
      
      const response = await fundApplicationService.applyForFunds(applicationData);
      
      console.log('Application submitted successfully:', response);
      
      alert('Application submitted successfully! You will receive a confirmation shortly.');
      navigate('/dashboard');

    } catch (error) {
      console.error('Error submitting application:', error);
      alert(error.response?.data?.message || error.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      navigate('/apply-for-funds');
    }
  };

  const DocumentUploadSection = ({ documentInfo, document, documents, isRequired }) => {
    const fileInputRef = useRef(null);
    const isUploading = uploading[documentInfo.key];
    const hasError = errors[documentInfo.key];

    const handleUploadClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <div 
        style={{
          ...styles.documentCard,
          ...(isRequired ? styles.documentCardRequired : {})
        }}
      >
        <div style={styles.documentHeader}>
          <div 
            style={{
              ...styles.documentIcon,
              backgroundColor: documentInfo.color
            }}
          >
            <i className={documentInfo.icon}></i>
          </div>
          <div>
            <h5 className="mb-1" style={{ color: '#2E7D32' }}>
              {documentInfo.label} {isRequired && <span className="text-danger">*</span>}
            </h5>
            <p className="text-muted mb-0 small">{documentInfo.description}</p>
          </div>
        </div>

        <div
          style={styles.uploadArea}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={documentInfo.key === 'other'}
            accept=".pdf"
            onChange={(e) => handleFileUpload(e.target.files, documentInfo.key)}
            style={{ display: 'none' }}
          />
          
          {isUploading ? (
            <div>
              <div style={styles.loadingSpinner}></div>
              <p>Uploading document...</p>
            </div>
          ) : (
            <div>
              <i className={`${documentInfo.icon} fa-2x mb-2`} style={{ color: documentInfo.color }}></i>
              <p className="mb-2">
                <strong>Click to upload {documentInfo.label}</strong>
              </p>
              <p className="text-muted small">
                PDF format only (max 10MB)
                {documentInfo.key === 'other' && ' - Multiple files allowed'}
              </p>
            </div>
          )}
        </div>

        {hasError && <div style={styles.errorText}>{hasError}</div>}

        {documentInfo.key === 'other' ? (
          documents && documents.length > 0 && (
            <div className="mt-3">
              <h6>Uploaded Documents:</h6>
              {documents.map((doc, index) => (
                <div key={index} style={styles.uploadedFile}>
                  <div>
                    <i className="fas fa-file-pdf text-danger me-2"></i>
                    <span>{doc.name}</span>
                    <small className="text-muted ms-2">
                      ({(doc.size / (1024 * 1024)).toFixed(2)} MB)
                    </small>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => removeDocument(documentInfo.key, index)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          document && (
            <div className="mt-3">
              <div style={styles.uploadedFile}>
                <div>
                  <i className="fas fa-file-pdf text-danger me-2"></i>
                  <span>{document.name}</span>
                  <small className="text-muted ms-2">
                    ({(document.size / (1024 * 1024)).toFixed(2)} MB)
                  </small>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeDocument(documentInfo.key)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      <div className="container">
        {/* Header */}
        <div style={styles.headerCard}>
          <h1 className="display-4 fw-bold mb-3">Fund Application Form</h1>
          <p className="lead mb-0">
            Please fill out all required information accurately. All fields marked with * are mandatory.
          </p>
        </div>

        {/* Form */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div style={styles.formCard}>
              <form onSubmit={handleSubmit}>
                {/* Personal Information Section */}
                <div className="mb-4">
                  <h3 style={styles.sectionTitle}>
                    <i className="fas fa-user me-2"></i>
                    Personal Information
                  </h3>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="Enter your full name"
                        />
                        {errors.fullName && <div style={styles.errorText}>{errors.fullName}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>National ID *</label>
                        <input
                          type="text"
                          name="nationalId"
                          value={formData.nationalId}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="Enter your NID number"
                        />
                        {errors.nationalId && <div style={styles.errorText}>{errors.nationalId}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Phone Number *</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="+880 1XXXXXXXXX"
                        />
                        {errors.phoneNumber && <div style={styles.errorText}>{errors.phoneNumber}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="mb-4">
                  <h3 style={styles.sectionTitle}>
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Address Information
                  </h3>
                  
                  <div className="row">
                    <div className="col-md-12">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Street Address *</label>
                        <input
                          type="text"
                          name="street"
                          value={address.street}
                          onChange={handleAddressChange}
                          style={styles.input}
                          placeholder="House/Building number, Street name"
                        />
                        {errors.street && <div style={styles.errorText}>{errors.street}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={address.city}
                          onChange={handleAddressChange}
                          style={styles.input}
                          placeholder="City name"
                        />
                        {errors.city && <div style={styles.errorText}>{errors.city}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>State/Division *</label>
                        <select
                          name="state"
                          value={address.state}
                          onChange={handleAddressChange}
                          style={styles.select}
                        >
                          <option value="">Select Division</option>
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Barisal">Barisal</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rangpur">Rangpur</option>
                          <option value="Mymensingh">Mymensingh</option>
                        </select>
                        {errors.state && <div style={styles.errorText}>{errors.state}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Zip Code</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={address.zipCode}
                          onChange={handleAddressChange}
                          style={styles.input}
                          placeholder="Postal code"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fund Request Information */}
                <div className="mb-4">
                  <h3 style={styles.sectionTitle}>
                    <i className="fas fa-money-bill-wave me-2"></i>
                    Fund Request Information
                  </h3>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Amount Requested (BDT) *</label>
                        <input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="Enter amount in BDT"
                          min="1"
                          step="0.01"
                        />
                        {errors.amount && <div style={styles.errorText}>{errors.amount}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-12">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Purpose of Fund Request *</label>
                        <textarea
                          name="purpose"
                          value={formData.purpose}
                          onChange={handleInputChange}
                          style={styles.textarea}
                          placeholder="Please describe the purpose for which you are requesting funds. Be specific about how the money will be used."
                        />
                        {errors.purpose && <div style={styles.errorText}>{errors.purpose}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Information */}
                <div className="mb-4">
                  <h3 style={styles.sectionTitle}>
                    <i className="fas fa-university me-2"></i>
                    Bank Account Information
                  </h3>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Bank Account Number *</label>
                        <input
                          type="text"
                          name="bankAccountNumber"
                          value={formData.bankAccountNumber}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="Enter your bank account number"
                        />
                        {errors.bankAccountNumber && <div style={styles.errorText}>{errors.bankAccountNumber}</div>}
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Account Type *</label>
                        <select
                          name="bankAccountType"
                          value={formData.bankAccountType}
                          onChange={handleInputChange}
                          style={styles.select}
                        >
                          <option value="savings">Savings Account</option>
                          <option value="current">Current Account</option>
                          <option value="student">Student Account</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Bank Branch *</label>
                        <input
                          type="text"
                          name="bankAccountBranch"
                          value={formData.bankAccountBranch}
                          onChange={handleInputChange}
                          style={styles.input}
                          placeholder="Bank branch name"
                        />
                        {errors.bankAccountBranch && <div style={styles.errorText}>{errors.bankAccountBranch}</div>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Upload Section */}
                <div className="mb-4">
                  <h3 style={styles.sectionTitle}>
                    <i className="fas fa-file-upload me-2"></i>
                    Required Documents
                  </h3>
                  
                  <div className="mb-4">
                    <div className="alert alert-info" role="alert">
                      <i className="fas fa-info-circle me-2"></i>
                      <strong>Document Upload Instructions:</strong>
                      <ul className="mb-0 mt-2">
                        <li>All documents must be in PDF format</li>
                        <li>Maximum file size: 10MB per document</li>
                        <li>National ID and Nationality proof are mandatory</li>
                        <li>Additional documents are optional but may strengthen your application</li>
                      </ul>
                    </div>
                  </div>

                  {/* Document Upload Sections */}
                  {documentTypes.map(docType => (
                    <DocumentUploadSection 
                      key={docType.key}
                      documentInfo={docType}
                      document={docType.key === 'nid' ? nidDocument : docType.key === 'nationality' ? nationalityDocument : null}
                      documents={docType.key === 'other' ? otherDocuments : null}
                      isRequired={docType.required}
                    />
                  ))}
                </div>

                {/* Form Actions */}
                <div className="row mt-5">
                  <div className="col-md-6">
                    <button
                      type="button"
                      style={styles.cancelButton}
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="submit"
                      style={styles.submitButton}
                      disabled={submitting || Object.values(uploading).some(Boolean)}
                    >
                      {submitting ? (
                        <>
                          <div style={styles.loadingSpinner}></div>
                          Submitting Application...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Submit Application
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default FundApplicationForm;