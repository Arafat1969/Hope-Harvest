package hope.harvest.donation_payment.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity(name = "campaign_requests")
public class CampaignRequest {

    @Id
    @GeneratedValue
    @Column(name = "request_id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID requestId;

    @Column(name = "external_user_id", nullable = false, columnDefinition = "UUID")
    private UUID externalUserId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "goal", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal goal;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private CampaignCategory category;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "expected_impact", columnDefinition = "TEXT")
    private String expectedImpact;

    @Column(name = "proposer_phone", length = 20)
    private String proposerPhone;

    @Column(name = "proposer_email", length = 255)
    private String proposerEmail;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "submission_date", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private ZonedDateTime submissionDate = ZonedDateTime.now();

    @Column(name = "review_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime reviewDate;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;


    public CampaignRequest() {}


    public CampaignRequest(UUID externalUserId, String title, String description, BigDecimal goal, CampaignCategory category, LocalDate startDate, LocalDate endDate, String expectedImpact, String proposerPhone, String proposerEmail, String status, ZonedDateTime submissionDate, ZonedDateTime reviewDate, String feedback) {
        this.externalUserId = externalUserId;
        this.title = title;
        this.description = description;
        this.goal = goal;
        this.category = category;
        this.startDate = startDate;
        this.endDate = endDate;
        this.expectedImpact = expectedImpact;
        this.proposerPhone = proposerPhone;
        this.proposerEmail = proposerEmail;
        this.status = status;
        this.submissionDate = submissionDate;
        this.reviewDate = reviewDate;
        this.feedback = feedback;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

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

    public CampaignCategory getCategory() {
        return category;
    }

    public void setCategory(CampaignCategory category) {
        this.category = category;
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

    public ZonedDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(ZonedDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public ZonedDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(ZonedDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    @Override
    public String toString() {
        return "CampaignRequest{" +
                "requestId=" + requestId +
                ", externalUserId=" + externalUserId +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", goal=" + goal +
                ", category=" + category +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", expectedImpact='" + expectedImpact + '\'' +
                ", proposerPhone='" + proposerPhone + '\'' +
                ", proposerEmail='" + proposerEmail + '\'' +
                ", status='" + status + '\'' +
                ", submissionDate=" + submissionDate +
                ", reviewDate=" + reviewDate +
                ", feedback='" + feedback + '\'' +
                '}';
    }
}

