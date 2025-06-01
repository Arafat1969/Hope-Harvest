package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;

@Entity(name = "event_images")
public class EventImages {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", updatable = false, nullable = false)
    private Long imageId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false, referencedColumnName = "event_id", foreignKey = @ForeignKey(name = "fk_event_images_event"))
    private Event event;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "image_alt_text", length = 255)
    private String imageAltText;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    public EventImages() {

    }

    public EventImages(Event event, String imageUrl, String imageAltText, Integer displayOrder) {
        this.event = event;
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

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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
        return "EventImages{" +
                "imageId=" + imageId +
                ", event=" + event +
                ", imageUrl='" + imageUrl + '\'' +
                ", imageAltText='" + imageAltText + '\'' +
                ", displayOrder=" + displayOrder +
                '}';
    }

}
