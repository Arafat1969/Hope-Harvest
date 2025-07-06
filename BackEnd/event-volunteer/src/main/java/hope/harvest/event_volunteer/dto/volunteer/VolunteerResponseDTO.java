package hope.harvest.event_volunteer.dto.volunteer;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class VolunteerResponseDTO {
    private UUID volunteerId;
    private UUID externalUserId;
    private String nationalId;
    private String phoneNumber;
    private String email;
    private String addressCity;
    private String addressPostalCode;
    private String addressDistrict;
    private List<String> skills;
    private List<String> interests;
    private Boolean availability;
    private String status = "ACTIVE";
    private Integer totalHours ;
    private Integer assignmentsCompleted ;
    private BigDecimal averageRating ;

    public VolunteerResponseDTO() {

    }

    public VolunteerResponseDTO(UUID volunteerId, UUID externalUserId, String nationalId, String phoneNumber, String email, String addressCity, String addressPostalCode, String addressDistrict, List<String> skills, List<String> interests, Boolean availability, String status, Integer totalHours, Integer assignmentsCompleted, BigDecimal averageRating) {
        this.volunteerId = volunteerId;
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
}
