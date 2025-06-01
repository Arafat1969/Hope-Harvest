import React, { useState } from 'react';
import './volunteerActivity.css';

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
  }
};

const VolunteerActivityLayout = () => {
  const [activeItem, setActiveItem] = useState('aim');

  const menuItems = [
    { id: 'aim', label: 'Aim' },
    { id: 'activity', label: 'Activity' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'achievements', label: 'Achievements' },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'aim':
        return (
          <div>
            <p className="mb-3">
              The volunteer program at Hope Harvest aims to create a network of dedicated individuals who contribute their time, skills, and passion to make a tangible difference in communities across Bangladesh. We believe in the power of collective action and that every person has something valuable to offer in service to others. Our goal is to harness this potential by providing structured opportunities for meaningful engagement.
            </p>
            <p className="mb-3">
              We strive to build a diverse volunteer base that represents all segments of society, including students, professionals, retirees, and homemakers. By bringing together people from different backgrounds, we create a rich pool of skills, perspectives, and experiences that enhance our ability to address complex community challenges. Our volunteer program is designed to be inclusive, welcoming anyone with a sincere desire to help regardless of their previous experience.
            </p>
            <p className="mb-3">
              Beyond the immediate impact on beneficiaries, we aim to foster a culture of volunteerism and civic responsibility in Bangladesh. Through volunteering with Hope Harvest, participants develop empathy, leadership skills, and a deeper understanding of social issues. Many volunteers report that their experiences transform their worldview and inspire continued community involvement throughout their lives.
            </p>
            <p className="mb-3">
              The program also serves as a bridge between different communities, creating connections between those who serve and those who are served. These relationships help break down stereotypes, build mutual respect, and create a stronger sense of shared humanity. Ultimately, we envision a society where volunteerism is a natural and valued part of citizenship, contributing to social cohesion and collective wellbeing.
            </p>
          </div>
        );
      case 'activity':
        return (
          <div>
            <p className="mb-3">
              Volunteers at Hope Harvest engage in a wide range of activities across our various program areas. In our disaster relief initiatives, volunteers assist with packing and distributing emergency supplies, setting up temporary shelters, conducting needs assessments, and providing emotional support to affected families. During non-emergency periods, they help with disaster preparedness training in vulnerable communities and inventory management of emergency stockpiles.
            </p>
            <p className="mb-3">
              Educational support is another key area where volunteers make a significant contribution. They serve as tutors for underprivileged students, conduct educational workshops, assist in our digital literacy programs, and help organize and staff mobile libraries. Many volunteers with teaching backgrounds also contribute to our teacher training initiatives, sharing their expertise to improve educational quality in rural schools.
            </p>
            <p className="mb-3">
              Our healthcare programs rely heavily on volunteer support, particularly from those with medical backgrounds. Medical professionals volunteer in our mobile health clinics, health camps, and specialist consultation events. Non-medical volunteers assist with patient registration, crowd management, health education sessions, and follow-up activities. During vaccination drives and health awareness campaigns, volunteers are essential for reaching remote communities.
            </p>
            <p className="mb-3">
              Environmental initiatives provide opportunities for volunteers to participate in tree planting, coastal cleanup events, community garden development, and environmental education in schools. Many volunteers also contribute their skills in administration, marketing, fundraising, photography, and technology support at our head office. These behind-the-scenes roles are crucial for maintaining our operations and expanding our reach.
            </p>
          </div>
        );
      case 'requirements':
        return (
          <div>
            <p className="mb-3">
              Hope Harvest welcomes volunteers from all walks of life, with the primary requirement being a genuine commitment to our mission and values. Prospective volunteers must be at least 18 years of age to participate independently, though we do offer supervised opportunities for younger individuals through our youth volunteer program. All volunteers must complete our registration process, which includes providing basic personal information, emergency contacts, and areas of interest.
            </p>
            <p className="mb-3">
              Depending on the nature of the volunteer work, specific requirements may apply. For roles involving work with vulnerable populations such as children, the elderly, or individuals with disabilities, we conduct background checks to ensure safety. Medical volunteers must provide verification of their qualifications and licenses. For disaster response teams, physical fitness and ability to work in challenging conditions may be necessary.
            </p>
            <p className="mb-3">
              Time commitment varies based on the role and project. Some opportunities require regular weekly commitment, while others are one-time or event-based. We ask volunteers to be realistic about their availability and to honor their commitments once made, as our beneficiaries and teams rely on their presence. All new volunteers participate in an orientation session that covers our organization's history, mission, policies, and procedures.
            </p>
            <p className="mb-3">
              While specific skills are valuable for certain roles, many volunteer positions require no specialized knowledge. We believe in learning through service and provide necessary training for volunteers in their assigned areas. The most important qualities we look for are reliability, empathy, respect for diversity, willingness to learn, and ability to work as part of a team. We encourage volunteers to bring their unique talents, creativity, and enthusiasm to their service with us.
            </p>
          </div>
        );
      case 'achievements':
        return (
          <div>
            <p className="mb-3">
              Hope Harvest volunteers have been the driving force behind transformative change in communities across Bangladesh. Since our founding, volunteers have contributed over 150,000 hours of service, touching the lives of more than 100,000 individuals through various programs. During natural disasters, our volunteer teams have consistently been among the first responders, often reaching remote areas before larger aid organizations and providing critical immediate relief to thousands of affected families.
            </p>
            <p className="mb-3">
              In education, volunteer tutors have helped improve academic outcomes for over 5,000 underprivileged students, with many pupils showing significant improvement in key subjects. Some students mentored by our volunteers have gone on to become the first in their families to attend university. Our volunteer-led digital literacy programs have equipped over 3,000 people with essential computer skills, opening new employment opportunities and connecting them to the digital world.
            </p>
            <p className="mb-3">
              Volunteer medical professionals have been instrumental in extending healthcare to underserved communities, providing consultations to over 35,000 patients who would otherwise lack access to quality care. Their early detection and intervention have saved countless lives, particularly in cases of preventable or treatable conditions. Through health education sessions, volunteers have raised awareness about hygiene, nutrition, and disease prevention, leading to measurable improvements in community health practices.
            </p>
            <p className="mb-3">
              Environmental volunteer initiatives have resulted in the planting of 75,000 trees, the cleaning of kilometers of coastline, and the establishment of dozens of community gardens that now provide sustainable food sources. Beyond these tangible outcomes, perhaps the most significant achievement is the ripple effect created by our volunteers. Many beneficiaries of our programs have themselves become volunteers, creating a cycle of service that continues to grow. Our volunteers frequently report that their experiences have deepened their understanding of social issues and motivated them to become more engaged citizens, amplifying their impact beyond their direct service.
            </p>
          </div>
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
            Volunteer {menuItems.find(item => item.id === activeItem)?.label}
          </h5>
          <hr />
          {renderContent()}
        </div>
      </div>
      
      {/* Single button outside the content containers */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-success btn-lg px-5 py-3" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
            Join as volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerActivityLayout;