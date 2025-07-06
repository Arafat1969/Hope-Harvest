package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.VolunteerRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VolunteerRatingRepo extends JpaRepository<VolunteerRating,Long> {
    List<VolunteerRating> findByVolunteer_VolunteerId(UUID volunteerId);
}
