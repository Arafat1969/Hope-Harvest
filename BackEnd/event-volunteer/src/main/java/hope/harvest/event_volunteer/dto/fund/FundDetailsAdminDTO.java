package hope.harvest.event_volunteer.dto.fund;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class FundDetailsAdminDTO {

    private UUID applicationId;
    private UUID externalUserId;
    private String fullName;
    private String phoneNumber;
    private String nationalId;
    private String purpose;
    private BigDecimal amount;
    private String addressJson;
    private String[] documents;

    // Flattened Bank Info
    private String bankAccountNumber;
    private String bankAccountType;
    private String bankAccountBranch;

    // FundVerification Info
    private UUID assignedVolunteerId;
    private String recommendation;
    private BigDecimal recommendedAmount;
    private String report;

    private ZonedDateTime submissionDate;
    private String status;
    private String feedback;
    private BigDecimal disbursedAmount;
    private ZonedDateTime disbursementDate;

    public FundDetailsAdminDTO() {}

    public FundDetailsAdminDTO(UUID applicationId, UUID externalUserId, String fullName, String phoneNumber,
                               String nationalId, String purpose, BigDecimal amount, String addressJson,
                               String[] documents, String bankAccountNumber, String bankAccountType,
                               String bankAccountBranch, ZonedDateTime submissionDate, String status,
                               String feedback, BigDecimal disbursedAmount, ZonedDateTime disbursementDate,
                               UUID assignedVolunteerId, String recommendation, BigDecimal recommendedAmount, String report) {
        this.applicationId = applicationId;
        this.externalUserId = externalUserId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.nationalId = nationalId;
        this.purpose = purpose;
        this.amount = amount;
        this.addressJson = addressJson;
        this.documents = documents;
        this.bankAccountNumber = bankAccountNumber;
        this.bankAccountType = bankAccountType;
        this.bankAccountBranch = bankAccountBranch;
        this.submissionDate = submissionDate;
        this.status = status;
        this.feedback = feedback;
        this.disbursedAmount = disbursedAmount;
        this.disbursementDate = disbursementDate;
        this.assignedVolunteerId = assignedVolunteerId;
        this.recommendation = recommendation;
        this.recommendedAmount = recommendedAmount;
        this.report = report;
    }

    // Getters and setters

    public UUID getAssignedVolunteerId() {
        return assignedVolunteerId;
    }

    public void setAssignedVolunteerId(UUID assignedVolunteerId) {
        this.assignedVolunteerId = assignedVolunteerId;
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

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getAddressJson() {
        return addressJson;
    }

    public void setAddressJson(String addressJson) {
        this.addressJson = addressJson;
    }

    public String[] getDocuments() {
        return documents;
    }

    public void setDocuments(String[] documents) {
        this.documents = documents;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankAccountType() {
        return bankAccountType;
    }

    public void setBankAccountType(String bankAccountType) {
        this.bankAccountType = bankAccountType;
    }

    public String getBankAccountBranch() {
        return bankAccountBranch;
    }

    public void setBankAccountBranch(String bankAccountBranch) {
        this.bankAccountBranch = bankAccountBranch;
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
}
