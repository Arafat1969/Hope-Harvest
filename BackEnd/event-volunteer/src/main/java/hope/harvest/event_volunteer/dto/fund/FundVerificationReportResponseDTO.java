package hope.harvest.event_volunteer.dto.fund;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class FundVerificationReportResponseDTO {

    private UUID verificationId;
    private UUID applicationId;
    private UUID externalUserId;
    private String fullName;
    private String phoneNumber;
    private String nationalId;
    private String purpose;
    private BigDecimal amount;
    private String addressJson;
    private String[] documents;
    private String bankAccountNumber;
    private String bankAccountType;
    private String bankAccountBranch;
    private ZonedDateTime verificationDueDate;
    private String recommendation;
    private BigDecimal recommendedAmount;
    private String report;
    private String status ;


    public FundVerificationReportResponseDTO() {

    }

    public FundVerificationReportResponseDTO(UUID verificationId, UUID applicationId, UUID externalUserId, String fullName, String phoneNumber, String nationalId, String purpose, BigDecimal amount, String addressJson, String[] documents, String bankAccountNumber, String bankAccountType, String bankAccountBranch, ZonedDateTime verificationDueDate, String recommendation, BigDecimal recommendedAmount, String report, String status) {
        this.verificationId = verificationId;
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
        this.verificationDueDate = verificationDueDate;
        this.recommendation = recommendation;
        this.recommendedAmount = recommendedAmount;
        this.report = report;
        this.status = status;
    }

    public UUID getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(UUID verificationId) {
        this.verificationId = verificationId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
