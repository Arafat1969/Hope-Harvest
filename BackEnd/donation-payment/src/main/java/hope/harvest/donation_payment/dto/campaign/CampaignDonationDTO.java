package hope.harvest.donation_payment.dto.campaign;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class CampaignDonationDTO {
    private UUID donationId;
    private BigDecimal amount;
    private ZonedDateTime donationDate;
    private String status;           // PENDING, COMPLETED, FAILED, etc.
    private boolean isAnonymous;
    private String paymentMethod;
    private String transactionId;

    public CampaignDonationDTO() {}

    public CampaignDonationDTO(UUID donationId, BigDecimal amount, ZonedDateTime donationDate,
                               String status, boolean isAnonymous, String paymentMethod, String transactionId) {
        this.donationId = donationId;
        this.amount = amount;
        this.donationDate = donationDate;
        this.status = status;
        this.isAnonymous = isAnonymous;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
    }

    public UUID getDonationId() {
        return donationId;
    }

    public void setDonationId(UUID donationId) {
        this.donationId = donationId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public ZonedDateTime getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(ZonedDateTime donationDate) {
        this.donationDate = donationDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}
