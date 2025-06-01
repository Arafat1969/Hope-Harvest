package hope.harvest.donation_payment.dto.payment;

import java.math.BigDecimal;
import java.util.UUID;


public class PaymentInitiateRequestDTO {
    private UUID donationId;
    private String gatewayName;
    private BigDecimal amount;
    private String organizationName;

    public PaymentInitiateRequestDTO() {}

    public PaymentInitiateRequestDTO(UUID donationId, String gatewayName, BigDecimal amount, String organizationName) {
        this.donationId = donationId;
        this.gatewayName = gatewayName;
        this.amount = amount;
        this.organizationName = organizationName;
    }

    public UUID getDonationId() {
        return donationId;
    }

    public void setDonationId(UUID donationId) {
        this.donationId = donationId;
    }

    public String getGatewayName() {
        return gatewayName;
    }

    public void setGatewayName(String gatewayName) {
        this.gatewayName = gatewayName;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
}
