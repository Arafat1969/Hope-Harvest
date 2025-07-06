package hope.harvest.event_volunteer.dto.event;

public class EventReportResponseDTO {
    private Long eventId;
    private String report;

    public EventReportResponseDTO() {}

    public EventReportResponseDTO(Long eventId, String report) {
        this.eventId = eventId;
        this.report = report;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }
}