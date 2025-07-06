package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {
    List<Event> findByExternalCampaignId(UUID externalCampaignId);
}
