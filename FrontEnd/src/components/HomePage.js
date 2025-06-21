import { Link } from 'react-router-dom';

const styles = {
  heroSection: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    color: 'white',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center'
  },
  featureCard: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    border: 'none'
  },
  ctaButton: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
    borderRadius: '2rem',
    padding: '12px 30px',
    fontWeight: '600'
  },
  statCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '0.75rem',
    padding: '2rem',
    textAlign: 'center'
  }
};

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Hope Harvest
              </h1>
              <h2 className="h3 mb-4">
                Building Sustainable Communities Through Compassion
              </h2>
              <p className="lead mb-4">
                Join us in creating lasting change through microfinance, relief distribution, 
                education, and community development programs across Bangladesh.
              </p>
              <div className="d-flex gap-3">
                <Link to="/campaigns">
                  <button className="btn btn-light btn-lg" style={styles.ctaButton}>
                    <i className="fas fa-heart me-2"></i>
                    View Campaigns
                  </button>
                </Link>
                <Link to="/donate">
                  <button className="btn btn-outline-light btn-lg">
                    <i className="fas fa-hand-holding-heart me-2"></i>
                    Donate Now
                  </button>
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="p-4">
                <i className="fas fa-seedling fa-5x mb-3" style={{ opacity: 0.8 }}></i>
                <h4>Growing Hope Together</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div style={styles.statCard}>
                <i className="fas fa-users fa-3x text-success mb-3"></i>
                <h3 className="text-success">10,000+</h3>
                <p className="text-muted">Lives Impacted</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div style={styles.statCard}>
                <i className="fas fa-bullhorn fa-3x text-success mb-3"></i>
                <h3 className="text-success">150+</h3>
                <p className="text-muted">Active Campaigns</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div style={styles.statCard}>
                <i className="fas fa-hand-holding-heart fa-3x text-success mb-3"></i>
                <h3 className="text-success">৳5M+</h3>
                <p className="text-muted">Funds Raised</p>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div style={styles.statCard}>
                <i className="fas fa-hands-helping fa-3x text-success mb-3"></i>
                <h3 className="text-success">500+</h3>
                <p className="text-muted">Volunteers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 text-success fw-bold">How We Make a Difference</h2>
            <p className="lead text-muted">Our comprehensive approach to community development</p>
          </div>
          
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div 
                className="card h-100" 
                style={styles.featureCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-seedling fa-3x text-success mb-3"></i>
                  <h4 className="text-success">Self-Reliance Programs</h4>
                  <p className="text-muted">
                    Microfinance, skills development, and entrepreneurship training 
                    to build sustainable livelihoods.
                  </p>
                  <Link to="/campaigns" className="btn btn-outline-success">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div 
                className="card h-100" 
                style={styles.featureCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-hands-helping fa-3x text-success mb-3"></i>
                  <h4 className="text-success">Emergency Relief</h4>
                  <p className="text-muted">
                    Rapid response to natural disasters, food security, 
                    and essential support for vulnerable communities.
                  </p>
                  <Link to="/campaigns" className="btn btn-outline-success">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-4 mb-4">
              <div 
                className="card h-100" 
                style={styles.featureCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
              >
                <div className="card-body text-center p-4">
                  <i className="fas fa-graduation-cap fa-3x text-success mb-3"></i>
                  <h4 className="text-success">Education & Training</h4>
                  <p className="text-muted">
                    Comprehensive education programs, vocational training, 
                    and digital literacy initiatives.
                  </p>
                  <Link to="/campaigns" className="btn btn-outline-success">
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-success text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">Ready to Make a Difference?</h2>
          <p className="lead mb-4">
            Join thousands of donors and volunteers who are building a better future for Bangladesh
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/donate">
              <button className="btn btn-light btn-lg">
                <i className="fas fa-heart me-2"></i>
                Start Donating
              </button>
            </Link>
            <Link to="/volunteer-activity">
              <button className="btn btn-outline-light btn-lg">
                <i className="fas fa-hands-helping me-2"></i>
                Become a Volunteer
              </button>
            </Link>
            <Link to="/apply-for-funds">
              <button className="btn btn-outline-light btn-lg">
                <i className="fas fa-bullhorn me-2"></i>
                Start a Campaign
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
