package hope.harvest.donation_payment.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity(name = "payments")
public class Payment {

    @Id
    @GeneratedValue
    @Column(name = "payment_id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID paymentId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "donation_id", nullable = false, referencedColumnName = "donation_id")
    private Donation donation;

    @Column(name = "gateway_name", nullable = false, length = 50)
    private String gatewayName;

    @Column(name = "transaction_id", length = 100)
    private String transactionId;

    @Column(name = "amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal amount;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "PENDING";

    @Column(name = "otp", nullable = false, length = 6)
    private String otp;

    public Payment() {
    }

    public Payment(Donation donation, String gatewayName, BigDecimal amount, String otp) {
        this.donation = donation;
        this.gatewayName = gatewayName;
        this.amount = amount;
        this.otp = otp;
        this.status = "PENDING";
    }


    public UUID getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(UUID paymentId) {
        this.paymentId = paymentId;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public String getGatewayName() {
        return gatewayName;
    }

    public void setGatewayName(String gatewayName) {
        this.gatewayName = gatewayName;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentId=" + paymentId +
                ", donation=" + donation +
                ", gatewayName='" + gatewayName + '\'' +
                ", transactionId='" + transactionId + '\'' +
                ", amount=" + amount +
                ", status='" + status + '\'' +
                ", otp='" + otp + '\'' +
                '}';
    }
}
