import { useCallback, useEffect, useState } from 'react';
import './gallery.css';

// Innovative masonry gallery styles
const styles = {
  mainContainer: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    borderRadius: '25px',
    padding: '4rem 2rem',
    color: 'white',
    marginBottom: '3rem',
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center'
  },
  heroPattern: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    opacity: 0.1,
    fontSize: '20rem',
    transform: 'rotate(-15deg)'
  },  masonryContainer: {
    columnCount: 4,
    columnGap: '20px',
    padding: '20px',
    width: '100%'
  },
  imageCard: {
    borderRadius: '15px',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    marginBottom: '20px',
    breakInside: 'avoid',
    display: 'inline-block',
    width: '100%',
    backgroundColor: 'white'
  },
  smallCard: {
    height: 'auto'
  },
  mediumCard: {
    height: 'auto'
  },
  largeCard: {
    height: 'auto'
  },
  extraLargeCard: {
    height: 'auto'
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.8) 0%, rgba(46, 125, 50, 0.9) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'all 0.4s ease',
    backdropFilter: 'blur(2px)'
  },
  overlayText: {
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: '600',
    textAlign: 'center',
    padding: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },  galleryImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
    transition: 'transform 0.4s ease'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
    flexDirection: 'column'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e8f5e9',
    borderTop: '5px solid #4CAF50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '3rem',
    color: '#dc3545'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  statCard: {
    background: 'linear-gradient(135deg, #66BB6A 0%, #43A047 100%)',
    color: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  filterButton: {
    padding: '0.8rem 1.5rem',
    border: '2px solid #4CAF50',
    borderRadius: '25px',
    background: 'white',
    color: '#4CAF50',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600'
  },
  activeFilter: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white'
  }
};

const GalleryComponent = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/campaigns/images');
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const data = await response.json();
        if (data.status === 'success' && data.data) {
        // Random heights for more aesthetic Pinterest-style layout
        const heights = [250, 300, 350, 400, 450];
        // Add random heights to each image for masonry effect
        const imagesWithSizes = data.data.map((image, index) => ({
          ...image,
          id: index + 1,
          height: heights[Math.floor(Math.random() * heights.length)]
        }));
        setImages(imagesWithSizes);
      } else {
        throw new Error(data.message || 'Failed to load images');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);  const getCardStyle = (height) => {
    return {
      ...styles.imageCard,
      height: `${height}px`
    };
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };  const handleImageHover = (e, isHover) => {
    const overlay = e.currentTarget.querySelector('.image-overlay');
    const image = e.currentTarget.querySelector('img');
    
    if (isHover) {
      overlay.style.opacity = '1';
      image.style.transform = 'scale(1.05)';
      e.currentTarget.style.transform = 'translateY(-8px)';
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(76, 175, 80, 0.3)';
    } else {
      overlay.style.opacity = '0';
      image.style.transform = 'scale(1)';
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    }
  };

  if (loading) {
    return (
      <div style={styles.mainContainer}>
        <div className="container">
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <h4 style={{ color: '#4CAF50', marginTop: '1rem' }}>Loading Gallery...</h4>
            <p style={{ color: '#666' }}>Fetching beautiful moments from our campaigns</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.mainContainer}>
        <div className="container">
          <div style={styles.errorContainer}>
            <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
            <h4>Unable to Load Gallery</h4>
            <p>{error}</p>
            <button 
              className="btn btn-success"
              onClick={fetchImages}
              style={{ 
                background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 30px'
              }}
            >
              <i className="fas fa-refresh me-2"></i>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.mainContainer}>
      <div className="container">
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <i className="fas fa-camera" style={styles.heroPattern}></i>
          <h1 className="display-3 fw-bold mb-4">Hope Harvest Gallery</h1>
          <p className="lead mb-4" style={{ fontSize: '1.3rem' }}>
            Witness the impact of our work through these captured moments of hope and transformation
          </p>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3>{images.length}+</h3>
              <p className="mb-0">Moments Captured</p>
            </div>
            <div style={styles.statCard}>
              <h3>50+</h3>
              <p className="mb-0">Campaigns</p>
            </div>
            <div style={styles.statCard}>
              <h3>100K+</h3>
              <p className="mb-0">Lives Touched</p>
            </div>
            <div style={styles.statCard}>
              <h3>∞</h3>
              <p className="mb-0">Hope Spread</p>
            </div>
          </div>
        </div>        {/* Aesthetic Masonry Gallery */}
        {images.length > 0 ? (
          <div style={styles.masonryContainer}>
            {images.map((image) => (
              <div
                key={image.id}
                style={getCardStyle(image.height)}
                onClick={() => handleImageClick(image)}
                onMouseEnter={(e) => handleImageHover(e, true)}
                onMouseLeave={(e) => handleImageHover(e, false)}
              >
                <img
                  src={image.imageUrl}
                  alt={image.imageAltText}
                  style={{...styles.galleryImage, height: `${image.height}px`, objectFit: 'cover'}}
                  loading="lazy"
                />
                <div className="image-overlay" style={styles.imageOverlay}>
                  <div style={styles.overlayText}>
                    <i className="fas fa-search-plus fa-2x mb-2"></i>
                    <p className="mb-0">{image.imageAltText}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.errorContainer}>
            <i className="fas fa-images fa-3x mb-3" style={{ color: '#4CAF50' }}></i>
            <h4 style={{ color: '#4CAF50' }}>No Images Available</h4>
            <p style={{ color: '#666' }}>Gallery images will appear here once campaigns are added.</p>
          </div>
        )}

        {/* Modal for enlarged image view */}
        {selectedImage && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '2rem'
            }}
            onClick={closeModal}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '90vh',
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.imageAltText}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(46, 125, 50, 0.9) 100%)',
                color: 'white',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <h5 className="mb-0">{selectedImage.imageAltText}</h5>
              </div>
              <button
                onClick={closeModal}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>      {/* CSS Animation for loading spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .masonry-container {
            column-count: 4;
            column-gap: 20px;
            padding: 20px;
          }
          
          @media (max-width: 1200px) {
            .masonry-container {
              column-count: 3;
              column-gap: 15px;
              padding: 15px;
            }
          }
          
          @media (max-width: 768px) {
            .masonry-container {
              column-count: 2;
              column-gap: 10px;
              padding: 10px;
            }
          }
          
          @media (max-width: 480px) {
            .masonry-container {
              column-count: 1;
              column-gap: 0;
              padding: 10px;
            }
          }
          
          .image-card:hover {
            z-index: 2;
          }
        `}
      </style>
    </div>
  );
};

export default GalleryComponent;