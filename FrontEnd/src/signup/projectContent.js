import React, { useState } from 'react';
import './projectContent.css';

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
  },
  projectImage: {
    width: '100%',
    borderRadius: '0.5rem',
    marginBottom: '1rem',
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
  }
};

const ProjectsContentLayout = () => {
  const [activeItem, setActiveItem] = useState('self-reliance');

  const menuItems = [
    { id: 'self-reliance', label: 'Self-reliance' },
    { id: 'relief-distribution', label: 'Distribution of relief' },
    { id: 'raising-caring', label: 'Raising and caring' },
    { id: 'environment', label: 'Save the environment' },
    { id: 'medical-support', label: 'Medical Support' },
    { id: 'education-training', label: 'Education and training' },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'self-reliance':
        return (
          <div>
            <p className="mb-3">
              Our Self-reliance projects focus on creating sustainable livelihoods and economic independence for communities. Through our Microfinance Initiative, we provide small loans with low-interest rates to help individuals start or expand businesses. We complement this with comprehensive Skills Development programs that offer training in various vocations including sewing, handicrafts, electronics repair, and carpentry.
            </p>
            <p className="mb-3">
              The Women's Cooperative program has been particularly successful in supporting women's groups to establish cooperative businesses in food processing, textiles, and local crafts. Our Agricultural Support initiatives provide seeds, tools, and training to farmers to improve crop yields using sustainable farming techniques.
            </p>
            <p className="mb-3">
              Through our Tech Empowerment programs, we're bridging the digital divide by offering digital literacy training that helps communities leverage technology for business and educational opportunities. Our Market Linkage efforts connect rural producers with urban markets to ensure fair prices and sustainable income streams.
            </p>
            <p className="mb-3">
              Regular Entrepreneurship Workshops equip aspiring business owners with essential skills in business planning, financial management, and marketing. We've also established Community Banks to promote financial independence through community-managed savings groups that provide emergency funds and small loans.
            </p>
            
            <div className="mt-4 text-center">
              <button className="btn btn-success px-4 py-2" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
                See All Projects
              </button>
            </div>
          </div>
        );
      case 'relief-distribution':
        return (
          <div>
            <p className="mb-3">
              Hope Harvest's Relief Distribution programs provide immediate assistance during emergencies and ongoing support to vulnerable communities. Our Flood Relief teams deliver emergency food, clean water, medicine, and temporary shelter to communities affected by flooding, which is a recurring challenge in many parts of Bangladesh.
            </p>
            <p className="mb-3">
              The Winter Relief Campaign is one of our most impactful initiatives, distributing blankets, warm clothing, and heaters to vulnerable communities in northern districts during the harsh winter months. Our Food Security Program ensures regular distribution of essential food items to families facing severe food insecurity throughout the year.
            </p>
            <p className="mb-3">
              We maintain Emergency Medical Aid teams capable of rapid deployment of medical supplies and personnel during disasters and epidemics. Our Shelter Reconstruction program supports rebuilding homes damaged or destroyed by natural disasters, helping families regain stability and security.
            </p>
            <p className="mb-3">
              During Ramadan, we provide special food packages to ensure families can break their fast with nutritious meals. Our Clean Water Distribution and Hygiene Kits programs are critical components of our emergency response, preventing disease outbreaks in disaster-affected areas by providing safe water and essential hygiene products.
            </p>
            
            <div className="mt-4 text-center">
              <button className="btn btn-success px-4 py-2" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
                See All Projects
              </button>
            </div>
          </div>
        );
      case 'raising-caring':
        return (
          <div>
            <p className="mb-3">
              Our Raising and Caring initiatives focus on supporting the most vulnerable members of society. The Orphanage Support program provides educational materials, nutritional support, and infrastructure improvements to local orphanages, creating better living and learning environments for children without parents.
            </p>
            <p className="mb-3">
              Through our Elder Care Program, we support elderly individuals who often lack family support with regular health checkups, companionship, and basic necessities. The Child Nutrition Initiative addresses the critical issue of malnutrition through specialized nutrition programs and regular health monitoring for at-risk children.
            </p>
            <p className="mb-3">
              We provide assistance to families fostering orphaned or abandoned children through our Foster Care Support program, offering both counseling and financial aid. Our Community Childcare Centers create safe spaces for children while parents work, combining care with early education to support working families.
            </p>
            <p className="mb-3">
              The Special Needs Support program provides specialized equipment, therapy, and educational materials for children with disabilities. Our Youth Mentorship initiative connects vulnerable youth with positive role models from the community for guidance and support. The Widow Support Network offers comprehensive assistance to widows, including skills training, community integration, and psychosocial support.
            </p>
            
            <div className="mt-4 text-center">
              <button className="btn btn-success px-4 py-2" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
                See All Projects
              </button>
            </div>
          </div>
        );
      case 'environment':
        return (
          <div>
            <p className="mb-3">
              Hope Harvest's environmental initiatives aim to protect natural resources and promote sustainable practices. Our Tree Planting Drives organize regular campaigns to plant trees in deforested areas, schools, and public spaces with ongoing maintenance to ensure survival and growth. The Community Gardens program establishes organic vegetable gardens in urban areas to promote sustainable food production and environmental awareness.
            </p>
            <p className="mb-3">
              We're tackling pollution through community-based Waste Management programs that implement waste segregation and recycling in partnership with local municipalities. Our Clean Water Initiatives focus on installing water filtration systems and protecting natural water sources from contamination, ensuring communities have access to safe drinking water.
            </p>
            <p className="mb-3">
              Environmental Education is a cornerstone of our approach, with school programs teaching children about conservation, climate change, and sustainable practices. Regular Coastal Cleanup events mobilize volunteers to remove plastic and other harmful waste from beaches and riversides, protecting marine ecosystems.
            </p>
            <p className="mb-3">
              Our Solar Energy Projects install solar panels in off-grid communities, providing clean energy and reducing deforestation for fuel. We promote Eco-Friendly Farming by training farmers in sustainable agriculture techniques that reduce chemical use and soil degradation. The Mangrove Restoration initiative focuses on protecting and restoring these vital coastal forests that prevent erosion and serve as natural barriers against storms.
            </p>
            
            <div className="mt-4 text-center">
              <button className="btn btn-success px-4 py-2" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
                See All Projects
              </button>
            </div>
          </div>
        );
      case 'medical-support':
        return (
          <div>
            <p className="mb-3">
              Our Medical Support programs address healthcare disparities across Bangladesh. Mobile Health Clinics bring medical services to underserved rural areas, providing free health checkups, medicine, and referrals on a regular basis. The Emergency Medical Fund offers financial assistance for critical treatments to those who would otherwise be unable to afford vital healthcare.
            </p>
            <p className="mb-3">
              The Maternal Health Initiative supports pregnant women throughout their journey with prenatal care, safe delivery services, and postnatal follow-ups to reduce maternal and infant mortality. Our Vaccination Drives organize immunization campaigns for children and vulnerable populations in remote areas, protecting communities from preventable diseases.
            </p>
            <p className="mb-3">
              Through Medical Equipment Donations, we provide essential tools and technology to rural health centers and clinics, improving their capacity to serve patients. Health Education workshops in communities cover preventive healthcare, nutrition, hygiene, and common disease management, empowering people to take charge of their wellbeing.
            </p>
            <p className="mb-3">
              Our Specialist Consultation Camps bring medical specialists like cardiologists, ophthalmologists, and gynecologists to rural areas where such expertise is rarely available. The Dialysis Support Program provides financial and logistical assistance for patients requiring regular dialysis treatment. We also offer Mental Health Services through counseling and support groups, particularly in post-disaster contexts, and provide mobility aids and adaptive equipment through our Disability Support program.
            </p>
            
            <div className="mt-4 text-center">
              <button className="btn btn-success px-4 py-2" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
                See All Projects
              </button>
            </div>
          </div>
        );
      case 'education-training':
        return (
          <div>
            <p className="mb-3">
              Education and training form a cornerstone of Hope Harvest's mission to create sustainable change. Our Scholarship Programs provide financial support for underprivileged students at all levels from primary school to university, ensuring that economic barriers don't prevent talented students from advancing their education.
            </p>
            <p className="mb-3">
              Through School Infrastructure projects, we build and renovate classrooms, libraries, and sanitation facilities in rural schools, creating conducive learning environments. Digital Learning Centers equipped with computers and internet access help bridge the digital divide in underserved communities, providing crucial technology skills for the modern economy.
            </p>
            <p className="mb-3">
              Our Teacher Training initiatives provide professional development for educators in rural schools, improving the quality of education through enhanced teaching methodologies and subject knowledge. The School Supply Distribution program ensures students have essential learning materials like textbooks, stationery, and school bags, removing practical barriers to education.
            </p>
            <p className="mb-3">
              Adult Literacy Programs offer basic education for those who missed formal schooling, focusing on functional literacy and numeracy skills that improve quality of life and economic opportunities. Our Vocational Training courses provide practical skills in high-demand trades such as electrical work, plumbing, construction, and hospitality, creating direct pathways to employment. Mobile Libraries bring books and reading programs to remote areas, while After-School Programs support struggling students with additional tutoring and mentorship.
            </p>
            
            <div className="mt-4 text-center">
              <button className="btn btn-success px-4 py-2" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
                See All Projects
              </button>
            </div>
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
            {menuItems.find(item => item.id === activeItem)?.label} Projects
          </h5>
          <hr />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProjectsContentLayout;