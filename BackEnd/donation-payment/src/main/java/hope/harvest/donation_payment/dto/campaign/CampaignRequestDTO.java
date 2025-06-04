package hope.harvest.donation_payment.dto.campaign;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class CampaignRequestDTO {
    private UUID externalUserId;
    private String title;
    private String description;
    private BigDecimal goal;
    private UUID categoryId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String expectedImpact;
    private String proposerPhone;
    private String proposerEmail;
    private String status; // Should be defaulted to "PENDING" on server

    public CampaignRequestDTO() {
        this.status = "PENDING";
    }

    public CampaignRequestDTO(UUID externalUserId, String title, String description, BigDecimal goal,
                              UUID categoryId, LocalDate startDate, LocalDate endDate,
                              String expectedImpact, String proposerPhone, String proposerEmail) {
        this.externalUserId = externalUserId;
        this.title = title;
        this.description = description;
        this.goal = goal;
        this.categoryId = categoryId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expectedImpact = expectedImpact;
        this.proposerPhone = proposerPhone;
        this.proposerEmail = proposerEmail;
        this.status = "PENDING";
    }

    // Getters and Setters

    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
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

    public BigDecimal getGoal() {
        return goal;
    }

    public void setGoal(BigDecimal goal) {
        this.goal = goal;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
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

    public String getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(String expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    public String getProposerPhone() {
        return proposerPhone;
    }

    public void setProposerPhone(String proposerPhone) {
        this.proposerPhone = proposerPhone;
    }

    public String getProposerEmail() {
        return proposerEmail;
    }

    public void setProposerEmail(String proposerEmail) {
        this.proposerEmail = proposerEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
