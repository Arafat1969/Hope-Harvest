package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.util.UUID;

public class DonationResponseDTO {
    private UUID donationId;
    private BigDecimal amount;

    public DonationResponseDTO() {}

    public DonationResponseDTO(UUID donationId, BigDecimal amount) {
        this.donationId = donationId;
        this.amount = amount;
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
}
