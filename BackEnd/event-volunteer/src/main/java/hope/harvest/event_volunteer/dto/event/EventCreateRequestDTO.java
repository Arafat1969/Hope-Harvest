package hope.harvest.event_volunteer.dto.event;

import hope.harvest.event_volunteer.model.RequiredGood;
import hope.harvest.event_volunteer.model.RequiredGoodsConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

public class EventCreateRequestDTO {
    private String title;
    private String description;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private String locationAddress;
    private String locationCity;
    private String locationDistrict;
    private String status;
    private List<RequiredGood> requiredGoods;
    private BigDecimal budgetAmount;
    private UUID externalCampaignId;

    public EventCreateRequestDTO() {
    }

    public EventCreateRequestDTO(String title, String description, ZonedDateTime startDate, ZonedDateTime endDate, String locationAddress, String locationCity, String locationDistrict, String status, List<RequiredGood> requiredGoods, BigDecimal budgetAmount, UUID externalCampaignId) {
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.locationAddress = locationAddress;
        this.locationCity = locationCity;
        this.locationDistrict = locationDistrict;
        this.status = status;
        this.requiredGoods = requiredGoods;
        this.budgetAmount = budgetAmount;
        this.externalCampaignId = externalCampaignId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }

    public String getLocationAddress() {
        return locationAddress;
    }

    public void setLocationAddress(String locationAddress) {
        this.locationAddress = locationAddress;
    }

    public String getLocationCity() {
        return locationCity;
    }

    public void setLocationCity(String locationCity) {
        this.locationCity = locationCity;
    }

    public String getLocationDistrict() {
        return locationDistrict;
    }

    public void setLocationDistrict(String locationDistrict) {
        this.locationDistrict = locationDistrict;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<RequiredGood> getRequiredGoods() {
        return requiredGoods;
    }

    public void setRequiredGoods(List<RequiredGood> requiredGoods) {
        this.requiredGoods = requiredGoods;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public UUID getExternalCampaignId() {
        return externalCampaignId;
    }

    public void setExternalCampaignId(UUID externalCampaignId) {
        this.externalCampaignId = externalCampaignId;
    }
}
