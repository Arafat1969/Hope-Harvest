package hope.harvest.event_volunteer.dto.volunteer;

import java.util.UUID;

public class VolunteerSummaryDTO {
    private UUID volunteerId;
    private UUID externalUserId;
    private String email;
    private String phoneNumber;

    public VolunteerSummaryDTO() {}

    public VolunteerSummaryDTO(UUID volunteerId,UUID externalUserId, String email, String phoneNumber) {
        this.volunteerId = volunteerId;
        this.externalUserId = externalUserId;
        this.email = email;
        this.phoneNumber = phoneNumber;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}
