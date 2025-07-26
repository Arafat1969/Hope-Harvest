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
    private String union;
    private String upazilla;
    private String district;
    private String postalCode;
    private String nid;
    private String nationalityProof;
    private String otherDocument;

    // Flattened Bank Info
    private String bankAccountNumber;
    private String bankName;
    private String bankBranch;

    private ZonedDateTime verificationDueDate;
    private String recommendation;
    private BigDecimal recommendedAmount;
    private String report;
    private String status ;


    public FundVerificationReportResponseDTO() {

    }

    public FundVerificationReportResponseDTO(UUID verificationId, UUID applicationId, UUID externalUserId, String fullName, String phoneNumber, String nationalId, String purpose, BigDecimal amount, String union, String upazilla, String district, String postalCode, String nid, String nationalityProof, String otherDocument, String bankAccountNumber, String bankName, String bankBranch, ZonedDateTime verificationDueDate, String recommendation, BigDecimal recommendedAmount, String report, String status) {
        this.verificationId = verificationId;
        this.applicationId = applicationId;
        this.externalUserId = externalUserId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.nationalId = nationalId;
        this.purpose = purpose;
        this.amount = amount;
        this.union = union;
        this.upazilla = upazilla;
        this.district = district;
        this.postalCode = postalCode;
        this.nid = nid;
        this.nationalityProof = nationalityProof;
        this.otherDocument = otherDocument;
        this.bankAccountNumber = bankAccountNumber;
        this.bankName = bankName;
        this.bankBranch = bankBranch;
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

    public String getUnion() {
        return union;
    }

    public void setUnion(String union) {
        this.union = union;
    }

    public String getUpazilla() {
        return upazilla;
    }

    public void setUpazilla(String upazilla) {
        this.upazilla = upazilla;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getNid() {
        return nid;
    }

    public void setNid(String nid) {
        this.nid = nid;
    }

    public String getNationalityProof() {
        return nationalityProof;
    }

    public void setNationalityProof(String nationalityProof) {
        this.nationalityProof = nationalityProof;
    }

    public String getOtherDocument() {
        return otherDocument;
    }

    public void setOtherDocument(String otherDocument) {
        this.otherDocument = otherDocument;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankBranch() {
        return bankBranch;
    }

    public void setBankBranch(String bankBranch) {
        this.bankBranch = bankBranch;
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
