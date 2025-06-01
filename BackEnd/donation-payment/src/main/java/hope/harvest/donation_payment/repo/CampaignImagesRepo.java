package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.CampaignImages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampaignImagesRepo extends JpaRepository<CampaignImages,Long> {

}
