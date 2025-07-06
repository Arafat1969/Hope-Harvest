package hope.harvest.event_volunteer.repo;

import hope.harvest.event_volunteer.model.FundVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FundVerificationRepo extends JpaRepository<FundVerification, UUID> {
    List<FundVerification> findByAssignedVolunteer_VolunteerId(UUID volunteerId);

    Optional<FundVerification> findByApplication_ApplicationId(UUID applicationId);

}
