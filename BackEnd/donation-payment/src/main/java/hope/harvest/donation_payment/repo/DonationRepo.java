package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DonationRepo extends JpaRepository<Donation, UUID> {

}
