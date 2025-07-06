import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';
import AnimatedNumber from '../components/AnimatedNumber'; // Adjust path if your components folder is elsewhere

// Custom Hook to detect when an element is in view
const useInView = (options) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return [ref, isInView];
};


const HomePage = () => {
  const heroImages = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Agriculture_in_Rural_Bangladesh.jpg/2560px-Agriculture_in_Rural_Bangladesh.jpg',
    'https://tds-images.thedailystar.net/sites/default/files/styles/very_big_201/public/images/2023/03/22/char_1.jpg',
    'https://cdn.pixabay.com/photo/2021/02/12/16/08/children-6008967_1280.jpg',
    'https://s.france24.com/media/display/cb41bca0-6201-11ef-9d3e-005056bf30b7/w:1280/p:16x9/5db8797c814b2f749a6d17aa7a5dc022e7f7be13.jpg',
    'https://im.indiatimes.in/amp/2019/Jul/trees_1562664811.jpg?w=1200&h=900&cc=1&webp=1&q=75'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [statsSectionRef, isStatsSectionVisible] = useInView({ threshold: 0.1 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % heroImages.length
      );
    }, 2000);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          {heroImages.map((src, index) => (
            <img
              key={src}
              src={src}
              alt="Hope Harvest initiative background"
              className={`${styles.backgroundImage} ${index === currentImageIndex ? styles.visible : ''}`}
            />
          ))}
        </div>
        <div className={`container ${styles.heroContent}`}>
          <div className="row">
            <div className="col-lg-7 text-center text-lg-start">
              <h1 className={styles.heroTitle}>Hope Harvest</h1>
              <h2 className={styles.heroSubtitle}>Sowing Seeds of Change, Reaping a Brighter Future.</h2>
              <p className={styles.heroText}>
                We empower communities across Bangladesh through sustainable microfinance, education, and direct relief, creating lasting, positive change from the ground up.
              </p>
              <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                <Link to="/donate" className={`btn ${styles.ctaButtonPrimary}`}>
                  <i className="fas fa-hand-holding-heart me-2"></i>
                  Donate Now
                </Link>
                <Link to="/campaigns" className={`btn ${styles.ctaButtonSecondary}`}>
                  View Campaigns
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section ref={statsSectionRef} className={styles.statsSection}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className={styles.statCard}>
                <i className={`fas fa-users ${styles.statIcon}`}></i>
                <h3 className={styles.statNumber}>
                  {isStatsSectionVisible ? <AnimatedNumber target="10,000+" /> : '0+'}
                </h3>
                <p className={styles.statLabel}>Lives Impacted</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={styles.statCard}>
                <i className={`fas fa-bullhorn ${styles.statIcon}`}></i>
                <h3 className={styles.statNumber}>
                  {isStatsSectionVisible ? <AnimatedNumber target="150+" /> : '0+'}
                </h3>
                <p className={styles.statLabel}>Active Campaigns</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={styles.statCard}>
                <i className={`fas fa-hand-holding-heart ${styles.statIcon}`}></i>
                <h3 className={styles.statNumber}>
                   {isStatsSectionVisible ? <AnimatedNumber target="5,000,000+" /> : '0+'}
                </h3>
                <p className={styles.statLabel}>Taka Raised</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className={styles.statCard}>
                <i className={`fas fa-hands-helping ${styles.statIcon}`}></i>
                <h3 className={styles.statNumber}>
                  {isStatsSectionVisible ? <AnimatedNumber target="500+" /> : '0+'}
                </h3>
                <p className={styles.statLabel}>Volunteers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className={styles.sectionTitle}>How We Make a Difference</h2>
            <p className={styles.sectionSubtitle}>Our comprehensive approach to community development</p>
          </div>
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className={`card h-100 ${styles.featureCard}`}>
                <div className="card-body p-4">
                  <i className={`fas fa-seedling ${styles.featureIcon}`}></i>
                  <h4 className={styles.featureTitle}>Self-Reliance Programs</h4>
                  <p className={styles.featureText}>
                    Microfinance, skills development, and entrepreneurship training to build sustainable livelihoods.
                  </p>
                  <Link to="/campaigns" className={styles.featureLink}>
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className={`card h-100 ${styles.featureCard}`}>
                <div className="card-body p-4">
                  <i className={`fas fa-hands-helping ${styles.featureIcon}`}></i>
                  <h4 className={styles.featureTitle}>Emergency Relief</h4>
                  <p className={styles.featureText}>
                    Rapid response to natural disasters, food security, and essential support for vulnerable communities.
                  </p>
                  <Link to="/campaigns" className={styles.featureLink}>
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <div className={`card h-100 ${styles.featureCard}`}>
                <div className="card-body p-4">
                  <i className={`fas fa-graduation-cap ${styles.featureIcon}`}></i>
                  <h4 className={styles.featureTitle}>Education & Training</h4>
                  <p className={styles.featureText}>
                    Comprehensive education programs, vocational training, and digital literacy initiatives.
                  </p>
                  <Link to="/campaigns" className={styles.featureLink}>
                    Learn More &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className={styles.finalCtaSection}>
        <div className="container text-center">
          <h2 className={styles.finalCtaTitle}>Ready to Make a Difference?</h2>
          <p className="lead mb-4">
            Join thousands of donors and volunteers who are building a better future for Bangladesh.
          </p>
          <div className={styles.finalCtaButtons}>
            <Link to="/donate" className={styles.ctaFinalPrimary}>
              <i className="fas fa-heart me-2"></i>
              Start Donating
            </Link>
            <Link to="/volunteer-activity" className={styles.ctaFinalSecondary}>
              <i className="fas fa-hands-helping me-2"></i>
              Become a Volunteer
            </Link>
            <Link to="/request-campaign" className={styles.ctaFinalSecondary}>
              <i className="fas fa-plus-circle me-2"></i>
              Request a New Campaign
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

