package hope.harvest.event_volunteer.dto.volunteer;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class VolunteerUpdateRequestDTO {
    private UUID volunteerId;
    private String phoneNumber;
    private String email;
    private String addressCity;
    private String addressPostalCode;
    private String addressDistrict;
    private List<String> skills;
    private List<String> interests;
    private Boolean availability;
    private String status;

    public VolunteerUpdateRequestDTO() {

    }

    public VolunteerUpdateRequestDTO(UUID volunteerId,String phoneNumber, String email, String addressCity, String addressPostalCode, String addressDistrict, List<String> skills, List<String> interests, Boolean availability, String status) {
        this.volunteerId = volunteerId;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.addressCity = addressCity;
        this.addressPostalCode = addressPostalCode;
        this.addressDistrict = addressDistrict;
        this.skills = skills;
        this.interests = interests;
        this.availability = availability;
        this.status = status;
    }

    public UUID getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(UUID volunteerId) {
        this.volunteerId = volunteerId;
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
}
