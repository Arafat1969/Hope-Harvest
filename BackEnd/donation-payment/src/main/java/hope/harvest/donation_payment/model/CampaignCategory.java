package hope.harvest.donation_payment.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity(name = "campaign_categories")
public class CampaignCategory {
    @Id
    @GeneratedValue
    @Column(name = "category_id" , columnDefinition = "UUID" ,updatable = false , nullable = false)
    private UUID categoryID;

    @Column(name = "name", nullable = false, unique = true, columnDefinition = "VARCHAR(100)")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;


    public CampaignCategory() {

    }

    public CampaignCategory(String name, String description) {
        this.name = name;
        this.description = description;
    }


    public UUID getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(UUID categoryID) {
        this.categoryID = categoryID;
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

    @Override
    public String toString() {
        return "CampaignCategory{" +
                "categoryID=" + categoryID +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
