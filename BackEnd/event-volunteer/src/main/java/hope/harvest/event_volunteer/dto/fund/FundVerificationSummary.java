package hope.harvest.event_volunteer.dto.fund;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class FundVerificationSummary {
    private UUID verificationId;
    private String fullName;
    private String purpose;
    private BigDecimal amount;
    private ZonedDateTime verificationDueDate;
    private String status ;

    public FundVerificationSummary() {
    }

    public FundVerificationSummary(UUID verificationId, String fullName, String purpose, BigDecimal amount, ZonedDateTime verificationDueDate, String status) {
        this.verificationId = verificationId;
        this.fullName = fullName;
        this.purpose = purpose;
        this.amount = amount;
        this.verificationDueDate = verificationDueDate;
        this.status = status;
    }

    public UUID getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(UUID verificationId) {
        this.verificationId = verificationId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public ZonedDateTime getVerificationDueDate() {
        return verificationDueDate;
    }

    public void setVerificationDueDate(ZonedDateTime verificationDueDate) {
        this.verificationDueDate = verificationDueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
