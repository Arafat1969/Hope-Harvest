package hope.harvest.event_volunteer.dto.fund;

import hope.harvest.event_volunteer.model.BankInfo;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class FundApplicationDetails {

    private UUID applicationId;
    private String purpose;
    private BigDecimal amount;
    private String addressJson;
    private ZonedDateTime submissionDate;
    private String status;
    private String feedback;
    private BigDecimal disbursedAmount;
    private ZonedDateTime disbursementDate;

    public FundApplicationDetails() {}

    public FundApplicationDetails(UUID applicationId, String purpose, BigDecimal amount, String addressJson,
                                  ZonedDateTime submissionDate, String status, String feedback, BigDecimal disbursedAmount,
                                  ZonedDateTime disbursementDate) {
        this.applicationId = applicationId;
        this.purpose = purpose;
        this.amount = amount;
        this.addressJson = addressJson;
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
