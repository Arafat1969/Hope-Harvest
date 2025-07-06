package hope.harvest.event_volunteer.dto.volunteer;

import java.util.UUID;

public class MemberRatingResponseDTO {
    private Long ratingId;
    private UUID ratedVolunteerId;

    public MemberRatingResponseDTO() {}

    public MemberRatingResponseDTO(Long ratingId, UUID ratedVolunteerId) {
        this.ratingId = ratingId;
        this.ratedVolunteerId = ratedVolunteerId;
    }

    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

    public UUID getRatedVolunteerId() {
        return ratedVolunteerId;
    }

    public void setRatedVolunteerId(UUID ratedVolunteerId) {
        this.ratedVolunteerId = ratedVolunteerId;
    }

}
