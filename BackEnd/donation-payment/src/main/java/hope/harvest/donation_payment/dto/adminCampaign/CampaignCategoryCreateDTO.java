package hope.harvest.donation_payment.dto.adminCampaign;

public class CampaignCategoryCreateDTO {
    private String name;
    private String description;

    public CampaignCategoryCreateDTO() {}

    public CampaignCategoryCreateDTO(String name, String description) {
        this.name = name;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
