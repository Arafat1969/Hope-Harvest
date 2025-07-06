package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity(name = "fund_applications")
public class FundApplication {
    @Id
    @GeneratedValue
    @Column(name = "application_id", columnDefinition = "UUID", nullable = false, updatable = false)
    private UUID applicationId;

    @Column(name = "external_user_id", nullable = false, columnDefinition = "UUID")
    private UUID externalUserId;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "national_id", nullable = false, length = 50)
    private String nationalId;

    @Column(name = "amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal amount;

    @Column(name = "purpose", nullable = false, length = 255)
    private String purpose;

    @Column(name = "address", nullable = false, columnDefinition = "jsonb")
    private String addressJson;

    @ElementCollection
    @Column(name = "documents", columnDefinition = "jsonb")
    private List<String> documents;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "bank_info", nullable = false, columnDefinition = "jsonb")
    private BankInfo bankInfoJson;


    @Column(name = "submission_date", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime submissionDate = ZonedDateTime.now();

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "disbursed_amount", columnDefinition = "DECIMAL(12,2)")
    private BigDecimal disbursedAmount;

    @Column(name = "disbursement_date", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime disbursementDate;


    public FundApplication() {

    }

    public FundApplication(UUID externalUserId, String fullName, String phoneNumber, String nationalId, BigDecimal amount, String purpose, String addressJson, List<String> documents, BankInfo bankInfoJson, ZonedDateTime submissionDate, String status, String feedback, BigDecimal disbursedAmount, ZonedDateTime disbursementDate) {
        this.externalUserId = externalUserId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.nationalId = nationalId;
        this.amount = amount;
        this.purpose = purpose;
        this.addressJson = addressJson;
        this.documents = documents;
        this.bankInfoJson = bankInfoJson;
        this.submissionDate = submissionDate;
        this.status = status;
        this.feedback = feedback;
        this.disbursedAmount = disbursedAmount;
        this.disbursementDate = disbursementDate;
    }

    public UUID getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(UUID applicationId) {
        this.applicationId = applicationId;
    }

    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getAddressJson() {
        return addressJson;
    }

    public void setAddressJson(String addressJson) {
        this.addressJson = addressJson;
    }

    public List<String> getDocuments() {
        return documents;
    }

    public void setDocuments(List<String> documents) {
        this.documents = documents;
    }

    public BankInfo getBankInfoJson() {
        return bankInfoJson;
    }

    public void setBankInfoJson(BankInfo bankInfoJson) {
        this.bankInfoJson = bankInfoJson;
    }


    public ZonedDateTime getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(ZonedDateTime submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public BigDecimal getDisbursedAmount() {
        return disbursedAmount;
    }

    public void setDisbursedAmount(BigDecimal disbursedAmount) {
        this.disbursedAmount = disbursedAmount;
    }

    public ZonedDateTime getDisbursementDate() {
        return disbursementDate;
    }

    public void setDisbursementDate(ZonedDateTime disbursementDate) {
        this.disbursementDate = disbursementDate;
    }

    @Override
    public String toString() {
        return "FundApplication{" +
                "applicationId=" + applicationId +
                ", externalUserId=" + externalUserId +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", nationalId='" + nationalId + '\'' +
                ", amount=" + amount +
                ", purpose='" + purpose + '\'' +
                ", addressJson='" + addressJson + '\'' +
                ", documents=" + documents +
                ", bankInfoJson='" + bankInfoJson + '\'' +
                ", submissionDate=" + submissionDate +
                ", status='" + status + '\'' +
                ", feedback='" + feedback + '\'' +
                ", disbursedAmount=" + disbursedAmount +
                ", disbursementDate=" + disbursementDate +
                '}';
    }
}
