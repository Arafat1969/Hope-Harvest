package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.util.List;

public class DonationStatisticsDTO {

    private int totalDonations;
    private BigDecimal totalAmount;
    private int successfulDonations;
    private int failedDonations;
    private int pendingDonations;
    private BigDecimal successfulAmount;
    private BigDecimal failedAmount;
    private BigDecimal pendingAmount;

    private List<CampaignDonationStatsDTO> donationsPerCampaign;

    public DonationStatisticsDTO() {}

    public DonationStatisticsDTO(int totalDonations, BigDecimal totalAmount, int successfulDonations, int failedDonations,
                                 int pendingDonations, BigDecimal successfulAmount, BigDecimal failedAmount,
                                 BigDecimal pendingAmount, List<CampaignDonationStatsDTO> donationsPerCampaign) {
        this.totalDonations = totalDonations;
        this.totalAmount = totalAmount;
        this.successfulDonations = successfulDonations;
        this.failedDonations = failedDonations;
        this.pendingDonations = pendingDonations;
        this.successfulAmount = successfulAmount;
        this.failedAmount = failedAmount;
        this.pendingAmount = pendingAmount;
        this.donationsPerCampaign = donationsPerCampaign;
    }


    public int getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(int totalDonations) {
        this.totalDonations = totalDonations;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getSuccessfulDonations() {
        return successfulDonations;
    }

    public void setSuccessfulDonations(int successfulDonations) {
        this.successfulDonations = successfulDonations;
    }

    public int getFailedDonations() {
        return failedDonations;
    }

    public void setFailedDonations(int failedDonations) {
        this.failedDonations = failedDonations;
    }

    public int getPendingDonations() {
        return pendingDonations;
    }

    public void setPendingDonations(int pendingDonations) {
        this.pendingDonations = pendingDonations;
    }

    public BigDecimal getSuccessfulAmount() {
        return successfulAmount;
    }

    public void setSuccessfulAmount(BigDecimal successfulAmount) {
        this.successfulAmount = successfulAmount;
    }

    public BigDecimal getFailedAmount() {
        return failedAmount;
    }

    public void setFailedAmount(BigDecimal failedAmount) {
        this.failedAmount = failedAmount;
    }

    public BigDecimal getPendingAmount() {
        return pendingAmount;
    }

    public void setPendingAmount(BigDecimal pendingAmount) {
        this.pendingAmount = pendingAmount;
    }

    public List<CampaignDonationStatsDTO> getDonationsPerCampaign() {
        return donationsPerCampaign;
    }

    public void setDonationsPerCampaign(List<CampaignDonationStatsDTO> donationsPerCampaign) {
        this.donationsPerCampaign = donationsPerCampaign;
    }
}
