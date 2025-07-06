package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.Volunteer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface VolunteerRepo extends JpaRepository<Volunteer, UUID> {
    boolean existsByExternalUserId(UUID externalUserId);
}
