package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.Campaign;
import hope.harvest.donation_payment.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DonationRepo extends JpaRepository<Donation, UUID> {
    List<Donation> findByStatus(String status);
    List<Donation> findByCampaignAndStatus(Campaign campaign, String status);

    List<Donation> findByCampaign_CampaignIDAndExternalUserID(UUID campaignId, UUID userId);

    List<Donation> findByExternalUserID(UUID userId);

}
