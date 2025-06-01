package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {

}
