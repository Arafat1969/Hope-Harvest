package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;


@Repository
public interface CampaignRepo extends JpaRepository<Campaign, UUID> {

}
