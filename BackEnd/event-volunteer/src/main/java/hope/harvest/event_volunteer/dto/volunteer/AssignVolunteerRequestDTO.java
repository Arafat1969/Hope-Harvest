package hope.harvest.event_volunteer.dto.volunteer;

import java.util.UUID;

public class AssignVolunteerRequestDTO {
    private UUID volunteerId;

    public AssignVolunteerRequestDTO() {}

    public AssignVolunteerRequestDTO(UUID volunteerId) {
        this.volunteerId = volunteerId;
    }

    public UUID getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(UUID volunteerId) {
        this.volunteerId = volunteerId;
    }
}

