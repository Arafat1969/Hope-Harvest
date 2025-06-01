package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity(name = "fund_verifications")
public class FundVerification {

    @Id
    @GeneratedValue
    @Column(name = "verification_id", columnDefinition = "UUID", nullable = false, updatable = false)
    private UUID verificationId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "application_id", nullable = false, referencedColumnName = "application_id", foreignKey = @ForeignKey(name = "fk_verification_application"))
    private FundApplication application;

    @ManyToOne(optional = false)
    @JoinColumn(name = "assigned_volunteer_id", nullable = false, referencedColumnName = "volunteer_id", foreignKey = @ForeignKey(name = "fk_verification_volunteer"))
    private Volunteer assignedVolunteer;

    @Column(name = "assigned_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime assignedDate;

    @Column(name = "verification_due_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime verificationDueDate;

    @Column(name = "recommendation", length = 20)
    private String recommendation;

    @Column(name = "recommended_amount", columnDefinition = "DECIMAL(12,2)")
    private BigDecimal recommendedAmount;

    @Column(name = "report", columnDefinition = "TEXT")
    private String report;

    public FundVerification() {

    }

    public FundVerification(FundApplication application, Volunteer assignedVolunteer, ZonedDateTime assignedDate, ZonedDateTime verificationDueDate, String recommendation, BigDecimal recommendedAmount, String report) {
        this.application = application;
        this.assignedVolunteer = assignedVolunteer;
        this.assignedDate = assignedDate;
        this.verificationDueDate = verificationDueDate;
        this.recommendation = recommendation;
        this.recommendedAmount = recommendedAmount;
        this.report = report;
    }

    public UUID getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(UUID verificationId) {
        this.verificationId = verificationId;
    }

    public FundApplication getApplication() {
        return application;
    }

    public void setApplication(FundApplication application) {
        this.application = application;
    }

    public Volunteer getAssignedVolunteer() {
        return assignedVolunteer;
    }

    public void setAssignedVolunteer(Volunteer assignedVolunteer) {
        this.assignedVolunteer = assignedVolunteer;
    }

    public ZonedDateTime getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(ZonedDateTime assignedDate) {
        this.assignedDate = assignedDate;
    }

    public ZonedDateTime getVerificationDueDate() {
        return verificationDueDate;
    }

    public void setVerificationDueDate(ZonedDateTime verificationDueDate) {
        this.verificationDueDate = verificationDueDate;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public BigDecimal getRecommendedAmount() {
        return recommendedAmount;
    }

    public void setRecommendedAmount(BigDecimal recommendedAmount) {
        this.recommendedAmount = recommendedAmount;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    @Override
    public String toString() {
        return "FundVerification{" +
                "verificationId=" + verificationId +
                ", application=" + application +
                ", assignedVolunteer=" + assignedVolunteer +
                ", assignedDate=" + assignedDate +
                ", verificationDueDate=" + verificationDueDate +
                ", recommendation='" + recommendation + '\'' +
                ", recommendedAmount=" + recommendedAmount +
                ", report='" + report + '\'' +
                '}';
    }
}
