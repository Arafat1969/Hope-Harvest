package hope.harvest.donation_payment.dto.payment;

import java.util.UUID;

public class PaymentVerifyRequestDTO {
    private UUID paymentId;
    private String otp;

    public PaymentVerifyRequestDTO() {}

    public PaymentVerifyRequestDTO(UUID paymentId, String otp) {
        this.paymentId = paymentId;
        this.otp = otp;
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
}
