package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

public class DonationSummaryDTO {
    private UUID donationId;
    private String campaignTitle;
    private BigDecimal amount;
    private ZonedDateTime donationDate;
    private String paymentMethod;
    private String organizationName;
    private String transactionId;
    private String trackingKey;

    public DonationSummaryDTO() {}

    public DonationSummaryDTO(UUID donationId, String campaignTitle, BigDecimal amount, ZonedDateTime donationDate,
                              String paymentMethod, String organizationName, String transactionId, String trackingKey) {
        this.donationId = donationId;
        this.campaignTitle = campaignTitle;
        this.amount = amount;
        this.donationDate = donationDate;
        this.paymentMethod = paymentMethod;
        this.organizationName = organizationName;
        this.transactionId = transactionId;
        this.trackingKey = trackingKey;
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
}
