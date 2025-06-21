import { useState } from 'react';
import './volunteerActivity.css';

// Enhanced theme styles with green and white combination - innovative layout
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
  },
  stepCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '2rem',
    margin: '1rem 0',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    border: '3px solid transparent',
    transition: 'all 0.4s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  activeStepCard: {
    borderColor: '#4CAF50',
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 60px rgba(76, 175, 80, 0.3)'
  },
  stepNumber: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 auto 1rem',
    position: 'relative',
    zIndex: 2
  },
  stepTitle: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  stepContent: {
    color: '#333',
    lineHeight: '1.7',
    fontSize: '1rem'
  },
  navigationDots: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '3rem'
  },
  dot: {
    width: '15px',
    height: '15px',
    borderRadius: '50%',
    background: '#e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  activeDot: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    transform: 'scale(1.3)'
  },
  joinButton: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    border: 'none',
    borderRadius: '50px',
    padding: '20px 50px',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.3rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 30px rgba(76, 175, 80, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },
  progressBar: {
    width: '100%',
    height: '6px',
    background: '#e0e0e0',
    borderRadius: '3px',
    marginBottom: '2rem',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4CAF50, #81c784)',
    borderRadius: '3px',
    transition: 'width 0.5s ease'
  },
  cardIcon: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '2rem',
    color: '#e8f5e9',
    transition: 'all 0.3s ease'
  },
  activeCardIcon: {
    color: '#4CAF50',
    transform: 'scale(1.2)'
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
  }
};

