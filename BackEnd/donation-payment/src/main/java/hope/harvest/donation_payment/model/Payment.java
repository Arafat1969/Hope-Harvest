package hope.harvest.donation_payment.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity(name = "payments")
public class Payment {

//    CREATE TABLE payments (
//        payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//        donation_id UUID NOT NULL REFERENCES donations(donation_id),
//        gateway_name VARCHAR(50) NOT NULL,
//        gateway_payment_id VARCHAR(100),
//        amount DECIMAL(12,2) NOT NULL,
//        status VARCHAR(20) NOT NULL CHECK (status IN ('INITIATED', 'PENDING', 'COMPLETED', 'FAILED', 'CANCELED')),
//        initiated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
//        completed_at TIMESTAMP WITH TIME ZONE,
//        gateway_response JSONB,
//
//        CONSTRAINT payment_completion_requires_gateway_id CHECK (
//                status != 'COMPLETED' OR gateway_payment_id IS NOT NULL
//        )
//    );


    @Id
    @GeneratedValue
    @Column(name = "payment_id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID paymentID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "donation_id", nullable = false, referencedColumnName = "donation_id")
    private Donation donation;

    @Column(name = "gateway_name", nullable = false, length = 50)
    private String gatewayName;

    @Column(name = "gateway_payment_id", length = 100)
    private String gatewayPaymentID;

    @Column(name = "amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal amount;

    @Column(name = "status", nullable = false, length = 20)
    private String status= "INITIATED";

    @Column(name = "initiated_at", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime initiatedAt= ZonedDateTime.now();

    @Column(name = "completed_at", columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime completedAt;

    @Column(name = "gateway_response", columnDefinition = "jsonb")
    private String gatewayResponse;

    public Payment() {

    }

    public Payment(Donation donation, String gatewayName, String gatewayPaymentID, BigDecimal amount, String status , ZonedDateTime initiatedAt, ZonedDateTime completedAt, String gatewayResponse) {
        this.donation = donation;
        this.gatewayName = gatewayName;
        this.gatewayPaymentID = gatewayPaymentID;
        this.amount = amount;
        this.status = status;
        this.initiatedAt = initiatedAt;
        this.completedAt = completedAt;
        this.gatewayResponse = gatewayResponse;
    }

    public UUID getPaymentID() {
        return paymentID;
    }

    public void setPaymentID(UUID paymentID) {
        this.paymentID = paymentID;
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

    public String getGatewayPaymentID() {
        return gatewayPaymentID;
    }

    public void setGatewayPaymentID(String gatewayPaymentID) {
        this.gatewayPaymentID = gatewayPaymentID;
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

    public ZonedDateTime getInitiatedAt() {
        return initiatedAt;
    }

    public void setInitiatedAt(ZonedDateTime initiatedAt) {
        this.initiatedAt = initiatedAt;
    }

    public ZonedDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(ZonedDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getGatewayResponse() {
        return gatewayResponse;
    }

    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentID=" + paymentID +
                ", donation=" + donation +
                ", gatewayName='" + gatewayName + '\'' +
                ", gatewayPaymentID='" + gatewayPaymentID + '\'' +
                ", amount=" + amount +
                ", status='" + status + '\'' +
                ", initiatedAt=" + initiatedAt +
                ", completedAt=" + completedAt +
                ", gatewayResponse='" + gatewayResponse + '\'' +
                '}';
    }
}
