package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;

public class CampaignDonationStatsDTO {

    private String campaignTitle;
    private int totalDonations;
    private BigDecimal totalAmount;

    public CampaignDonationStatsDTO() {}

    public CampaignDonationStatsDTO(String campaignTitle, int totalDonations, BigDecimal totalAmount) {
        this.campaignTitle = campaignTitle;
        this.totalDonations = totalDonations;
        this.totalAmount = totalAmount;
    }


    public String getCampaignTitle() {
        return campaignTitle;
    }

    public void setCampaignTitle(String campaignTitle) {
        this.campaignTitle = campaignTitle;
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
}
