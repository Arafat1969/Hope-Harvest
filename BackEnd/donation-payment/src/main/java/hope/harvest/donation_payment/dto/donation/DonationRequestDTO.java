package hope.harvest.donation_payment.dto.donation;

import java.math.BigDecimal;
import java.util.UUID;

public class DonationRequestDTO {
    private UUID externalUserId;
    private UUID campaignId;
    private BigDecimal amount;
    private boolean isAnonymous;
    private String status;

    public DonationRequestDTO() {
        this.status = "PENDING";
    }

    public DonationRequestDTO(UUID externalUserId, UUID campaignId, BigDecimal amount, boolean isAnonymous) {
        this.externalUserId = externalUserId;
        this.campaignId = campaignId;
        this.amount = amount;
        this.isAnonymous = isAnonymous;
        this.status = "PENDING";
    }


    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
    }

    public UUID getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(UUID campaignId) {
        this.campaignId = campaignId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public boolean isAnonymous() {
        return isAnonymous;
    }

    public void setAnonymous(boolean anonymous) {
        isAnonymous = anonymous;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

