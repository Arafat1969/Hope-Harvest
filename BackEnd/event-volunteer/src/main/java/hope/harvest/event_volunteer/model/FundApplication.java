package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
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

    @Column(name = "bank_account_no")
    private String bankAccountNo;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "bank_branch")
    private String bankBranch;

    @Column(name = "union_name")
    private String unionName;

    @Column(name = "upazila")
    private String upazila;

    @Column(name = "district")
    private String district;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "nid" , columnDefinition = "TEXT")
    private String nid;

    @Column(name = "nationality_proof" , columnDefinition = "TEXT")
    private String nationalityProof;

    @Column(name = "other_document" , columnDefinition = "TEXT")
    private String otherDocument;

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

    public FundApplication() {}

    // Getters and setters for all fields...

    public FundApplication(UUID applicationId, UUID externalUserId, String fullName, String phoneNumber, String nationalId, BigDecimal amount, String purpose, String bankAccountNo, String bankName, String bankBranch, String unionName, String upazila, String district, String postalCode, String nid, String nationalityProof, String otherDocument, ZonedDateTime submissionDate, String status, String feedback, BigDecimal disbursedAmount, ZonedDateTime disbursementDate) {
        this.applicationId = applicationId;
        this.externalUserId = externalUserId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.nationalId = nationalId;
        this.amount = amount;
        this.purpose = purpose;
        this.bankAccountNo = bankAccountNo;
        this.bankName = bankName;
        this.bankBranch = bankBranch;
        this.unionName = unionName;
        this.upazila = upazila;
        this.district = district;
        this.postalCode = postalCode;
        this.nid = nid;
        this.nationalityProof = nationalityProof;
        this.otherDocument = otherDocument;
        this.submissionDate = submissionDate;
        this.status = status;
        this.feedback = feedback;
        this.disbursedAmount = disbursedAmount;
        this.disbursementDate = disbursementDate;
    }


    // (Omitted for brevity, but they should be generated or included as needed)


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

    public String getBankAccountNo() {
        return bankAccountNo;
    }

    public void setBankAccountNo(String bankAccountNo) {
        this.bankAccountNo = bankAccountNo;
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

    public String getUnionName() {
        return unionName;
    }

    public void setUnionName(String unionName) {
        this.unionName = unionName;
    }

    public String getUpazila() {
        return upazila;
    }

    public void setUpazila(String upazila) {
        this.upazila = upazila;
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
                ", bankAccountNo='" + bankAccountNo + '\'' +
                ", bankName='" + bankName + '\'' +
                ", bankBranch='" + bankBranch + '\'' +
                ", unionName='" + unionName + '\'' +
                ", upazila='" + upazila + '\'' +
                ", district='" + district + '\'' +
                ", postalCode='" + postalCode + '\'' +
                ", nid='" + nid + '\'' +
                ", nationalityProof='" + nationalityProof + '\'' +
                ", otherDocument='" + otherDocument + '\'' +
                ", submissionDate=" + submissionDate +
                ", status='" + status + '\'' +
                ", feedback='" + feedback + '\'' +
                ", disbursedAmount=" + disbursedAmount +
                ", disbursementDate=" + disbursementDate +
                '}';
    }
}