const VolunteerActivityLayout = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'aim',
      title: 'Aim',
      icon: 'fas fa-bullseye',
      content: [
        "The volunteer program at Hope Harvest aims to create a network of dedicated individuals who contribute their time, skills, and passion to make a tangible difference in communities across Bangladesh. We believe in the power of collective action and that every person has something valuable to offer in service to others. Our goal is to harness this potential by providing structured opportunities for meaningful engagement.",
        "We strive to build a diverse volunteer base that represents all segments of society, including students, professionals, retirees, and homemakers. By bringing together people from different backgrounds, we create a rich pool of skills, perspectives, and experiences that enhance our ability to address complex community challenges. Our volunteer program is designed to be inclusive, welcoming anyone with a sincere desire to help regardless of their previous experience.",
        "Beyond the immediate impact on beneficiaries, we aim to foster a culture of volunteerism and civic responsibility in Bangladesh. Through volunteering with Hope Harvest, participants develop empathy, leadership skills, and a deeper understanding of social issues. Many volunteers report that their experiences transform their worldview and inspire continued community involvement throughout their lives.",
        "The program also serves as a bridge between different communities, creating connections between those who serve and those who are served. These relationships help break down stereotypes, build mutual respect, and create a stronger sense of shared humanity. Ultimately, we envision a society where volunteerism is a natural and valued part of citizenship, contributing to social cohesion and collective wellbeing."
      ]
    },
    {
      id: 'activity',
      title: 'Activity',
      icon: 'fas fa-hands-helping',
      content: [
        "Volunteers at Hope Harvest engage in a wide range of activities across our various program areas. In our disaster relief initiatives, volunteers assist with packing and distributing emergency supplies, setting up temporary shelters, conducting needs assessments, and providing emotional support to affected families. During non-emergency periods, they help with disaster preparedness training in vulnerable communities and inventory management of emergency stockpiles.",
        "Educational support is another key area where volunteers make a significant contribution. They serve as tutors for underprivileged students, conduct educational workshops, assist in our digital literacy programs, and help organize and staff mobile libraries. Many volunteers with teaching backgrounds also contribute to our teacher training initiatives, sharing their expertise to improve educational quality in rural schools.",
        "Our healthcare programs rely heavily on volunteer support, particularly from those with medical backgrounds. Medical professionals volunteer in our mobile health clinics, health camps, and specialist consultation events. Non-medical volunteers assist with patient registration, crowd management, health education sessions, and follow-up activities. During vaccination drives and health awareness campaigns, volunteers are essential for reaching remote communities.",
        "Environmental initiatives provide opportunities for volunteers to participate in tree planting, coastal cleanup events, community garden development, and environmental education in schools. Many volunteers also contribute their skills in administration, marketing, fundraising, photography, and technology support at our head office. These behind-the-scenes roles are crucial for maintaining our operations and expanding our reach."
      ]
    },
    {
      id: 'requirements',
      title: 'Requirements',
      icon: 'fas fa-clipboard-check',
      content: [
        "Hope Harvest welcomes volunteers from all walks of life, with the primary requirement being a genuine commitment to our mission and values. Prospective volunteers must be at least 18 years of age to participate independently, though we do offer supervised opportunities for younger individuals through our youth volunteer program. All volunteers must complete our registration process, which includes providing basic personal information, emergency contacts, and areas of interest.",
        "Depending on the nature of the volunteer work, specific requirements may apply. For roles involving work with vulnerable populations such as children, the elderly, or individuals with disabilities, we conduct background checks to ensure safety. Medical volunteers must provide verification of their qualifications and licenses. For disaster response teams, physical fitness and ability to work in challenging conditions may be necessary.",
        "Time commitment varies based on the role and project. Some opportunities require regular weekly commitment, while others are one-time or event-based. We ask volunteers to be realistic about their availability and to honor their commitments once made, as our beneficiaries and teams rely on their presence. All new volunteers participate in an orientation session that covers our organization's history, mission, policies, and procedures.",
        "While specific skills are valuable for certain roles, many volunteer positions require no specialized knowledge. We believe in learning through service and provide necessary training for volunteers in their assigned areas. The most important qualities we look for are reliability, empathy, respect for diversity, willingness to learn, and ability to work as part of a team. We encourage volunteers to bring their unique talents, creativity, and enthusiasm to their service with us."
      ]
    },
    {
      id: 'achievements',
      title: 'Achievements',
      icon: 'fas fa-trophy',
      content: [
        "Hope Harvest volunteers have been the driving force behind transformative change in communities across Bangladesh. Since our founding, volunteers have contributed over 150,000 hours of service, touching the lives of more than 100,000 individuals through various programs. During natural disasters, our volunteer teams have consistently been among the first responders, often reaching remote areas before larger aid organizations and providing critical immediate relief to thousands of affected families.",
        "In education, volunteer tutors have helped improve academic outcomes for over 5,000 underprivileged students, with many pupils showing significant improvement in key subjects. Some students mentored by our volunteers have gone on to become the first in their families to attend university. Our volunteer-led digital literacy programs have equipped over 3,000 people with essential computer skills, opening new employment opportunities and connecting them to the digital world.",
        "Volunteer medical professionals have been instrumental in extending healthcare to underserved communities, providing consultations to over 35,000 patients who would otherwise lack access to quality care. Their early detection and intervention have saved countless lives, particularly in cases of preventable or treatable conditions. Through health education sessions, volunteers have raised awareness about hygiene, nutrition, and disease prevention, leading to measurable improvements in community health practices.",
        "Perhaps most importantly, our volunteers have become ambassadors for positive change in their own communities. Many have initiated their own local projects, organized neighborhood cleanups, started tutoring groups, and continued advocacy for social issues long after their formal volunteer commitments ended. This multiplier effect demonstrates that the true impact of our volunteer program extends far beyond the direct services provided, creating a lasting culture of civic engagement and social responsibility."
      ]
    }
  ];

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
      e.currentTarget.style.boxShadow = '0 15px 50px rgba(76, 175, 80, 0.2)';
    } else if (e.currentTarget !== document.querySelector('.active-card')) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = 'translateY(-3px) scale(1.05)';
      e.target.style.boxShadow = '0 12px 40px rgba(76, 175, 80, 0.6)';
    } else {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.boxShadow = '0 8px 30px rgba(76, 175, 80, 0.4)';
    }  };

  return (
    <div style={styles.mainContainer}>
      <div className="container">
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <i className="fas fa-users" style={styles.heroPattern}></i>
          <h1 className="display-3 fw-bold mb-4">Volunteer with Hope Harvest</h1>
          <p className="lead mb-4" style={{ fontSize: '1.3rem' }}>
            Join our dedicated community of volunteers making a real difference across Bangladesh
          </p>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3>150K+</h3>
              <p className="mb-0">Hours Served</p>
            </div>
            <div style={styles.statCard}>
              <h3>100K+</h3>
              <p className="mb-0">Lives Touched</p>
            </div>
            <div style={styles.statCard}>
              <h3>5K+</h3>
              <p className="mb-0">Students Helped</p>
            </div>
            <div style={styles.statCard}>
              <h3>35K+</h3>
              <p className="mb-0">Patients Served</p>
            </div>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="row mb-4">
          <div className="col-12">
            <h4 className="text-center mb-4" style={{ color: '#2E7D32', fontWeight: '700' }}>
              Explore Volunteer Journey
            </h4>
          </div>
          {steps.map((step, index) => (
            <div key={step.id} className="col-md-6 col-lg-3 mb-3">
              <div
                style={{
                  background: index === activeStep ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'white',
                  color: index === activeStep ? 'white' : '#333',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                  border: index === activeStep ? 'none' : '2px solid #e8f5e9',
                  textAlign: 'center'
                }}
                onClick={() => handleStepClick(index)}
                onMouseEnter={(e) => {
                  if (index !== activeStep) {
                    e.currentTarget.style.backgroundColor = '#e8f5e9';
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== activeStep) {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <i className={step.icon} style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                <h6 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{step.title}</h6>
                <small>Step {index + 1}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${((activeStep + 1) / steps.length) * 100}%`
            }}
          ></div>
        </div>

        {/* Navigation Dots */}
        <div style={styles.navigationDots}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                ...styles.dot,
                ...(index === activeStep ? styles.activeDot : {})
              }}
              onClick={() => handleStepClick(index)}
            />
          ))}
        </div>

        {/* Step Cards - Innovative Layout */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div
              style={{
                ...styles.stepCard,
                ...(activeStep >= 0 ? styles.activeStepCard : {})
              }}
              className="active-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <i className={steps[activeStep]?.icon} style={{
                ...styles.cardIcon,
                ...(activeStep >= 0 ? styles.activeCardIcon : {})
              }}></i>
              <div style={styles.stepNumber}>
                {activeStep + 1}
              </div>
              <h3 style={styles.stepTitle}>{steps[activeStep]?.title}</h3>
              <div style={styles.stepContent}>
                {steps[activeStep]?.content.map((paragraph, index) => (
                  <p key={index} className="mb-3" style={{ textAlign: 'justify' }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Join Button */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <button
              style={styles.joinButton}
              onMouseEnter={(e) => handleButtonHover(e, true)}
              onMouseLeave={(e) => handleButtonHover(e, false)}
            >
              <i className="fas fa-hands-helping me-2"></i>
              Join as Volunteer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerActivityLayout;