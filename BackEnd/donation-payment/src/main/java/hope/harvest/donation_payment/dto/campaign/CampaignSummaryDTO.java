package hope.harvest.donation_payment.dto.campaign;

import java.math.BigDecimal;
import java.util.UUID;

public class CampaignSummaryDTO {
    private UUID campaignId;
    private String title;
    private String shortDescription;
    private BigDecimal goalAmount;
    private BigDecimal collectedAmount;

    public CampaignSummaryDTO() {}

    public CampaignSummaryDTO(UUID campaignId, String title, String shortDescription,
                              BigDecimal goalAmount, BigDecimal collectedAmount) {
        this.campaignId = campaignId;
        this.title = title;
        this.shortDescription = shortDescription;
        this.goalAmount = goalAmount;
        this.collectedAmount = collectedAmount;
    }

    public UUID getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(UUID campaignId) {
        this.campaignId = campaignId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public BigDecimal getGoalAmount() {
        return goalAmount;
    }

    public void setGoalAmount(BigDecimal goalAmount) {
        this.goalAmount = goalAmount;
    }

    public BigDecimal getCollectedAmount() {
        return collectedAmount;
    }

    public void setCollectedAmount(BigDecimal collectedAmount) {
        this.collectedAmount = collectedAmount;
    }
}
