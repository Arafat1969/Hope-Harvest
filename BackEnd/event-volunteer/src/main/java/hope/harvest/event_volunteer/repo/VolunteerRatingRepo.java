package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.VolunteerRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRatingRepo extends JpaRepository<VolunteerRating,Long> {

}
