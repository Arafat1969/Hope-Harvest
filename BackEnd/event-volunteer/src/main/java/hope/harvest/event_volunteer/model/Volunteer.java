package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;


@Entity(name = "volunteers")
public class Volunteer {
    @Id
    @GeneratedValue
    @Column(name = "volunteer_id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID volunteerId;

    @Column(name = "external_user_id", nullable = false, unique = true, columnDefinition = "UUID")
    private UUID externalUserId;

    @Column(name = "national_id", nullable = false, length = 50)
    private String nationalId;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "email", nullable = false, length = 255)
    private String email;

    @Column(name = "address_city", nullable = false, length = 100)
    private String addressCity;

    @Column(name = "address_postal_code", length = 20)
    private String addressPostalCode;

    @Column(name = "address_district", nullable = false, length = 100)
    private String addressDistrict;

    @Column(name = "skills", columnDefinition = "TEXT")
    private List<String> skills;

    @Column(name = "interests", columnDefinition = "TEXT")
    private List<String> interests;

    @Column(name = "availability")
    private Boolean availability;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";

    @Column(name = "total_hours")
    private Integer totalHours = 0;

    @Column(name = "assignments_completed")
    private Integer assignmentsCompleted = 0;

    @Column(name = "average_rating", columnDefinition = "DECIMAL(3,2)")
    private BigDecimal averageRating;


    public Volunteer() {

    }

    public Volunteer(UUID externalUserId, String nationalId, String phoneNumber, String email, String addressCity, String addressPostalCode, String addressDistrict, List<String> skills, List<String> interests, Boolean availability, String status, Integer totalHours, Integer assignmentsCompleted, BigDecimal averageRating) {
        this.externalUserId = externalUserId;
        this.nationalId = nationalId;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.addressCity = addressCity;
        this.addressPostalCode = addressPostalCode;
        this.addressDistrict = addressDistrict;
        this.skills = skills;
        this.interests = interests;
        this.availability = availability;
        this.status = status;
        this.totalHours = totalHours;
        this.assignmentsCompleted = assignmentsCompleted;
        this.averageRating = averageRating;
    }


    public UUID getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(UUID volunteerId) {
        this.volunteerId = volunteerId;
    }

    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddressCity() {
        return addressCity;
    }

    public void setAddressCity(String addressCity) {
        this.addressCity = addressCity;
    }

    public String getAddressPostalCode() {
        return addressPostalCode;
    }

    public void setAddressPostalCode(String addressPostalCode) {
        this.addressPostalCode = addressPostalCode;
    }

    public String getAddressDistrict() {
        return addressDistrict;
    }

    public void setAddressDistrict(String addressDistrict) {
        this.addressDistrict = addressDistrict;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests;
    }

    public Boolean getAvailability() {
        return availability;
    }

    public void setAvailability(Boolean availability) {
        this.availability = availability;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getTotalHours() {
        return totalHours;
    }

    public void setTotalHours(Integer totalHours) {
        this.totalHours = totalHours;
    }

    public Integer getAssignmentsCompleted() {
        return assignmentsCompleted;
    }

    public void setAssignmentsCompleted(Integer assignmentsCompleted) {
        this.assignmentsCompleted = assignmentsCompleted;
    }

    public BigDecimal getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(BigDecimal averageRating) {
        this.averageRating = averageRating;
    }

    @Override
    public String toString() {
        return "Volunteer{" +
                "volunteerId=" + volunteerId +
                ", externalUserId=" + externalUserId +
                ", nationalId='" + nationalId + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", email='" + email + '\'' +
                ", addressCity='" + addressCity + '\'' +
                ", addressPostalCode='" + addressPostalCode + '\'' +
                ", addressDistrict='" + addressDistrict + '\'' +
                ", skills=" + skills +
                ", interests=" + interests +
                ", availability=" + availability +
                ", status='" + status + '\'' +
                ", totalHours=" + totalHours +
                ", assignmentsCompleted=" + assignmentsCompleted +
                ", averageRating=" + averageRating +
                '}';
    }
}
