import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./applyfund.css";

// Enhanced theme styles with green and white combination - innovative layout
const styles = {
  mainContainer: {
    background: "linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)",
    minHeight: "100vh",
    paddingTop: "2rem",
    paddingBottom: "2rem",
  },
  heroSection: {
    background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
    borderRadius: "25px",
    padding: "4rem 2rem",
    color: "white",
    marginBottom: "3rem",
    position: "relative",
    overflow: "hidden",
    textAlign: "center",
  },
  heroPattern: {
    position: "absolute",
    top: "-50px",
    right: "-50px",
    opacity: 0.1,
    fontSize: "20rem",
    transform: "rotate(-15deg)",
  },
  stepCard: {
    background: "white",
    borderRadius: "20px",
    padding: "2rem",
    margin: "1rem 0",
    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
    border: "3px solid transparent",
    transition: "all 0.4s ease",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  activeStepCard: {
    borderColor: "#4CAF50",
    transform: "translateY(-10px)",
    boxShadow: "0 20px 60px rgba(76, 175, 80, 0.3)",
  },
  stepNumber: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: "0 auto 1rem",
    position: "relative",
    zIndex: 2,
  },
  inactiveStepNumber: {
    background: "#e0e0e0",
    color: "#666",
  },
  stepTitle: {
    color: "#2E7D32",
    fontWeight: "700",
    fontSize: "1.5rem",
    marginBottom: "1rem",
    textAlign: "center",
  },
  stepContent: {
    color: "#333",
    lineHeight: "1.7",
    fontSize: "1rem",
  },
  navigationDots: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginBottom: "3rem",
  },
  dot: {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    background: "#e0e0e0",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeDot: {
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    transform: "scale(1.3)",
  },
  applyButton: {
    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
    border: "none",
    borderRadius: "50px",
    padding: "20px 50px",
    color: "white",
    fontWeight: "700",
    fontSize: "1.3rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 30px rgba(76, 175, 80, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "2px",
  },
  progressBar: {
    width: "100%",
    height: "6px",
    background: "#e0e0e0",
    borderRadius: "3px",
    marginBottom: "2rem",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #4CAF50, #81c784)",
    borderRadius: "3px",
    transition: "width 0.5s ease",
  },
  cardIcon: {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "2rem",
    color: "#e8f5e9",
    transition: "all 0.3s ease",
  },
  activeCardIcon: {
    color: "#4CAF50",
    transform: "scale(1.2)",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  statCard: {
    background: "linear-gradient(135deg, #66BB6A 0%, #43A047 100%)",
    color: "white",
    borderRadius: "15px",
    padding: "1.5rem",
    textAlign: "center",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
};

const ApplyFundsLayout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = [
    {
      id: "introduction",
      title: "Introduction",
      icon: "fas fa-info-circle",
      content: [
        "Hope Harvest's Fund Application program is designed to provide financial assistance to individuals and families facing difficult circumstances. Our fund aims to help those experiencing financial hardship due to unexpected life events, medical emergencies, natural disasters, or other challenging situations that require immediate support. We believe in empowering communities by providing timely assistance that can help individuals overcome temporary setbacks and regain financial stability.",
        "The program operates with full transparency and fairness, ensuring that funds reach those with genuine needs. We carefully evaluate each application through a structured process that includes documentation review and in-person verification by our trained volunteers. Our goal is to provide assistance that makes a meaningful difference in applicants' lives while maintaining accountability to our donors and stakeholders.",
        "Financial support is available for various purposes including medical treatments, educational expenses, basic necessities during emergencies, housing assistance, and recovery from natural disasters. The amount of assistance varies based on individual circumstances, available resources, and the nature of the need. While we cannot guarantee approval for all applications, we strive to help as many eligible applicants as possible within our available resources.",
        "Beyond providing immediate financial relief, we aim to connect applicants with additional resources and support services that can help address their longer-term needs. Our approach is holistic, recognizing that financial difficulties are often part of larger challenges that require comprehensive support. Through this program, we hope to not only alleviate immediate financial pressure but also contribute to more sustainable improvements in applicants' situations.",
      ],
    },
    {
      id: "requirements",
      title: "Requirements",
      icon: "fas fa-clipboard-list",
      content: [
        "To apply for financial assistance from Hope Harvest, applicants must meet several basic eligibility criteria. First, applicants must be residents of Bangladesh and facing demonstrable financial hardship that they cannot address through their own resources or existing support systems. The need should be genuine and verifiable, with supporting documentation that can confirm both the applicant's identity and their current situation.",
        "Required documentation includes a valid National ID card or passport for identity verification, proof of residence such as utility bills or rental agreements, and evidence of financial hardship. Depending on the nature of the request, applicants may need to provide additional documentation such as medical reports and bills for healthcare-related requests, school fee statements for educational support, or proof of damage for disaster recovery assistance. All documents should be recent and clearly legible.",
        "Applicants must also provide accurate contact information including a current phone number and address to facilitate communication and verification visits. Bank account details are required for fund disbursement, including account holder name, account number, bank name, and branch information. If the applicant does not have a bank account, alternative arrangements can be discussed during the application process.",
        "While we aim to help as many people as possible, there are some limitations to our funding capabilities. Generally, we cannot provide assistance to the same individual or family more than once within a 12-month period unless under extraordinary circumstances. The amount of assistance is capped based on the type of need, with higher limits for medical emergencies and lower limits for other categories. All applications are evaluated based on the severity of need, potential impact of assistance, and available resources at the time of application.",
      ],
    },
    {
      id: "verification",
      title: "Verification Process",
      icon: "fas fa-search",
      content: [
        "Once a fund application is submitted, it undergoes a thorough verification process to ensure the legitimacy of the request and fair distribution of resources. Initially, our administrative team conducts a preliminary review of the application to verify that all required information and documentation have been provided. Incomplete applications are returned to the applicant with instructions for providing the missing information before proceeding further.",
        "After the preliminary review, applications that meet the basic requirements move to the document verification phase. During this stage, our team validates the authenticity of submitted documents by cross-referencing information and contacting issuing institutions when necessary. For medical requests, we may consult with healthcare professionals to understand the necessity and estimated costs of treatments.",
        "A crucial component of our verification process is the in-person verification visit. A trained volunteer from Hope Harvest visits the applicant's residence to assess their living conditions, verify the information provided in the application, and gather additional context about their situation. This visit helps us understand the full scope of the need and ensures that our assistance will be effectively utilized. The volunteer submits a detailed report with observations and recommendations based on their visit.",
        "Following the verification visit, a committee reviews the complete application, including the volunteer's report and all supporting documentation. The committee makes a decision based on the verified need, alignment with our funding criteria, and available resources. Applicants are notified of the decision via phone call and formal letter, with approved applications proceeding to the fund disbursement phase. For applications that cannot be approved, we provide clear explanations and, when possible, suggest alternative resources or support options.",
      ],
    },
    {
      id: "fund-reception",
      title: "Fund Reception",
      icon: "fas fa-money-check",
      content: [
        "Once an application is approved, Hope Harvest initiates the fund disbursement process to ensure that beneficiaries receive assistance promptly and securely. Our primary method of disbursement is direct bank transfer to the applicant's provided account. This method ensures a secure transaction with proper documentation and traceability. Typically, funds are transferred within 3-5 business days after approval, and the applicant receives an SMS notification when the transfer is complete.",
        "For applicants without bank accounts, we offer alternative disbursement methods. In some cases, we can arrange disbursement through mobile financial services like bKash, Nagad, or Rocket, which are widely accessible across Bangladesh. For those without access to mobile banking, we may coordinate with local bank branches to enable cash pickup using proper identification. In exceptional cases where neither bank transfers nor mobile financial services are feasible, we may deliver assistance directly through designated Hope Harvest representatives.",
        "For certain types of assistance, especially medical treatments, educational fees, or specific purchases, Hope Harvest may choose to make direct payments to service providers rather than transferring money to the applicant. This approach ensures that funds are used for their intended purpose and often allows us to negotiate better rates or payment plans with providers. In such cases, we coordinate closely with both the applicant and the service provider to arrange the payment process.",
        "After receiving funds, beneficiaries are requested to provide documentation confirming the use of funds for the stated purpose. This might include medical receipts, fee payment acknowledgments, or purchase receipts. Additionally, our team conducts follow-up assessments in some cases to understand the impact of the assistance and gather feedback for improving our services. These follow-ups help us measure our effectiveness and ensure accountability while also identifying any additional support the beneficiary might need.",
      ],
    },
  ];

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const handleApplyNowClick = () => {
    navigate("/fund-application-form");
  };

  const handleCardHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
      e.currentTarget.style.boxShadow = "0 15px 50px rgba(76, 175, 80, 0.2)";
    } else if (e.currentTarget !== document.querySelector(".active-card")) {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)";
    }
  };

  const handleButtonHover = (e, isHover) => {
    if (isHover) {
      e.target.style.transform = "translateY(-3px) scale(1.05)";
      e.target.style.boxShadow = "0 12px 40px rgba(76, 175, 80, 0.6)";
    } else {
      e.target.style.transform = "translateY(0) scale(1)";
      e.target.style.boxShadow = "0 8px 30px rgba(76, 175, 80, 0.4)";
    }
  };

  return (
    <div style={styles.mainContainer}>
      <div className="container">
        {/* Hero Section */}
        <div style={styles.heroSection}>
          <i className="fas fa-hand-holding-usd" style={styles.heroPattern}></i>
          <h1 className="display-3 fw-bold mb-4">
            Financial Support Application
          </h1>
          <p className="lead mb-4" style={{ fontSize: "1.3rem" }}>
            A transparent, step-by-step process to help those in need access
            financial assistance
          </p>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <h3>24/7</h3>
              <p className="mb-0">Support Available</p>
            </div>
            <div style={styles.statCard}>
              <h3>3-5 Days</h3>
              <p className="mb-0">Processing Time</p>
            </div>
            <div style={styles.statCard}>
              <h3>100%</h3>
              <p className="mb-0">Transparent</p>
            </div>
            <div style={styles.statCard}>
              <h3>24 Months</h3>
              <p className="mb-0">Follow-up Support</p>
            </div>
          </div>{" "}
        </div>

        {/* Quick Access Cards */}
        <div className="row mb-4">
          <div className="col-12">
            <h4
              className="text-center mb-4"
              style={{ color: "#2E7D32", fontWeight: "700" }}
            >
              Choose Your Step
            </h4>
          </div>
          {steps.map((step, index) => (
            <div key={step.id} className="col-md-6 col-lg-3 mb-3">
              <div
                style={{
                  background:
                    index === activeStep
                      ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                      : "white",
                  color: index === activeStep ? "white" : "#333",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
                  border: index === activeStep ? "none" : "2px solid #e8f5e9",
                  textAlign: "center",
                }}
                onClick={() => handleStepClick(index)}
                onMouseEnter={(e) => {
                  if (index !== activeStep) {
                    e.currentTarget.style.backgroundColor = "#e8f5e9";
                    e.currentTarget.style.transform = "translateY(-5px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== activeStep) {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <i
                  className={step.icon}
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                ></i>
                <h6 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                  {step.title}
                </h6>
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
              width: `${((activeStep + 1) / steps.length) * 100}%`,
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
                ...(index === activeStep ? styles.activeDot : {}),
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
                ...(activeStep >= 0 ? styles.activeStepCard : {}),
              }}
              className="active-card"
              onMouseEnter={(e) => handleCardHover(e, true)}
              onMouseLeave={(e) => handleCardHover(e, false)}
            >
              <i
                className={steps[activeStep]?.icon}
                style={{
                  ...styles.cardIcon,
                  ...(activeStep >= 0 ? styles.activeCardIcon : {}),
                }}
              ></i>
              <div
                style={{
                  ...styles.stepNumber,
                }}
              >
                {activeStep + 1}
              </div>
              <h3 style={styles.stepTitle}>{steps[activeStep]?.title}</h3>
              <div style={styles.stepContent}>
                {steps[activeStep]?.content.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-3"
                    style={{ textAlign: "justify" }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="row mt-4">
          <div className="col-12 text-center">
            <div className="d-flex justify-content-center gap-3 mb-4">
              {activeStep > 0 && (
                <button
                  className="btn btn-outline-success btn-lg px-4"
                  onClick={() => handleStepClick(activeStep - 1)}
                  style={{
                    borderRadius: "25px",
                    borderColor: "#4CAF50",
                    color: "#4CAF50",
                  }}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Previous
                </button>
              )}
              {activeStep < steps.length - 1 ? (
                <button
                  className="btn btn-success btn-lg px-4"
                  onClick={() => handleStepClick(activeStep + 1)}
                  style={{
                    borderRadius: "25px",
                    background:
                      "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    border: "none",
                  }}
                >
                  Next
                  <i className="fas fa-arrow-right ms-2"></i>
                </button>
              ) : (
                <button
                  style={styles.applyButton}
                  onMouseEnter={(e) => handleButtonHover(e, true)}
                  onMouseLeave={(e) => handleButtonHover(e, false)}
                  onClick={handleApplyNowClick}
                >
                  <i className="fas fa-file-alt me-2"></i>
                  Apply Now
                </button>
              )}{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyFundsLayout;
