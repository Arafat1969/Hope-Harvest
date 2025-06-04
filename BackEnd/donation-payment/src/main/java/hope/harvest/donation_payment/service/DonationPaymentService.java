package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.dto.payment.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DonationPaymentService {
    public DonationResponseDTO makeAnonymousDonation(DonationRequestDTO requestDTO) {

        return null;
    }

    public DonationSummaryDTO getAnonymousDonation(String trackingKey) {
        return  null;
    }

    public DonationResponseDTO makeDonation(DonationRequestDTO requestDTO) {
        return null;
    }

    public DonationSummaryDTO getParticularDonation(UUID donationID) {
        return null;
    }

    public List<DonationSummaryDTO> getUserDonations(UUID userId) {
        return null;
    }

    public PaymentInitiateResponseDTO initiatePayment(PaymentInitiateRequestDTO requestDTO) {
        return  null;
    }

    public DonationSummaryDTO verifyPayment(UUID paymentId, String otp) {
        return null;
    }
}
