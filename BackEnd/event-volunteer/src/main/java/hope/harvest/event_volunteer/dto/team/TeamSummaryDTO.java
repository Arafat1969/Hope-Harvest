package hope.harvest.event_volunteer.dto.team;

import java.time.ZonedDateTime;

public class TeamSummaryDTO {
    private Long teamId;
    private String name;
    private String eventTitle;
    private ZonedDateTime eventStartDate;
    private String locationAddress;
    private String locationCity;
    private String locationDistrict;
    private boolean isLeader;

    public TeamSummaryDTO() {

    }

    public TeamSummaryDTO(Long teamId, String name, String eventTitle, ZonedDateTime eventStartDate, String locationAddress, String locationCity, String locationDistrict, boolean isLeader) {
        this.teamId = teamId;
        this.name = name;
        this.eventTitle = eventTitle;
        this.eventStartDate = eventStartDate;
        this.locationAddress = locationAddress;
        this.locationCity = locationCity;
        this.locationDistrict = locationDistrict;
        this.isLeader = isLeader;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public ZonedDateTime getEventStartDate() {
        return eventStartDate;
    }

    public void setEventStartDate(ZonedDateTime eventStartDate) {
        this.eventStartDate = eventStartDate;
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

    public boolean isLeader() {
        return isLeader;
    }

    public void setLeader(boolean leader) {
        isLeader = leader;
    }
}
