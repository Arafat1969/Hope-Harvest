package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.dto.payment.*;
import hope.harvest.donation_payment.model.Campaign;
import hope.harvest.donation_payment.model.Donation;
import hope.harvest.donation_payment.model.Payment;
import hope.harvest.donation_payment.repo.CampaignRepo;
import hope.harvest.donation_payment.repo.DonationRepo;
import hope.harvest.donation_payment.repo.PaymentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class DonationPaymentService {
    @Autowired
    DonationRepo donationRepo;

    @Autowired
    PaymentRepo paymentRepo;

    @Autowired
    CampaignRepo campaignRepo;



    public DonationResponseDTO makeAnonymousDonation(DonationRequestDTO requestDTO) {

        if ( requestDTO.getExternalUserId() != null) {
            throw new IllegalArgumentException("Non-anonymous donations must have a user ID." +requestDTO.isAnonymous());
        }
        Campaign campaign = campaignRepo.findById(requestDTO.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Donation donation = new Donation();
        donation.setCampaign(campaign);
        donation.setAmount(requestDTO.getAmount());
        donation.setAnonymous(true);
        donation.setStatus("PENDING");
        donation.setPaymentMethod("UNPAID");
        donation.setTransactionID(null);
        donation.setTrackingKey(null);
        donation.setExternalUserID(null);

        donation = donationRepo.save(donation);

        return new DonationResponseDTO(donation.getDonationID(), donation.getAmount());
    }


    public DonationSummaryDTO getAnonymousDonation(String trackingKey) {
        Donation donation = donationRepo.findAll().stream()
                .filter(d -> d.getTrackingKey() != null &&
                        d.getTrackingKey().equals(trackingKey) &&
                        Boolean.TRUE.equals(d.getAnonymous()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No anonymous donation found with the provided tracking key"));


        return new DonationSummaryDTO(
                donation.getDonationID(),
                donation.getCampaign().getTitle(),
                donation.getAmount(),
                donation.getDonationDate(),
                donation.getPaymentMethod(),
                donation.getPaymentMethod(),
                donation.getTransactionID(),
                donation.getTrackingKey()
        );
    }


    public DonationResponseDTO makeDonation(DonationRequestDTO requestDTO) {
        if (requestDTO.getExternalUserId() == null) {
            throw new IllegalArgumentException("External user ID is required");
        }

        if (requestDTO.getCampaignId() == null || requestDTO.getAmount() == null || requestDTO.getAmount().signum() <= 0) {
            throw new IllegalArgumentException("Campaign ID and valid amount are required");
        }

        Campaign campaign = campaignRepo.findById(requestDTO.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Donation donation = new Donation();
        donation.setExternalUserID(requestDTO.getExternalUserId());
        donation.setCampaign(campaign);
        donation.setAmount(requestDTO.getAmount());
        donation.setAnonymous(requestDTO.isAnonymous());
        donation.setStatus("PENDING");

        donation = donationRepo.save(donation);

        return new DonationResponseDTO(donation.getDonationID(), donation.getAmount());
    }


    public DonationSummaryDTO getParticularDonation(UUID donationID) {
        Donation donation = donationRepo.findById(donationID)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        return new DonationSummaryDTO(
                donation.getDonationID(),
                donation.getCampaign().getTitle(),
                donation.getAmount(),
                donation.getDonationDate(),
                donation.getPaymentMethod(),
                donation.getPaymentMethod(), // organizationName not stored
                donation.getTransactionID(),
                donation.getTrackingKey()
        );
    }


    public List<DonationSummaryDTO> getUserDonations(UUID userId) {
        List<Donation> donations = donationRepo.findByExternalUserID(userId);

        return donations.stream()
                .map(donation -> new DonationSummaryDTO(
                        donation.getDonationID(),
                        donation.getCampaign().getTitle(),
                        donation.getAmount(),
                        donation.getDonationDate(),
                        donation.getPaymentMethod(),
                        donation.getPaymentMethod(),
                        donation.getTransactionID(),
                        donation.getTrackingKey()
                ))
                .toList();
    }


    public PaymentInitiateResponseDTO initiatePayment(PaymentInitiateRequestDTO requestDTO) {
        Donation donation = donationRepo.findById(requestDTO.getDonationId())
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (paymentRepo.findByDonation(donation).isPresent()) {
            throw new RuntimeException("Payment already initiated for this donation");
        }

        String otp = String.format("%06d", new Random().nextInt(1_000_000));

        Payment payment = new Payment();
        payment.setDonation(donation);
        payment.setGatewayName(requestDTO.getGatewayName());
        payment.setAmount(requestDTO.getAmount());
        payment.setOtp(otp);
        payment.setStatus("PENDING");

        Payment saved = paymentRepo.save(payment);

        return new PaymentInitiateResponseDTO(saved.getPaymentId(), saved.getOtp(),requestDTO.getOrganizationName());
    }

    @Transactional
    public DonationSummaryDTO verifyPayment(PaymentVerifyRequestDTO requestDTO) {
        Payment payment = paymentRepo.findById(requestDTO.getPaymentId())
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (!payment.getStatus().equals("PENDING")) {
            throw new RuntimeException("Payment already processed");
        }

        if (!payment.getOtp().equals(requestDTO.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        String transactionId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        payment.setStatus("COMPLETED");
        payment.setTransactionId(transactionId);
        paymentRepo.save(payment);

        Donation donation = payment.getDonation();
        donation.setAmount(payment.getAmount());
        donation.setStatus("COMPLETED");
        donation.setTransactionID(transactionId);
        donation.setPaymentMethod(payment.getGatewayName());
        donation.setTrackingKey("TRK-" + donation.getDonationID().toString().substring(0, 8));
        donationRepo.save(donation);


        Campaign campaign = donation.getCampaign();
        campaign.setCollectedAmount(campaign.getCollectedAmount().add(donation.getAmount()));
        campaignRepo.save(campaign);

        return new DonationSummaryDTO(
                donation.getDonationID(),
                donation.getCampaign().getTitle(),
                donation.getAmount(),
                donation.getDonationDate(),
                donation.getPaymentMethod(),
                requestDTO.getOrganizationName(),
                donation.getTransactionID(),
                donation.getTrackingKey()
        );
    }
}
