package hope.harvest.event_volunteer.dto.volunteer;

import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class VolunteerRegistrationRequestDTO {
    private UUID externalUserId;
    private String nationalId;
    private String phoneNumber;
    private String email;
    private String addressCity;
    private String addressPostalCode;
    private String addressDistrict;
    private List<String> skills;
    private List<String> interests;

    public VolunteerRegistrationRequestDTO() {

    }

    public VolunteerRegistrationRequestDTO(UUID externalUserId, String nationalId, String phoneNumber, String email, String addressCity, String addressPostalCode, String addressDistrict, List<String> skills, List<String> interests) {
        this.externalUserId = externalUserId;
        this.nationalId = nationalId;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.addressCity = addressCity;
        this.addressPostalCode = addressPostalCode;
        this.addressDistrict = addressDistrict;
        this.skills = skills;
        this.interests = interests;
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
}
