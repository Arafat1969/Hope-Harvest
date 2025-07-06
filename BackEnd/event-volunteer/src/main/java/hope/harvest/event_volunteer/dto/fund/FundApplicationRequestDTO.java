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
    private String addressJson;
    private List<String> documents;
    private String bankAccountNumber;
    private String bankAccountType;
    private String bankAccountBranch;


    public FundApplicationRequestDTO() {

    }

    public FundApplicationRequestDTO(String fullName,UUID externalUserId, String nationalId, String phoneNumber, String purpose, BigDecimal amount, String addressJson, List<String> documents, String bankAccountNumber, String bankAccountType, String bankAccountBranch) {
        this.fullName = fullName;
        this.externalUserId = externalUserId;
        this.nationalId = nationalId;
        this.phoneNumber = phoneNumber;
        this.purpose = purpose;
        this.amount = amount;
        this.addressJson = addressJson;
        this.documents = documents;
        this.bankAccountNumber = bankAccountNumber;
        this.bankAccountType = bankAccountType;
        this.bankAccountBranch = bankAccountBranch;
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
}
