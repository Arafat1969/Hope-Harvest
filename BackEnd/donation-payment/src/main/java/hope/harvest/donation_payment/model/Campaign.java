package hope.harvest.donation_payment.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.UUID;
import java.math.BigDecimal;

@Entity(name = "campaigns")
public class Campaign {
    @Id
    @GeneratedValue
    @Column(name = "campaign_id", columnDefinition = "UUID", updatable = false, nullable = false)
    UUID campaignID;

    @Column(name = "title", nullable = false, columnDefinition = "VARCHAR(255)")
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "details", columnDefinition = "TEXT")
    private String details;

    @Column(name = "goal_amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal goalAmount;

    @Column(name = "collected_amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal collectedAmount = BigDecimal.ZERO;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private CampaignCategory category;

    @Column(name = "expected_impact", columnDefinition = "TEXT")
    private String expectedImpact;

    public Campaign() {

    }

    public Campaign(String title, String description, String details, BigDecimal goalAmount,BigDecimal collectedAmount, LocalDate startDate, LocalDate endDate, CampaignCategory category, String expectedImpact) {
        this.title = title;
        this.description = description;
        this.details = details;
        this.goalAmount = goalAmount;
        this.collectedAmount = collectedAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.category = category;
        this.expectedImpact = expectedImpact;
    }

    public UUID getCampaignID() {
        return campaignID;
    }

    public void setCampaignID(UUID campaignID) {
        this.campaignID = campaignID;
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

    public CampaignCategory getCategory() {
        return category;
    }

    public void setCategory(CampaignCategory category) {
        this.category = category;
    }

    public String getExpectedImpact() {
        return expectedImpact;
    }

    public void setExpectedImpact(String expectedImpact) {
        this.expectedImpact = expectedImpact;
    }

    @Override
    public String toString() {
        return "Campaign{" +
                "campaignID=" + campaignID +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", details='" + details + '\'' +
                ", goalAmount=" + goalAmount +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", category=" + category +
                ", expectedImpact='" + expectedImpact + '\'' +
                '}';
    }
}
