import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const [activeItem, setActiveItem] = useState('introduction');

  const menuItems = [
    { id: 'introduction', label: 'Introduction', icon: 'fas fa-home' },
    { id: 'principles', label: 'Principles and Norms', icon: 'fas fa-balance-scale' },
    { id: 'goals', label: 'Goals and Objectives', icon: 'fas fa-bullseye' },
    { id: 'activities', label: 'Activities', icon: 'fas fa-hands-helping' },
    { id: 'sources', label: 'Sources of funds', icon: 'fas fa-money-bill-wave' },
    { id: 'expenditure', label: 'Expenditure policy', icon: 'fas fa-chart-pie' },
    { id: 'achievements', label: 'Achievements', icon: 'fas fa-trophy' },
  ];
  
  const contentData = {
    introduction: {
      icon: 'fas fa-seedling',
      items: [
        'Hope Harvest was established in 2025 as a charitable foundation with the mission of "Sowing Seeds of Hope, Reaping Change."',
        'Our foundation focuses on providing sustainable relief, empowering communities, and creating long-term positive impact across Bangladesh.',
        'Founded by a group of dedicated community leaders who recognized the need for transparent and efficient charitable services.',
        'We operate through three key service areas: User Authentication & Management, Donation & Payment Services, and Event & Volunteer Coordination.',
        'Our digital platform enables secure donations, transparent fund management, volunteer coordination, and efficient event organization.',
        'Through campaigns and events, we\'ve touched the lives of thousands across various districts, focusing on areas like disaster relief, education, and healthcare.',
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
      ]
    },
    goals: { icon: 'fas fa-bullseye', items: [ { title: 'Relief Provision', desc: 'Deliver timely and effective relief during emergencies and natural disasters.' }, { title: 'Poverty Alleviation', desc: 'Create sustainable pathways out of poverty through education, skills training, and economic opportunities.' } /*...more*/ ]},
    activities: { icon: 'fas fa-hands-helping', items: [ { title: 'Disaster Relief', desc: 'Providing immediate assistance during floods, cyclones, and other disasters with food, shelter, and medical aid.' }, { title: 'Winter Relief', desc: 'Distribution of blankets, warm clothing, and heaters to vulnerable communities during winter months.' } /*...more*/ ]},
    sources: { icon: 'fas fa-money-bill-wave', items: [ 'The journey begins with the property and funds purchased with donations from the founding members.', 'One-time and regular donations from members and supporters through our secure online platform.' /*...more*/ ]},
    expenditure: { icon: 'fas fa-chart-pie', items: [ { title: 'Campaign-Specific Allocation', desc: 'Donations to specific campaigns are strictly used for those campaigns, with transparent usage reporting.' }, { title: 'Administrative Cap', desc: 'We maintain a strict cap of 5-10% on administrative expenses to ensure most funds reach beneficiaries.' } /*...more*/ ]},
    achievements: { icon: 'fas fa-trophy', items: [ { title: 'Relief Impact', desc: 'Provided emergency relief to over 25,000 people affected by floods, cyclones, and other disasters since 2015.' }, { title: 'Winter Campaigns', desc: 'Distributed warm clothing and blankets to 15,000+ families in northern Bangladesh over the past 5 years.' } /*...more*/ ]},
  };

  const renderContent = () => {
    const currentContent = contentData[activeItem];
    if (!currentContent) return null;

    const isSimpleList = typeof currentContent.items[0] === 'string';

    return (
      <div>
        <div className="text-center mb-4">
          <i className={`${currentContent.icon} fa-3x ${styles.contentIcon}`}></i>
        </div>
        <ul className="list-unstyled">
          {currentContent.items.map((item, index) => (
            <li key={index} className={styles.listItem}>
              <span className={styles.bulletPoint}>🟢</span>
              {typeof item === 'string' ? item : (
                <p>
                  <span className={styles.strongText}>{item.title}:</span> {item.desc}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className="container">
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <i className={`fas fa-heart ${styles.heroPattern}`}></i>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold">About Hope Harvest</h1>
              <p className="lead">
                Sowing Seeds of Hope, Reaping Change - Learn about our mission, values, and impact in creating sustainable positive change across Bangladesh.
              </p>
            </div>
            <div className="col-md-4 text-center">
              <div className="row g-3">
                <div className="col-6">
                  <div className={styles.statsCard}>
                    <h4>2025</h4>
                    <p className="mb-0">Established</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className={styles.statsCard}>
                    <h4>25K+</h4>
                    <p className="mb-0">Lives Impacted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* This `align-items-stretch` class is the key to equal height columns */}
        <div className="row align-items-stretch">
          {/* Sidebar */}
          <div className="col-md-4">
            <div className={styles.sidebarContainer}>
              <h4 className={styles.sidebarTitle}>
                <i className="fas fa-book-open me-2"></i>
                Explore Our Story
              </h4>
              <ul className="list-unstyled">
                {menuItems.map(item => (
                  <li
                    key={item.id}
                    className={`${styles.sidebarItem} ${activeItem === item.id ? styles.activeItem : ''}`}
                    onClick={() => setActiveItem(item.id)}
                  >
                    <div className={styles.iconContainer}>
                      <i className={item.icon}></i>
                    </div>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="col-md-8">
            <div className={styles.contentContainer}>
              <h2 className={styles.contentTitle}>
                {menuItems.find(item => item.id === activeItem)?.label}
              </h2>
              <div className={styles.contentTitleUnderline}></div>
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
