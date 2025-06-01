import React, { useState } from 'react';
import './applyfund.css';

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

const ApplyFundsLayout = () => {
  const [activeItem, setActiveItem] = useState('introduction');

  const menuItems = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'verification', label: 'Verification Process' },
    { id: 'fund-reception', label: 'Fund Reception' },
  ];

  const renderContent = () => {
    switch (activeItem) {
      case 'introduction':
        return (
          <div>
            <p className="mb-3">
              Hope Harvest's Fund Application program is designed to provide financial assistance to individuals and families facing difficult circumstances. Our fund aims to help those experiencing financial hardship due to unexpected life events, medical emergencies, natural disasters, or other challenging situations that require immediate support. We believe in empowering communities by providing timely assistance that can help individuals overcome temporary setbacks and regain financial stability.
            </p>
            <p className="mb-3">
              The program operates with full transparency and fairness, ensuring that funds reach those with genuine needs. We carefully evaluate each application through a structured process that includes documentation review and in-person verification by our trained volunteers. Our goal is to provide assistance that makes a meaningful difference in applicants' lives while maintaining accountability to our donors and stakeholders.
            </p>
            <p className="mb-3">
              Financial support is available for various purposes including medical treatments, educational expenses, basic necessities during emergencies, housing assistance, and recovery from natural disasters. The amount of assistance varies based on individual circumstances, available resources, and the nature of the need. While we cannot guarantee approval for all applications, we strive to help as many eligible applicants as possible within our available resources.
            </p>
            <p className="mb-3">
              Beyond providing immediate financial relief, we aim to connect applicants with additional resources and support services that can help address their longer-term needs. Our approach is holistic, recognizing that financial difficulties are often part of larger challenges that require comprehensive support. Through this program, we hope to not only alleviate immediate financial pressure but also contribute to more sustainable improvements in applicants' situations.
            </p>
          </div>
        );
      case 'requirements':
        return (
          <div>
            <p className="mb-3">
              To apply for financial assistance from Hope Harvest, applicants must meet several basic eligibility criteria. First, applicants must be residents of Bangladesh and facing demonstrable financial hardship that they cannot address through their own resources or existing support systems. The need should be genuine and verifiable, with supporting documentation that can confirm both the applicant's identity and their current situation.
            </p>
            <p className="mb-3">
              Required documentation includes a valid National ID card or passport for identity verification, proof of residence such as utility bills or rental agreements, and evidence of financial hardship. Depending on the nature of the request, applicants may need to provide additional documentation such as medical reports and bills for healthcare-related requests, school fee statements for educational support, or proof of damage for disaster recovery assistance. All documents should be recent and clearly legible.
            </p>
            <p className="mb-3">
              Applicants must also provide accurate contact information including a current phone number and address to facilitate communication and verification visits. Bank account details are required for fund disbursement, including account holder name, account number, bank name, and branch information. If the applicant does not have a bank account, alternative arrangements can be discussed during the application process.
            </p>
            <p className="mb-3">
              While we aim to help as many people as possible, there are some limitations to our funding capabilities. Generally, we cannot provide assistance to the same individual or family more than once within a 12-month period unless under extraordinary circumstances. The amount of assistance is capped based on the type of need, with higher limits for medical emergencies and lower limits for other categories. All applications are evaluated based on the severity of need, potential impact of assistance, and available resources at the time of application.
            </p>
          </div>
        );
      case 'verification':
        return (
          <div>
            <p className="mb-3">
              Once a fund application is submitted, it undergoes a thorough verification process to ensure the legitimacy of the request and fair distribution of resources. Initially, our administrative team conducts a preliminary review of the application to verify that all required information and documentation have been provided. Incomplete applications are returned to the applicant with instructions for providing the missing information before proceeding further.
            </p>
            <p className="mb-3">
              After the preliminary review, applications that meet the basic requirements move to the document verification phase. During this stage, our team validates the authenticity of submitted documents by cross-referencing information and contacting issuing institutions when necessary. For medical requests, we may consult with healthcare professionals to understand the necessity and estimated costs of treatments.
            </p>
            <p className="mb-3">
              A crucial component of our verification process is the in-person verification visit. A trained volunteer from Hope Harvest visits the applicant's residence to assess their living conditions, verify the information provided in the application, and gather additional context about their situation. This visit helps us understand the full scope of the need and ensures that our assistance will be effectively utilized. The volunteer submits a detailed report with observations and recommendations based on their visit.
            </p>
            <p className="mb-3">
              Following the verification visit, a committee reviews the complete application, including the volunteer's report and all supporting documentation. The committee makes a decision based on the verified need, alignment with our funding criteria, and available resources. Applicants are notified of the decision via phone call and formal letter, with approved applications proceeding to the fund disbursement phase. For applications that cannot be approved, we provide clear explanations and, when possible, suggest alternative resources or support options.
            </p>
          </div>
        );
      case 'fund-reception':
        return (
          <div>
            <p className="mb-3">
              Once an application is approved, Hope Harvest initiates the fund disbursement process to ensure that beneficiaries receive assistance promptly and securely. Our primary method of disbursement is direct bank transfer to the applicant's provided account. This method ensures a secure transaction with proper documentation and traceability. Typically, funds are transferred within 3-5 business days after approval, and the applicant receives an SMS notification when the transfer is complete.
            </p>
            <p className="mb-3">
              For applicants without bank accounts, we offer alternative disbursement methods. In some cases, we can arrange disbursement through mobile financial services like bKash, Nagad, or Rocket, which are widely accessible across Bangladesh. For those without access to mobile banking, we may coordinate with local bank branches to enable cash pickup using proper identification. In exceptional cases where neither bank transfers nor mobile financial services are feasible, we may deliver assistance directly through designated Hope Harvest representatives.
            </p>
            <p className="mb-3">
              For certain types of assistance, especially medical treatments, educational fees, or specific purchases, Hope Harvest may choose to make direct payments to service providers rather than transferring money to the applicant. This approach ensures that funds are used for their intended purpose and often allows us to negotiate better rates or payment plans with providers. In such cases, we coordinate closely with both the applicant and the service provider to arrange the payment process.
            </p>
            <p className="mb-3">
              After receiving funds, beneficiaries are requested to provide documentation confirming the use of funds for the stated purpose. This might include medical receipts, fee payment acknowledgments, or purchase receipts. Additionally, our team conducts follow-up assessments in some cases to understand the impact of the assistance and gather feedback for improving our services. These follow-ups help us measure our effectiveness and ensure accountability while also identifying any additional support the beneficiary might need.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-4 mb-5">
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
      
      {/* Application button */}
      <div className="row mt-4">
        <div className="col-12 text-center">
          <button className="btn btn-success btn-lg px-5 py-3" style={{ backgroundColor: '#2E7D32', borderColor: '#2E7D32' }}>
            Apply for Funds
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyFundsLayout;