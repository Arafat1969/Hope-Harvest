package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.EventImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventImagesRepo extends JpaRepository<EventImages,Long> {

}
