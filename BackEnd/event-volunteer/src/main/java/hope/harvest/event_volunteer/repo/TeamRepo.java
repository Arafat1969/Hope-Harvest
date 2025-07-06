package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepo extends JpaRepository<Team,Long> {
    Optional<Team> findByEvent_EventId(Long eventId);

}
