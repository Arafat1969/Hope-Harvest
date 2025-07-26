package hope.harvest.event_volunteer.dto.fund;

import java.math.BigDecimal;
import java.time.ZonedDateTime;

public class FundVerificationStatusUpdateRequestDTO {

    private String status;
    private String feedback;
    private BigDecimal disbursedAmount;
    private ZonedDateTime disbursementDate;

    public FundVerificationStatusUpdateRequestDTO() {
    }

    public FundVerificationStatusUpdateRequestDTO(String status, String feedback, BigDecimal disbursedAmount, ZonedDateTime disbursementDate) {
        this.status = status;
        this.feedback = feedback;
        this.disbursedAmount = disbursedAmount;
        this.disbursementDate = disbursementDate;
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
