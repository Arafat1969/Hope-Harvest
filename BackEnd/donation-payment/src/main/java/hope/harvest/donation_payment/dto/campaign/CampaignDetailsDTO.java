package hope.harvest.donation_payment.dto.campaign;

import java.math.BigDecimal;
import java.util.UUID;

public class CampaignDetailsDTO {
    private UUID campaignId;
    private String title;
    private String description;
    private String details;
    private BigDecimal goalAmount;
    private BigDecimal collectedAmount;
    private String expectedImpact;
    private CampaignCategoryDTO category;

    public CampaignDetailsDTO() {}

    public CampaignDetailsDTO(UUID campaignId, String title, String description, String details,
                              BigDecimal goalAmount, BigDecimal collectedAmount, String expectedImpact,
                              CampaignCategoryDTO category) {
        this.campaignId = campaignId;
        this.title = title;
        this.description = description;
        this.details = details;
        this.goalAmount = goalAmount;
        this.collectedAmount = collectedAmount;
        this.expectedImpact = expectedImpact;
        this.category = category;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
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

    public String getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(String expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    public CampaignCategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CampaignCategoryDTO category) {
        this.category = category;
    }
}
