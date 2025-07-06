package hope.harvest.event_volunteer.dto.event;

public class EventUpdateStatusDTO {
    private String report;
    private String status;

    public EventUpdateStatusDTO() {
    }

    public EventUpdateStatusDTO(String report, String status) {
        this.report = report;
        this.status = status;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
