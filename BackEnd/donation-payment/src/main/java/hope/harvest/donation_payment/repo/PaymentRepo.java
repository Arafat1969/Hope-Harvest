package hope.harvest.donation_payment.repo;

import hope.harvest.donation_payment.model.Donation;
import hope.harvest.donation_payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByDonation(Donation donation);
}
