package hope.harvest.donation_payment.dto.adminCampaign;

public class CampaignStatusUpdateDTO {
    private String status;

    public CampaignStatusUpdateDTO() {}

    public CampaignStatusUpdateDTO(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
