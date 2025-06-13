package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class DonationDetailsDTO {

    private UUID donationId;
    private String campaignTitle;
    private BigDecimal amount;
    private ZonedDateTime donationDate;
    private String status;
    private String paymentMethod;
    private String organizationName;
    private String transactionId;
    private String trackingKey;
    private String donorName;
    private String donorEmail;

    public DonationDetailsDTO() {}

    public DonationDetailsDTO(UUID donationId, String campaignTitle, BigDecimal amount, ZonedDateTime donationDate,
                              String status, String paymentMethod, String organizationName, String transactionId,
                              String trackingKey, String donorName, String donorEmail) {
        this.donationId = donationId;
        this.campaignTitle = campaignTitle;
        this.amount = amount;
        this.donationDate = donationDate;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.organizationName = organizationName;
        this.transactionId = transactionId;
        this.trackingKey = trackingKey;
        this.donorName = donorName;
        this.donorEmail = donorEmail;
    }

    public UUID getDonationId() {
        return donationId;
    }

    public void setDonationId(UUID donationId) {
        this.donationId = donationId;
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

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
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

    public String getDonorName() {
        return donorName;
    }

    public void setDonorName(String donorName) {
        this.donorName = donorName;
    }

    public String getDonorEmail() {
        return donorEmail;
    }

    public void setDonorEmail(String donorEmail) {
        this.donorEmail = donorEmail;
    }
}
