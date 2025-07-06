package hope.harvest.event_volunteer.dto.event;

public class EventReportRequestDTO {
    private String report;

    public EventReportRequestDTO() {}

    public EventReportRequestDTO(String report) {
        this.report = report;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }
}
