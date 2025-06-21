package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.model.*;
import hope.harvest.donation_payment.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AdminDonationService {
    @Autowired
    DonationRepo donationRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private CampaignRepo campaignRepo;

    @Autowired
    private CampaignCategoryRepo campaignCategoryRepo;

    @Autowired
    private DonationUsageRepo donationUsageRepo;

    public List<DonationSummaryDTO> getAllDonations() {
        List<Donation> completedDonations = donationRepo.findByStatus("COMPLETED");

        return completedDonations.stream()
                .map(donation -> {
                    String organizationName = "";
                    Optional<Payment> paymentResponse = paymentRepo.findByDonation(donation);

                    if (paymentResponse.isPresent()) {
                        organizationName = paymentResponse.get().getGatewayName();
                    }

                    return new DonationSummaryDTO(
                            donation.getDonationID(),
                            donation.getCampaign().getTitle(),
                            donation.getAmount(),
                            donation.getDonationDate(),
                            donation.getPaymentMethod(),
                            organizationName,
                            donation.getTransactionID(),
                            donation.getTrackingKey()
                    );
                })
                .toList();
    }


    public DonationDetailsDTO getDonationByDonationId(UUID donationId) {
        Donation donation = donationRepo.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));


        return new DonationDetailsDTO(
                donation.getDonationID(),
                donation.getExternalUserID(),
                donation.getCampaign().getTitle(),
                donation.getAmount(),
                donation.getDonationDate(),
                donation.getStatus(),
                donation.getPaymentMethod(),
                donation.getTransactionID(),
                donation.getTrackingKey()
        );
    }


    public List<DonationSummaryDTO> getDonationsByCampaign(UUID campaignId) {
        Campaign campaign = campaignRepo.findById(campaignId)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        List<Donation> donations = donationRepo.findByCampaignAndStatus(campaign, "COMPLETED");

        return donations.stream()
                .map(donation -> new DonationSummaryDTO(
                        donation.getDonationID(),
                        campaign.getTitle(),
                        donation.getAmount(),
                        donation.getDonationDate(),
                        donation.getPaymentMethod(),
                        null, // organizationName not stored
                        donation.getTransactionID(),
                        donation.getTrackingKey()
                ))
                .toList();
    }


    public DonationUsageDTO recordDonationUsage(UUID donationId, DonationUsageDTO dto) {
        Donation donation = donationRepo.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        Campaign campaign = campaignRepo.findById(dto.getCampaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        CampaignCategory category = campaignCategoryRepo.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Campaign category not found"));

        DonationUsage usage = new DonationUsage();
        usage.setDonation(donation);
        usage.setCampaign(campaign);
        usage.setCampaignCategory(category);
        usage.setAmount(dto.getAmount());
        usage.setDescription(dto.getDescription());

        usage = donationUsageRepo.save(usage);


        DonationUsageDTO responseDTO = new DonationUsageDTO();
        responseDTO.setDonationId(donation.getDonationID());
        responseDTO.setCampaignId(campaign.getCampaignID());
        responseDTO.setCategoryId(category.getCategoryID());
        responseDTO.setAmount(usage.getAmount());
        responseDTO.setDescription(usage.getDescription());

        return responseDTO;
    }


    public DonationStatisticsDTO getDonationStatistics() {
        List<Donation> allDonations = donationRepo.findAll();

        int total = allDonations.size();
        int successful = 0;
        int failed = 0;
        int pending = 0;

        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal successfulAmount = BigDecimal.ZERO;
        BigDecimal failedAmount = BigDecimal.ZERO;
        BigDecimal pendingAmount = BigDecimal.ZERO;

        Map<String, CampaignDonationStatsDTO> campaignStatsMap = new HashMap<>();

        for (Donation donation : allDonations) {
            BigDecimal amount = donation.getAmount();
            totalAmount = totalAmount.add(amount);

            String status = donation.getStatus();
            String campaignTitle = donation.getCampaign().getTitle();


            switch (status.toUpperCase()) {
                case "COMPLETED" -> {
                    successful++;
                    successfulAmount = successfulAmount.add(amount);
                }
                case "FAILED" -> {
                    failed++;
                    failedAmount = failedAmount.add(amount);
                }
                case "PENDING" -> {
                    pending++;
                    pendingAmount = pendingAmount.add(amount);
                }
            }

            campaignStatsMap.putIfAbsent(
                    campaignTitle,
                    new CampaignDonationStatsDTO(campaignTitle, 0, BigDecimal.ZERO)
            );

            CampaignDonationStatsDTO stat = campaignStatsMap.get(campaignTitle);
            stat.setTotalDonations(stat.getTotalDonations() + 1);
            stat.setTotalAmount(stat.getTotalAmount().add(amount));
        }

        return new DonationStatisticsDTO(
                total,
                totalAmount,
                successful,
                failed,
                pending,
                successfulAmount,
                failedAmount,
                pendingAmount,
                new ArrayList<>(campaignStatsMap.values())
        );
    }

}
