package hope.harvest.donation_payment.dto.campaign;

import java.time.LocalDate;
import java.util.UUID;

public class CampaignRequestResponseDTO {
    private UUID requestId;
    private String title;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String feedback;

    public CampaignRequestResponseDTO() {}

    public CampaignRequestResponseDTO(UUID requestId, String title, String status,
                                      LocalDate startDate, LocalDate endDate, String feedback) {
        this.requestId = requestId;
        this.title = title;
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
}
