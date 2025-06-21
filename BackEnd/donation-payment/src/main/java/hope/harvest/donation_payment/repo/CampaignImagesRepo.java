package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.Campaign;
import hope.harvest.donation_payment.model.CampaignImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CampaignImagesRepo extends JpaRepository<CampaignImages,Long> {
    Optional<CampaignImages> findByCampaign(Campaign campaign);

    Optional<CampaignImages> findByCampaign_CampaignID(UUID campaignID);
}
