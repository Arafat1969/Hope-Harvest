package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.util.UUID;

public class DonationUsageDTO {

    private UUID donationId;
    private UUID campaignId;
    private UUID categoryId;
    private BigDecimal amount;
    private String description;

    public DonationUsageDTO() {}

    public DonationUsageDTO(UUID donationId, UUID campaignId, UUID categoryId, BigDecimal amount, String description) {
        this.donationId = donationId;
        this.campaignId = campaignId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.description = description;
    }

    public UUID getDonationId() {
        return donationId;
    }

    public void setDonationId(UUID donationId) {
        this.donationId = donationId;
    }

    public UUID getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(UUID campaignId) {
        this.campaignId = campaignId;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
