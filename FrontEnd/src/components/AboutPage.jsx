import { useState } from 'react';
import './sidebarContent.css';

const styles = {
  mainContainer: {
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)',
    minHeight: '100vh',
    paddingTop: '2rem',
    paddingBottom: '2rem'
  },
  heroSection: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
    borderRadius: '20px',
    padding: '3rem 2rem',
    color: 'white',
    marginBottom: '3rem',
    position: 'relative',
    overflow: 'hidden'
  },
  heroPattern: {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    opacity: 0.1,
    fontSize: '15rem',
    transform: 'rotate(-15deg)'
  },  sidebarContainer: {
    background: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    minHeight: '700px',
    width: '100%'
  },
  sidebarTitle: {
    color: '#2E7D32',
    fontWeight: '700',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontSize: '1.3rem'
  },
  sidebarItem: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: 'none',
    borderRadius: '10px',
    margin: '0.3rem 0',
    padding: '1rem 1.2rem',
    fontSize: '1rem',
    fontWeight: '500',
    position: 'relative',
    overflow: 'hidden'
  },
  activeItem: {
    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
    color: 'white',
    transform: 'translateX(8px)',
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
  },
  inactiveItem: {
    backgroundColor: '#f8f9fa',
    color: '#495057',
    border: '1px solid #e9ecef'
  },  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    padding: '2.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid rgba(76, 175, 80, 0.1)',
    minHeight: '700px',
    width: '100%'
  },
  contentTitle: {
    color: '#2E7D32',
    fontWeight: '700',
    fontSize: '2rem',
    marginBottom: '1rem',
    textAlign: 'center',
    position: 'relative'
  },
  contentTitleUnderline: {
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #4CAF50, #81c784)',
    margin: '0 auto 2rem',
    borderRadius: '2px'
  },
  bulletPoint: {
    color: '#4CAF50',
    fontSize: '1.2rem',
    marginRight: '0.8rem',
    display: 'inline-block',
    animation: 'pulse 2s infinite'
  },
  listItem: {
    marginBottom: '1.2rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    transition: 'all 0.3s ease',
    position: 'relative',
    fontSize: '1rem',
    lineHeight: '1.6'
  },
  strongText: {
    color: '#2E7D32',
    fontWeight: '700'
  },
  statsCard: {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    color: 'white',
    borderRadius: '15px',
    padding: '1.5rem',
    textAlign: 'center',
    margin: '0.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'rgba(76, 175, 80, 0.1)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem',
    fontSize: '1.2rem',
    color: '#4CAF50'
  }
};

