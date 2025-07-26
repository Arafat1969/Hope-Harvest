package hope.harvest.event_volunteer.dto.fund;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class FundApplicationRequestDTO {
    private String fullName;
    private UUID externalUserId;
    private String nationalId;
    private String phoneNumber;
    private String purpose;
    private BigDecimal amount;
    private String union;
    private String upazilla;
    private String district;
    private String postalCode;
    private String nid;
    private String nationalityProof;
    private String otherDocuments;
    private String bankAccountNumber;
    private String bankName;
    private String bankAccountBranch;


    public FundApplicationRequestDTO() {

    }

    public FundApplicationRequestDTO(String fullName, UUID externalUserId, String nationalId, String phoneNumber, String purpose, BigDecimal amount, String union, String upazilla, String district, String postalCode, String nid, String nationalityProof, String otherDocuments, String bankAccountNumber, String bankName, String bankAccountBranch) {
        this.fullName = fullName;
        this.externalUserId = externalUserId;
        this.nationalId = nationalId;
        this.phoneNumber = phoneNumber;
        this.purpose = purpose;
        this.amount = amount;
        this.union = union;
        this.upazilla = upazilla;
        this.district = district;
        this.postalCode = postalCode;
        this.nid = nid;
        this.nationalityProof = nationalityProof;
        this.otherDocuments = otherDocuments;
        this.bankAccountNumber = bankAccountNumber;
        this.bankName = bankName;
        this.bankAccountBranch = bankAccountBranch;
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

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
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

    public String getOtherDocuments() {
        return otherDocuments;
    }

    public void setOtherDocuments(String otherDocuments) {
        this.otherDocuments = otherDocuments;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }


    public String getBankAccountBranch() {
        return bankAccountBranch;
    }

    public void setBankAccountBranch(String bankAccountBranch) {
        this.bankAccountBranch = bankAccountBranch;
    }
}
