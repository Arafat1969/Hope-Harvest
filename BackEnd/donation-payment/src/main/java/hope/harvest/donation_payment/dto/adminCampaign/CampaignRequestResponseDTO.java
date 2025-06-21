package hope.harvest.donation_payment.dto.adminCampaign;

import java.time.LocalDate;
import java.util.UUID;

public class CampaignRequestResponseDTO {
    private UUID requestId;
    private String title;
    private UUID externalUserId;
    private String proposerEmail;
    private String proposerPhone;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String feedback;

    public CampaignRequestResponseDTO() {}

    public CampaignRequestResponseDTO(UUID requestId, String title, UUID externalUserId, String proposerEmail, String proposerPhone, String status, LocalDate startDate, LocalDate endDate, String feedback) {
        this.requestId = requestId;
        this.title = title;
        this.externalUserId = externalUserId;
        this.proposerEmail = proposerEmail;
        this.proposerPhone = proposerPhone;
        this.status = status;
        this.startDate = startDate;
        this.endDate = endDate;
        this.feedback = feedback;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
    }

    public String getProposerEmail() {
        return proposerEmail;
    }

    public void setProposerEmail(String proposerEmail) {
        this.proposerEmail = proposerEmail;
    }

    public String getProposerPhone() {
        return proposerPhone;
    }

    public void setProposerPhone(String proposerPhone) {
        this.proposerPhone = proposerPhone;
    }
}
