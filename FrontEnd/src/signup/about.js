import React, { useState } from 'react';
import './sidebarContent.css';

// Theme styles to match Hope Harvest
const styles = {
  sidebarItem: {
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  activeItem: {
    backgroundColor: '#e8f5e9', // Light green background
    color: '#2E7D32',          // Dark green text
    borderLeft: '4px solid #4CAF50', // Green left border
    fontWeight: '500'
  },
  contentContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  contentTitle: {
    color: '#2E7D32', // Dark green title
    fontWeight: '600'
  },
  bulletPoint: {
    color: '#4CAF50' // Green bullet points
  }
};

const AboutContentLayout = () => {
  const [activeItem, setActiveItem] = useState('introduction');

  const menuItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'principles', label: 'Principles and Norms' },
    { id: 'goals', label: 'Goals and Objectives' },
    { id: 'activities', label: 'Activities' },
    { id: 'sources', label: 'Sources of funds and income' },
    { id: 'expenditure', label: 'Expenditure policy' },
    { id: 'achievements', label: 'Achievements' },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'introduction':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> Hope Harvest was established in 2025 as a charitable foundation with the mission of "Sowing Seeds of Hope, Reaping Change."</li>
            <li><span style={styles.bulletPoint}>🟢</span> Our foundation focuses on providing sustainable relief, empowering communities, and creating long-term positive impact across Bangladesh.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Founded by a group of dedicated community leaders who recognized the need for transparent and efficient charitable services.</li>
            <li><span style={styles.bulletPoint}>🟢</span> We operate through three key service areas: User Authentication & Management, Donation & Payment Services, and Event & Volunteer Coordination.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Our digital platform enables secure donations, transparent fund management, volunteer coordination, and efficient event organization.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Through campaigns and events, we've touched the lives of thousands across various districts, focusing on areas like disaster relief, education, healthcare, and community development.</li>
            <li><span style={styles.bulletPoint}>🟢</span> We maintain complete transparency in our operations, with detailed tracking of all donations and their impacts.</li>
          </ul>
        );
      case 'principles':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Transparency:</strong> We maintain complete openness about our finances, operations, and impact. Donors can track their contributions from donation to implementation.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Accountability:</strong> We hold ourselves accountable to donors, beneficiaries, and the public through regular reporting and independent audits.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Efficiency:</strong> We minimize administrative costs (5-10%) to ensure maximum impact from every donation we receive.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Inclusivity:</strong> We serve all communities regardless of religion, ethnicity, gender, or political affiliation.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Sustainability:</strong> Our projects aim for long-term impact and self-sufficiency rather than creating dependency.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Dignity:</strong> We respect the dignity of beneficiaries and involve them in decision-making processes.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Innovation:</strong> We continuously seek innovative solutions to community challenges through technology and creative approaches.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Community-Led:</strong> We believe in empowering communities to lead their own development processes.</li>
          </ul>
        );
      case 'goals':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Relief Provision:</strong> Deliver timely and effective relief during emergencies and natural disasters.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Poverty Alleviation:</strong> Create sustainable pathways out of poverty through education, skills training, and economic opportunities.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Healthcare Access:</strong> Improve access to quality healthcare services in underserved communities.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Educational Support:</strong> Enhance educational opportunities for underprivileged children and youth.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Community Development:</strong> Foster self-reliant and resilient communities through participatory development projects.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Volunteer Mobilization:</strong> Build a network of committed volunteers who contribute their time and skills to social causes.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Transparent Charity:</strong> Set new standards for transparency and accountability in the charitable sector.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Digital Innovation:</strong> Leverage technology to enhance the efficiency and reach of charitable activities.</li>
          </ul>
        );
      case 'activities':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Disaster Relief:</strong> Providing immediate assistance during floods, cyclones, and other disasters with food, shelter, and medical aid.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Winter Relief:</strong> Distribution of blankets, warm clothing, and heaters to vulnerable communities during winter months.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Educational Programs:</strong> Scholarships, school supplies distribution, and educational infrastructure development in rural areas.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Health Camps:</strong> Mobile medical clinics offering free health checkups, medicine distribution, and health awareness programs.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Clean Water Projects:</strong> Installation of tube wells and water purification systems in areas with contaminated water sources.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Food Distribution:</strong> Regular food distribution programs for marginalized communities and during Ramadan.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Skill Development:</strong> Training programs to equip youth and women with employable skills and entrepreneurship knowledge.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Community Infrastructure:</strong> Building and repairing community facilities such as schools, health centers, and roads.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Fund Application Support:</strong> Providing financial assistance to individuals for medical treatments, education, and emergencies.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Volunteer Programs:</strong> Recruiting, training, and deploying volunteers for various charitable activities.</li>
          </ul>
        );
      case 'sources':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> The journey begins with the property and funds purchased with donations from the founding members.</li>
            <li><span style={styles.bulletPoint}>🟢</span> One-time and regular donations from members and supporters through our secure online platform.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Proceeds from any project of the Foundation including merchandise sales and fundraising events.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Grants given by the public in a particular sector for specific causes and campaigns.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Zakat, Fitra, and Sadaqah contributions from Muslim donors, especially during Ramadan.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Money recovered in special sectors including Iftar and Qurbani (Eid-ul-Adha) charity drives.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Grants from government or private sources, including corporate social responsibility partnerships.</li>
            <li><span style={styles.bulletPoint}>🟢</span> 5–10% administrative cost deducted from various projects to sustain operations and platform maintenance.</li>
            <li><span style={styles.bulletPoint}>🟢</span> Campaign-specific fundraising through our digital platform with real-time progress tracking.</li>
            <li><span style={styles.bulletPoint}>🟢</span> In-kind donations of goods and services that support our operations and relief efforts.</li>
          </ul>
        );
      case 'expenditure':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Campaign-Specific Allocation:</strong> Donations to specific campaigns are strictly used for those campaigns, with transparent usage reporting.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Administrative Cap:</strong> We maintain a strict cap of 5-10% on administrative expenses to ensure most funds reach beneficiaries.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Event Budgeting:</strong> Each event under a campaign has a detailed budget with categories for supplies, logistics, and volunteer support.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Fund Verification:</strong> All fund applications undergo thorough verification by trained volunteers before disbursement.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Digital Tracking:</strong> Our platform provides real-time tracking of donation usage with itemized expenditure records.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Audit Compliance:</strong> We maintain strict financial records and undergo regular independent audits.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Zero Tolerance:</strong> We have a zero-tolerance policy for misappropriation of funds with multiple approval layers.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Impact Measurement:</strong> Expenditures are evaluated based on their effectiveness and impact on beneficiaries.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Sustainable Purchasing:</strong> We prioritize local purchasing to support community economies when possible.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Emergency Fund:</strong> We maintain a contingency fund for rapid response to emergencies without administrative delays.</li>
          </ul>
        );
      case 'achievements':
        return (
          <ul className="list-unstyled">
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Relief Impact:</strong> Provided emergency relief to over 25,000 people affected by floods, cyclones, and other disasters since 2015.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Winter Campaigns:</strong> Distributed warm clothing and blankets to 15,000+ families in northern Bangladesh over the past 5 years.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Medical Assistance:</strong> Facilitated medical treatments for 3,500+ individuals through our fund application program.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Educational Support:</strong> Provided scholarships and educational materials to 7,000+ underprivileged students.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Clean Water:</strong> Installed 120 deep tube wells in arsenic-affected areas, benefiting approximately 30,000 people.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Volunteer Network:</strong> Built a dedicated network of 1,200+ active volunteers across Bangladesh.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Digital Innovation:</strong> Developed a fully transparent donation tracking system allowing donors to see the impact of every contribution.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Community Centers:</strong> Established 15 community centers that serve as hubs for educational programs and emergency response.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>COVID-19 Response:</strong> Provided food packages, hygiene kits, and medical supplies to 10,000+ families during the pandemic.</li>
            <li><span style={styles.bulletPoint}>🟢</span> <strong>Financial Transparency:</strong> Maintained an average of 92% fund utilization rate directly benefiting communities, with only 8% used for administration.</li>
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-4">
          <ul className="list-group">
            {menuItems.map(item => (
              <li
                key={item.id}
                className={`list-group-item list-group-item-action ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => setActiveItem(item.id)}
                style={{ 
                  ...styles.sidebarItem,
                  ...(activeItem === item.id ? styles.activeItem : {})
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Content */}
        <div className="col-md-8 p-4 rounded shadow-sm" style={styles.contentContainer}>
          <h5 style={styles.contentTitle}>
            {menuItems.find(item => item.id === activeItem)?.label}
          </h5>
          <hr />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AboutContentLayout;