package hope.harvest.donation_payment.model;

import jakarta.persistence.*;

@Entity(name = "campaign_images")
public class CampaignImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", updatable = false, nullable = false)
    private Long imageId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "campaign_id", nullable = false, referencedColumnName = "campaign_id", foreignKey = @ForeignKey(name = "fk_campaign_images_campaign"))
    private Campaign campaign;

    @Column(name = "image_url", nullable = false, length = 500, columnDefinition = "VARCHAR(500)")
    private String imageUrl;

    @Column(name = "image_alt_text", length = 255, columnDefinition = "VARCHAR(255)")
    private String imageAltText;

    @Column(name = "display_order", columnDefinition = "INTEGER DEFAULT 0")
    private Integer displayOrder = 0;

    public CampaignImages() {

    }

    public CampaignImages(Campaign campaign, String imageUrl, String imageAltText, Integer displayOrder) {
        this.campaign = campaign;
        this.imageUrl = imageUrl;
        this.imageAltText = imageAltText;
        this.displayOrder = displayOrder;
    }


    public Long getImageId() {
        return imageId;
    }

    public void setImageId(Long imageId) {
        this.imageId = imageId;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImageAltText() {
        return imageAltText;
    }

    public void setImageAltText(String imageAltText) {
        this.imageAltText = imageAltText;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }

    @Override
    public String toString() {
        return "CampaignImages{" +
                "imageId=" + imageId +
                ", campaign=" + campaign +
                ", imageUrl='" + imageUrl + '\'' +
                ", imageAltText='" + imageAltText + '\'' +
                ", displayOrder=" + displayOrder +
                '}';
    }
}
