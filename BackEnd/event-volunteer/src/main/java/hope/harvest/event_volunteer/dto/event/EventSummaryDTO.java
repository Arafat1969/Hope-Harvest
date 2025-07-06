package hope.harvest.event_volunteer.dto.event;

import hope.harvest.event_volunteer.model.RequiredGood;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

public class EventSummaryDTO {
    private Long eventId;
    private String title;
    private ZonedDateTime startDate;
    private ZonedDateTime endDate;
    private String location;
    private String status;
    private BigDecimal budgetAmount;

    public EventSummaryDTO() {
    }

    public EventSummaryDTO(Long eventId, String title, ZonedDateTime startDate, ZonedDateTime endDate, String location, String status, BigDecimal budgetAmount) {
        this.eventId = eventId;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.status = status;
        this.budgetAmount = budgetAmount;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }
}
