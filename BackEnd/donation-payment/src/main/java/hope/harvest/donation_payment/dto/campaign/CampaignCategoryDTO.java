package hope.harvest.donation_payment.dto.campaign;

import java.util.UUID;

public class CampaignCategoryDTO {
    private UUID categoryId;
    private String name;
    private String description;

    public CampaignCategoryDTO() {}

    public CampaignCategoryDTO(UUID categoryId, String name, String description) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
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
