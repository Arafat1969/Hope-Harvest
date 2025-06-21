package hope.harvest.donation_payment.dto.campaign;

public class ImageResponseDto {
    private String imageUrl;
    private String imageAltText;

    public ImageResponseDto() {
    }

    public ImageResponseDto(String imageUrl, String imageAltText) {
        this.imageUrl = imageUrl;
        this.imageAltText = imageAltText;
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
}
