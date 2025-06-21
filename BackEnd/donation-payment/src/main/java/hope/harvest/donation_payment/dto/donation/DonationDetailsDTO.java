package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class DonationDetailsDTO {

    private UUID donationId;
    private UUID userID;
    private String campaignTitle;
    private BigDecimal amount;
    private ZonedDateTime donationDate;
    private String status;
    private String paymentMethod;
    private String transactionId;
    private String trackingKey;

    public DonationDetailsDTO() {}

    public DonationDetailsDTO(UUID donationId,UUID userID, String campaignTitle, BigDecimal amount, ZonedDateTime donationDate,
                              String status, String paymentMethod, String transactionId,
                              String trackingKey) {
        this.donationId = donationId;
        this.userID = userID;
        this.campaignTitle = campaignTitle;
        this.amount = amount;
        this.donationDate = donationDate;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.trackingKey = trackingKey;
    }

    public UUID getDonationId() {
        return donationId;
    }

    public void setDonationId(UUID donationId) {
        this.donationId = donationId;
    }

    public UUID getUserID() {
        return userID;
    }

    public void setUserID(UUID userID) {
        this.userID = userID;
    }

    public String getCampaignTitle() {
        return campaignTitle;
    }

    public void setCampaignTitle(String campaignTitle) {
        this.campaignTitle = campaignTitle;
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

    public String getTrackingKey() {
        return trackingKey;
    }

    public void setTrackingKey(String trackingKey) {
        this.trackingKey = trackingKey;
    }

}
