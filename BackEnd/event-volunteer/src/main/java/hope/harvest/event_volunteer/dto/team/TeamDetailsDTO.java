package hope.harvest.event_volunteer.dto.team;

import hope.harvest.event_volunteer.dto.volunteer.VolunteerSummaryDTO;

import java.time.ZonedDateTime;
import java.util.List;

public class TeamDetailsDTO {

    private Long teamId;
    private String name;

    private String eventTitle;
    private ZonedDateTime eventStartDate;
    private String locationAddress;
    private String locationCity;
    private String locationDistrict;

    private VolunteerSummaryDTO leader;
    private List<VolunteerSummaryDTO> members;

    public TeamDetailsDTO() {
    }

    public TeamDetailsDTO(Long teamId, String name, String eventTitle, ZonedDateTime eventStartDate,
                          String locationAddress, String locationCity, String locationDistrict,
                          VolunteerSummaryDTO leader, List<VolunteerSummaryDTO> members) {
        this.teamId = teamId;
        this.name = name;
        this.eventTitle = eventTitle;
        this.eventStartDate = eventStartDate;
        this.locationAddress = locationAddress;
        this.locationCity = locationCity;
        this.locationDistrict = locationDistrict;
        this.leader = leader;
        this.members = members;
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

    public VolunteerSummaryDTO getLeader() {
        return leader;
    }

    public void setLeader(VolunteerSummaryDTO leader) {
        this.leader = leader;
    }

    public List<VolunteerSummaryDTO> getMembers() {
        return members;
    }

    public void setMembers(List<VolunteerSummaryDTO> members) {
        this.members = members;
    }
}