const AboutContentLayout = () => {
  const [activeItem, setActiveItem] = useState('introduction');

  const menuItems = [
    { id: 'introduction', label: 'Introduction', icon: 'fas fa-home' },
    { id: 'principles', label: 'Principles and Norms', icon: 'fas fa-balance-scale' },
    { id: 'goals', label: 'Goals and Objectives', icon: 'fas fa-target' },
    { id: 'activities', label: 'Activities', icon: 'fas fa-hands-helping' },
    { id: 'sources', label: 'Sources of funds and income', icon: 'fas fa-money-bill-wave' },
    { id: 'expenditure', label: 'Expenditure policy', icon: 'fas fa-chart-pie' },
    { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
  ];

  const handleItemHover = (e, isHover, itemId) => {
    if (isHover && itemId !== activeItem) {
      e.currentTarget.style.transform = 'translateX(5px)';
      e.currentTarget.style.backgroundColor = '#e8f5e9';
      e.currentTarget.style.borderColor = '#4CAF50';
    } else if (!isHover && itemId !== activeItem) {
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.backgroundColor = '#f8f9fa';
      e.currentTarget.style.borderColor = '#e9ecef';
    }
  };

  const handleListItemHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.backgroundColor = '#e3f2fd';
      e.currentTarget.style.borderColor = '#4CAF50';
      e.currentTarget.style.transform = 'translateX(8px)';
      e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.2)';
    } else {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
      e.currentTarget.style.borderColor = '#e9ecef';
      e.currentTarget.style.transform = 'translateX(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  };

  const getMenuIcon = (itemId) => {
    const iconMap = {
      introduction: 'fas fa-home',
      principles: 'fas fa-balance-scale',
      goals: 'fas fa-target',
      activities: 'fas fa-hands-helping',
      sources: 'fas fa-money-bill-wave',
      expenditure: 'fas fa-chart-pie',
      achievements: 'fas fa-trophy'
    };
    return iconMap[itemId] || 'fas fa-circle';
  };

  const renderContent = () => {
    const contentData = {
      introduction: {
        icon: 'fas fa-seedling',
        items: [
          'Hope Harvest was established in 2025 as a charitable foundation with the mission of "Sowing Seeds of Hope, Reaping Change."',
          'Our foundation focuses on providing sustainable relief, empowering communities, and creating long-term positive impact across Bangladesh.',
          'Founded by a group of dedicated community leaders who recognized the need for transparent and efficient charitable services.',
          'We operate through three key service areas: User Authentication & Management, Donation & Payment Services, and Event & Volunteer Coordination.',
          'Our digital platform enables secure donations, transparent fund management, volunteer coordination, and efficient event organization.',
          'Through campaigns and events, we\'ve touched the lives of thousands across various districts, focusing on areas like disaster relief, education, healthcare, and community development.',
          'We maintain complete transparency in our operations, with detailed tracking of all donations and their impacts.'
        ]
      },
      principles: {
        icon: 'fas fa-balance-scale',
        items: [
          { title: 'Transparency', desc: 'We maintain complete openness about our finances, operations, and impact. Donors can track their contributions from donation to implementation.' },
          { title: 'Accountability', desc: 'We hold ourselves accountable to donors, beneficiaries, and the public through regular reporting and independent audits.' },
          { title: 'Efficiency', desc: 'We minimize administrative costs (5-10%) to ensure maximum impact from every donation we receive.' },
          { title: 'Inclusivity', desc: 'We serve all communities regardless of religion, ethnicity, gender, or political affiliation.' },
          { title: 'Sustainability', desc: 'Our projects aim for long-term impact and self-sufficiency rather than creating dependency.' },
          { title: 'Dignity', desc: 'We respect the dignity of beneficiaries and involve them in decision-making processes.' },
          { title: 'Innovation', desc: 'We continuously seek innovative solutions to community challenges through technology and creative approaches.' },
          { title: 'Community-Led', desc: 'We believe in empowering communities to lead their own development processes.' }
        ]
      },
      goals: {
        icon: 'fas fa-target',
        items: [
          { title: 'Relief Provision', desc: 'Deliver timely and effective relief during emergencies and natural disasters.' },
          { title: 'Poverty Alleviation', desc: 'Create sustainable pathways out of poverty through education, skills training, and economic opportunities.' },
          { title: 'Healthcare Access', desc: 'Improve access to quality healthcare services in underserved communities.' },
          { title: 'Educational Support', desc: 'Enhance educational opportunities for underprivileged children and youth.' },
          { title: 'Community Development', desc: 'Foster self-reliant and resilient communities through participatory development projects.' },
          { title: 'Volunteer Mobilization', desc: 'Build a network of committed volunteers who contribute their time and skills to social causes.' },
          { title: 'Transparent Charity', desc: 'Set new standards for transparency and accountability in the charitable sector.' },
          { title: 'Digital Innovation', desc: 'Leverage technology to enhance the efficiency and reach of charitable activities.' }
        ]
      },
      activities: {
        icon: 'fas fa-hands-helping',
        items: [
          { title: 'Disaster Relief', desc: 'Providing immediate assistance during floods, cyclones, and other disasters with food, shelter, and medical aid.' },
          { title: 'Winter Relief', desc: 'Distribution of blankets, warm clothing, and heaters to vulnerable communities during winter months.' },
          { title: 'Educational Programs', desc: 'Scholarships, school supplies distribution, and educational infrastructure development in rural areas.' },
          { title: 'Health Camps', desc: 'Mobile medical clinics offering free health checkups, medicine distribution, and health awareness programs.' },
          { title: 'Clean Water Projects', desc: 'Installation of tube wells and water purification systems in areas with contaminated water sources.' },
          { title: 'Food Distribution', desc: 'Regular food distribution programs for marginalized communities and during Ramadan.' },
          { title: 'Skill Development', desc: 'Training programs to equip youth and women with employable skills and entrepreneurship knowledge.' },
          { title: 'Community Infrastructure', desc: 'Building and repairing community facilities such as schools, health centers, and roads.' },
          { title: 'Fund Application Support', desc: 'Providing financial assistance to individuals for medical treatments, education, and emergencies.' },
          { title: 'Volunteer Programs', desc: 'Recruiting, training, and deploying volunteers for various charitable activities.' }
        ]
      },
      sources: {
        icon: 'fas fa-money-bill-wave',
        items: [
          'The journey begins with the property and funds purchased with donations from the founding members.',
          'One-time and regular donations from members and supporters through our secure online platform.',
          'Proceeds from any project of the Foundation including merchandise sales and fundraising events.',
          'Grants given by the public in a particular sector for specific causes and campaigns.',
          'Zakat, Fitra, and Sadaqah contributions from Muslim donors, especially during Ramadan.',
          'Money recovered in special sectors including Iftar and Qurbani (Eid-ul-Adha) charity drives.',
          'Grants from government or private sources, including corporate social responsibility partnerships.',
          '5–10% administrative cost deducted from various projects to sustain operations and platform maintenance.',
          'Campaign-specific fundraising through our digital platform with real-time progress tracking.',
          'In-kind donations of goods and services that support our operations and relief efforts.'
        ]
      },
      expenditure: {
        icon: 'fas fa-chart-pie',
        items: [
          { title: 'Campaign-Specific Allocation', desc: 'Donations to specific campaigns are strictly used for those campaigns, with transparent usage reporting.' },
          { title: 'Administrative Cap', desc: 'We maintain a strict cap of 5-10% on administrative expenses to ensure most funds reach beneficiaries.' },
          { title: 'Event Budgeting', desc: 'Each event under a campaign has a detailed budget with categories for supplies, logistics, and volunteer support.' },
          { title: 'Fund Verification', desc: 'All fund applications undergo thorough verification by trained volunteers before disbursement.' },
          { title: 'Digital Tracking', desc: 'Our platform provides real-time tracking of donation usage with itemized expenditure records.' },
          { title: 'Audit Compliance', desc: 'We maintain strict financial records and undergo regular independent audits.' },
          { title: 'Zero Tolerance', desc: 'We have a zero-tolerance policy for misappropriation of funds with multiple approval layers.' },
          { title: 'Impact Measurement', desc: 'Expenditures are evaluated based on their effectiveness and impact on beneficiaries.' },
          { title: 'Sustainable Purchasing', desc: 'We prioritize local purchasing to support community economies when possible.' },
          { title: 'Emergency Fund', desc: 'We maintain a contingency fund for rapid response to emergencies without administrative delays.' }
        ]
      },
      achievements: {
        icon: 'fas fa-trophy',
        items: [
          { title: 'Relief Impact', desc: 'Provided emergency relief to over 25,000 people affected by floods, cyclones, and other disasters since 2015.' },
          { title: 'Winter Campaigns', desc: 'Distributed warm clothing and blankets to 15,000+ families in northern Bangladesh over the past 5 years.' },
          { title: 'Medical Assistance', desc: 'Facilitated medical treatments for 3,500+ individuals through our fund application program.' },
          { title: 'Educational Support', desc: 'Provided scholarships and educational materials to 7,000+ underprivileged students.' },
          { title: 'Clean Water', desc: 'Installed 120 deep tube wells in arsenic-affected areas, benefiting approximately 30,000 people.' },
          { title: 'Volunteer Network', desc: 'Built a dedicated network of 1,200+ active volunteers across Bangladesh.' },
          { title: 'Digital Innovation', desc: 'Developed a fully transparent donation tracking system allowing donors to see the impact of every contribution.' },
          { title: 'Community Centers', desc: 'Established 15 community centers that serve as hubs for educational programs and emergency response.' },
          { title: 'COVID-19 Response', desc: 'Provided food packages, hygiene kits, and medical supplies to 10,000+ families during the pandemic.' },
          { title: 'Financial Transparency', desc: 'Maintained an average of 92% fund utilization rate directly benefiting communities, with only 8% used for administration.' }
        ]
      }
    };

    const currentContent = contentData[activeItem];
    if (!currentContent) return null;

    return (
      <div>
        <div className="text-center mb-4">
          <i className={`${currentContent.icon} fa-3x`} style={{ color: '#4CAF50', marginBottom: '1rem' }}></i>
        </div>
        <ul className="list-unstyled">
          {currentContent.items.map((item, index) => (
            <li 
              key={index}
              style={styles.listItem}
              onMouseEnter={(e) => handleListItemHover(e, true)}
              onMouseLeave={(e) => handleListItemHover(e, false)}
            >
              <span style={styles.bulletPoint}>🟢</span>
              {typeof item === 'string' ? (
                item
              ) : (
                <>
                  <span style={styles.strongText}>{item.title}:</span> {item.desc}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div style={styles.mainContainer}>
      <div className="container">
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <i className="fas fa-heart" style={styles.heroPattern}></i>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold mb-4">About Hope Harvest</h1>
              <p className="lead mb-4">
                Sowing Seeds of Hope, Reaping Change - Learn about our mission, values, and impact in creating sustainable positive change across Bangladesh.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="row">
                <div className="col-6">
                  <div style={styles.statsCard}>
                    <h4>2025</h4>
                    <p className="mb-0">Established</p>
                  </div>
                </div>
                <div className="col-6">
                  <div style={styles.statsCard}>
                    <h4>25K+</h4>
                    <p className="mb-0">Lives Impacted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        <div className="row d-flex align-items-stretch" style={{ minHeight: '700px' }}>
          {/* Sidebar */}
          <div className="col-md-4">
            <div style={styles.sidebarContainer}>
              <h4 style={styles.sidebarTitle}>
                <i className="fas fa-book-open me-2"></i>
                Explore Our Story
              </h4>
              <ul className="list-unstyled">
                {menuItems.map(item => (
                  <li
                    key={item.id}
                    className="list-group-item-action"
                    onClick={() => setActiveItem(item.id)}
                    onMouseEnter={(e) => handleItemHover(e, true, item.id)}
                    onMouseLeave={(e) => handleItemHover(e, false, item.id)}
                    style={{ 
                      ...styles.sidebarItem,
                      ...(activeItem === item.id ? styles.activeItem : styles.inactiveItem)
                    }}
                  >
                    <div style={styles.iconContainer}>
                      <i className={getMenuIcon(item.id)}></i>
                    </div>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>          {/* Content */}
          <div className="col-md-8">
            <div style={styles.contentContainer}>
              <h2 style={styles.contentTitle}>
                {menuItems.find(item => item.id === activeItem)?.label}
              </h2>
              <div style={styles.contentTitleUnderline}></div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); }          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AboutContentLayout;