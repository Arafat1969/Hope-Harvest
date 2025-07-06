package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.FundApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FundApplicationRepo extends JpaRepository<FundApplication, UUID> {
    List<FundApplication> findByExternalUserId(UUID externalUserId);
}
