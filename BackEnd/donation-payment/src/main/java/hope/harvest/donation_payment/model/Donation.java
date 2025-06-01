package hope.harvest.donation_payment.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity(name = "donations")
public class Donation {

    @Id
    @GeneratedValue
    @Column(name = "donation_id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID donationID;

    @Column(name = "external_user_id", columnDefinition = "UUID")
    private UUID externalUserID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "campaign_id", nullable = false, referencedColumnName = "campaign_id")
    private Campaign campaign;

    @Column(name = "amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal amount;

    @Column(name = "donation_date", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP")
    private ZonedDateTime donationDate= ZonedDateTime.now();

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "transaction_id", length = 100)
    private String transactionID;

    @Column(name = "is_anonymous", nullable = false)
    private Boolean isAnonymous;

    @Column(name = "tracking_key", length = 255)
    private String trackingKey;


    public Donation() {

    }

    public Donation(UUID externalUserID, Campaign campaign, BigDecimal amount, ZonedDateTime donationDate, String status, String paymentMethod, String transactionID, Boolean isAnonymous, String trackingKey) {
        this.externalUserID = externalUserID;
        this.campaign = campaign;
        this.amount = amount;
        this.donationDate = donationDate;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.transactionID = transactionID;
        this.isAnonymous = isAnonymous;
        this.trackingKey = trackingKey;
    }

    public UUID getDonationID() {
        return donationID;
    }

    public void setDonationID(UUID donationID) {
        this.donationID = donationID;
    }

    public UUID getExternalUserID() {
        return externalUserID;
    }

    public void setExternalUserID(UUID externalUserID) {
        this.externalUserID = externalUserID;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
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

    public String getTransactionID() {
        return transactionID;
    }

    public void setTransactionID(String transactionID) {
        this.transactionID = transactionID;
    }

    public Boolean getAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(Boolean anonymous) {
        isAnonymous = anonymous;
    }

    public String getTrackingKey() {
        return trackingKey;
    }

    public void setTrackingKey(String trackingKey) {
        this.trackingKey = trackingKey;
    }

    @Override
    public String toString() {
        return "Donation{" +
                "donationID=" + donationID +
                ", externalUserID=" + externalUserID +
                ", campaign=" + campaign +
                ", amount=" + amount +
                ", donationDate=" + donationDate +
                ", status='" + status + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", transactionID='" + transactionID + '\'' +
                ", isAnonymous=" + isAnonymous +
                ", trackingKey='" + trackingKey + '\'' +
                '}';
    }
}
