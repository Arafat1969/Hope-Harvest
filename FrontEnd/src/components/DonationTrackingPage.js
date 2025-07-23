import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/donationService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const styles = {
  container: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  cardHeader: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    padding: '1.5rem',
    textAlign: 'center'
  },
  searchButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    transition: 'all 0.3s ease'
  },
  detailsCard: {
    background: '#f8f9fa',
    borderRadius: '10px',
    padding: '1.5rem',
    marginTop: '1.5rem'
  },
  receiptContainer: {
    background: 'white',
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    color: '#333'
  },
  receiptHeader: {
    textAlign: 'center',
    marginBottom: '30px',
    borderBottom: '3px solid #4CAF50',
    paddingBottom: '20px'
  },
  receiptTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#4CAF50',
    margin: '0 0 10px 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
  receiptSubtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0'
  },
  receiptDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '30px'
  },
  receiptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #eee'
  },
  receiptLabel: {
    fontWeight: 'bold',
    color: '#555'
  },
  receiptValue: {
    color: '#333'
  },
  receiptAmount: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '10px',
    margin: '20px 0'
  },
  receiptFooter: {
    textAlign: 'center',
    marginTop: '40px',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '10px'
  }
};

const DonationTrackingPage = () => {
  const [trackingKey, setTrackingKey] = useState('');
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trackingKey.trim()) {
      setError('Please enter a tracking key');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await donationService.getAnonymousDonation(trackingKey);
      console.log('Donation found:', result);
      setDonation(result);
      setError('');
    } catch (err) {
      console.error('Error fetching donation:', err);
      setError('Donation not found. Please check the tracking key and try again.');
      setDonation(null);
    } finally {
      setLoading(false);
    }
  };

  // Format date and currency functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  const generatePDFReceipt = async () => {
    if (!donation) return;
    
    setDownloadingPDF(true);
    
    try {
      // Create a temporary container for the receipt
      const receiptElement = document.createElement('div');
      receiptElement.style.position = 'absolute';
      receiptElement.style.left = '-9999px';
      receiptElement.style.top = '-9999px';
      receiptElement.style.width = '800px';
      receiptElement.style.background = 'white';
      
      // Generate the receipt HTML
      receiptElement.innerHTML = `
        <div style="background: white; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #4CAF50; padding-bottom: 20px;">
            <div style="font-size: 32px; font-weight: bold; color: #4CAF50; margin: 0 0 10px 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
              🌱 Hope Harvest
            </div>
            <div style="font-size: 18px; color: #666; margin: 0;">
              Donation Receipt
            </div>
            <div style="font-size: 14px; color: #888; margin-top: 5px;">
              Thank you for making a difference!
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: bold; color: #4CAF50; text-align: center; padding: 20px; background: #f8f9fa; border-radius: 10px; margin: 20px 0;">
              Total Donation: ${formatCurrency(donation.data.amount)}
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Campaign:</span>
                <span style="color: #333;">${donation.data.campaignTitle}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Date:</span>
                <span style="color: #333;">${formatDate(donation.data.donationDate)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Payment Method:</span>
                <span style="color: #333;">${donation.data.paymentMethod}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Organization:</span>
                <span style="color: #333;">${donation.data.organizationName}</span>
              </div>
            </div>
            <div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Transaction ID:</span>
                <span style="color: #333;">${donation.data.transactionId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Donation ID:</span>
                <span style="color: #333;">${donation.data.donationId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Tracking Key:</span>
                <span style="color: #333;">${donation.data.trackingKey}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #555;">Receipt Date:</span>
                <span style="color: #333;">${new Date().toLocaleDateString('en-BD')}</span>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 10px;">
            <p style="margin: 0 0 10px 0; font-size: 16px; color: #4CAF50; font-weight: bold;">
              Your generosity makes our mission possible!
            </p>
            <p style="margin: 0; font-size: 14px; color: #666;">
              This receipt serves as proof of your donation. Please keep it for your records.
            </p>
            <div style="margin-top: 20px; font-size: 12px; color: #888;">
              <p style="margin: 5px 0;">Hope Harvest Foundation</p>
              <p style="margin: 5px 0;">Dhaka, Bangladesh</p>
              <p style="margin: 5px 0;">Email: info@hopeharvest.bd | Phone: +880 1700-000000</p>
            </div>
          </div>
        </div>
      `;
      
      // Append to document
      document.body.appendChild(receiptElement);
      
      // Generate canvas from HTML
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary element
      document.body.removeChild(receiptElement);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF
      const fileName = `Hope_Harvest_Receipt_${donation.data.trackingKey}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 className="mb-1">
                  <i className="fas fa-search-dollar me-2"></i>
                  Track Your Donation
                </h2>
                <p className="mb-0">Enter your tracking key to view donation details</p>
              </div>
              
              <div className="card-body p-4">
                <form onSubmit={handleSearch}>
                  <div className="mb-4">
                    <label htmlFor="trackingKey" className="form-label fw-bold">Tracking Key</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="fas fa-key text-success"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="trackingKey"
                        placeholder="Enter tracking key (e.g. TRK-1234abcd)"
                        value={trackingKey}
                        onChange={(e) => setTrackingKey(e.target.value)}
                        required
                      />
                      <button 
                        className="btn btn-success btn-lg"
                        type="submit"
                        disabled={loading}
                        style={styles.searchButton}
                      >
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2"></span>Searching...</>
                        ) : (
                          <><i className="fas fa-search me-2"></i>Track</>
                        )}
                      </button>
                    </div>
                    <small className="text-muted mt-2 d-block">
                      <i className="fas fa-info-circle me-1"></i>
                      The tracking key was provided in your donation confirmation email or receipt
                    </small>
                  </div>
                </form>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                {donation && (
                  <div className="mt-4 animate__animated animate__fadeIn">
                    <div className="text-center mb-4">
                      <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                        <i className="fas fa-check fa-3x"></i>
                      </div>
                      <h4 className="text-success mt-3 mb-1">Donation Found!</h4>
                      <p className="text-muted">Thank you for your generosity</p>
                    </div>
                    
                    <div style={styles.detailsCard}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0 text-success">
                          <i className="fas fa-receipt me-2"></i>
                          Donation Details
                        </h5>
                        <button 
                          className="btn btn-outline-success"
                          onClick={generatePDFReceipt}
                          disabled={downloadingPDF}
                        >
                          {downloadingPDF ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              Generating...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-download me-2"></i>
                              Download Receipt
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <strong>Campaign:</strong>
                          <p className="text-muted mb-0">{donation.data.campaignTitle}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Amount:</strong>
                          <p className="text-success fw-bold mb-0">{formatCurrency(donation.data.amount)}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Date:</strong>
                          <p className="text-muted mb-0">{formatDate(donation.data.donationDate)}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Payment Method:</strong>
                          <p className="text-muted mb-0">{donation.data.paymentMethod}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Organization:</strong>
                          <p className="text-muted mb-0">{donation.data.organizationName}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Transaction ID:</strong>
                          <p className="text-muted mb-0">{donation.data.transactionId}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Donation ID:</strong>
                          <p className="text-muted mb-0">{donation.data.donationId}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                          <strong>Tracking Key:</strong>
                          <p className="text-muted mb-0">{donation.data.trackingKey}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-center">
                      <p className="text-muted mb-4">
                        Thank you for your contribution. Your generosity makes our work possible!
                      </p>
                      
                      <div className="d-flex justify-content-center flex-wrap gap-3">
                        <button 
                          className="btn btn-outline-secondary btn-lg"
                          onClick={() => navigate('/')}
                        >
                          <i className="fas fa-home me-2"></i>
                          Back to Home
                        </button>
                        <button 
                          className="btn btn-success btn-lg"
                          onClick={() => navigate('/campaigns')}
                        >
                          <i className="fas fa-hand-holding-heart me-2"></i>
                          Donate Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {!donation && !error && (
                  <div className="text-center py-4">
                    <img 
                      src="/assets/donation-search.svg" 
                      alt="Track Donation" 
                      style={{ maxWidth: '200px', opacity: 0.7 }}
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <p className="text-muted mt-3">
                      Enter your tracking key to view your donation information
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-muted">
                <i className="fas fa-question-circle me-2"></i>
                Can't find your tracking key? <a href="/contact" className="text-success">Contact support</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationTrackingPage;