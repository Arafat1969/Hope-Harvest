package hope.harvest.donation_payment.dto.adminCampaign;

public class CampaignRequestStatusUpdateDTO {
    private String status;
    private String feedback;

    public CampaignRequestStatusUpdateDTO() {}

    public CampaignRequestStatusUpdateDTO(String status, String feedback) {
        this.status = status;
        this.feedback = feedback;
    }


}
