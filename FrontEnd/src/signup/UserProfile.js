import React from 'react';

const styles = {
  profileContainer: {
    padding: "3rem 0"
  },
  sectionHeading: {
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: "2rem",
    textAlign: "center"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    padding: "2rem"
  },
  profileImage: {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    backgroundColor: "#e8f5e9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "3.5rem",
    color: "#4CAF50",
    margin: "0 auto 1rem"
  },
  fieldLabel: {
    color: "#616161",
    fontWeight: "500",
    marginBottom: "0.5rem"
  },
  fieldValue: {
    color: "#212121",
    marginBottom: "1.5rem",
    fontSize: "1.1rem"
  }
};

const UserProfile = ({ user = {} }) => {
  // Use provided user data or fallback to defaults
  const userData = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "+8801761837226",
    city: user.city || "Dhaka",
    postalCode: user.postalCode || "",
    country: user.country || ""
  };

  return (
    <div className="container" style={styles.profileContainer}>
      <h2 style={styles.sectionHeading}>User Profile</h2>
      
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div style={styles.card}>
            <div className="row">
              {/* Left Column - Profile Image */}
              <div className="col-md-4 text-center">
                <div style={styles.profileImage}>
                  {userData.firstName.charAt(0) + userData.lastName.charAt(0)}
                </div>
                <h4 className="mb-3">{userData.firstName} {userData.lastName}</h4>
              </div>
              
              {/* Right Column - Personal Information */}
              <div className="col-md-8">
                <div className="row">
                  <div className="col-md-6">
                    <p style={styles.fieldLabel}>First Name</p>
                    <p style={styles.fieldValue}>{userData.firstName}</p>
                  </div>
                  <div className="col-md-6">
                    <p style={styles.fieldLabel}>Last Name</p>
                    <p style={styles.fieldValue}>{userData.lastName}</p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <p style={styles.fieldLabel}>Email</p>
                    <p style={styles.fieldValue}>{userData.email}</p>
                  </div>
                  <div className="col-md-6">
                    <p style={styles.fieldLabel}>Phone Number</p>
                    <p style={styles.fieldValue}>{userData.phoneNumber}</p>
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-12">
                    <p style={styles.fieldLabel}>Address</p>
                    <p style={styles.fieldValue}>
                      {userData.city}, {userData.postalCode}<br />
                      {userData.country}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;