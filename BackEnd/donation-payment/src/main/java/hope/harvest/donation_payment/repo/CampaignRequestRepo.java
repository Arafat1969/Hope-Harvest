package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.CampaignRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignRequestRepo extends JpaRepository<CampaignRequest, UUID> {
    List<CampaignRequest> findByExternalUserId(UUID externalUserId);

    Optional<CampaignRequest> findByRequestIdAndExternalUserId(UUID requestId, UUID externalUserId);

}
