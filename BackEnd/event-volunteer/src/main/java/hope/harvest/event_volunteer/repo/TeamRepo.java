package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepo extends JpaRepository<Team,Long> {
}
