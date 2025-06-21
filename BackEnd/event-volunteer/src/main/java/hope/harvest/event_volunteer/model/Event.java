package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;


@Entity(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id", updatable = false, nullable = false)
    private Long eventId;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "report", length = 100)
    private String report;

    @Column(name = "start_date", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime startDate;

    @Column(name = "end_date", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime endDate;

    @Column(name = "location_address", nullable = false, length = 255)
    private String locationAddress;

    @Column(name = "location_city", nullable = false, length = 100)
    private String locationCity;

    @Column(name = "location_district", nullable = false, length = 100)
    private String locationDistrict;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "UPCOMING";

    @Convert(converter = RequiredGoodsConverter.class)
    @Column(name = "required_goods", columnDefinition = "jsonb")
    private List<RequiredGood> requiredGoods;

    @Column(name = "budget_amount", columnDefinition = "DECIMAL(12,2)")
    private BigDecimal budgetAmount;

    @Column(name = "external_campaign_id", nullable = false, columnDefinition = "UUID")
    private UUID externalCampaignId;


    public Event() {

    }

    public Event(String title, String description, String report, ZonedDateTime startDate, ZonedDateTime endDate, String locationAddress, String locationCity, String locationDistrict, String status, List<RequiredGood> requiredGoods, BigDecimal budgetAmount, UUID externalCampaignId) {
        this.title = title;
        this.description = description;
        this.report = report;
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

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
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

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
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

    @Override
    public String toString() {
        return "Event{" +
                "eventId=" + eventId +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", report='" + report + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", locationAddress='" + locationAddress + '\'' +
                ", locationCity='" + locationCity + '\'' +
                ", locationDistrict='" + locationDistrict + '\'' +
                ", status='" + status + '\'' +
                ", requiredGoods=" + requiredGoods +
                ", budgetAmount=" + budgetAmount +
                ", externalCampaignId=" + externalCampaignId +
                '}';
    }
}
