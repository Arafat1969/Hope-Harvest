package hope.harvest.donation_payment.dto.payment;

import java.util.UUID;

public class PaymentInitiateResponseDTO {
    private UUID paymentId;
    private String otp;
    private String organizationName;

    public PaymentInitiateResponseDTO() {}

    public PaymentInitiateResponseDTO(UUID paymentId, String otp, String organizationName) {
        this.paymentId = paymentId;
        this.otp = otp;
        this.organizationName = organizationName;
    }

    public UUID getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(UUID paymentId) {
        this.paymentId = paymentId;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
}
