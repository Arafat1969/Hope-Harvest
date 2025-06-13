package hope.harvest.donation_payment.dto.adminCampaign;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class CampaignResponseDTO {
    private UUID campaignId;
    private String title;
    private BigDecimal goalAmount;
    private BigDecimal collectedAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;

    public CampaignResponseDTO() {}

    public CampaignResponseDTO(UUID campaignId, String title, BigDecimal goalAmount, BigDecimal collectedAmount,
                               LocalDate startDate, LocalDate endDate, String status) {
        this.campaignId = campaignId;
        this.title = title;
        this.goalAmount = goalAmount;
        this.collectedAmount = collectedAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
