package hope.harvest.event_volunteer.dto.team;

import hope.harvest.event_volunteer.model.Event;
import hope.harvest.event_volunteer.model.Volunteer;
import jakarta.persistence.Column;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.util.List;
import java.util.UUID;

public class FormTeamRequestDTO {
    private Long eventId;
    private String name;
    private String description;
    private UUID leaderId;
    private List<UUID> memberList;

    public FormTeamRequestDTO() {
    }

    public FormTeamRequestDTO(Long eventId, String name, String description, UUID leaderId, List<UUID> memberList) {
        this.eventId = eventId;
        this.name = name;
        this.description = description;
        this.leaderId = leaderId;
        this.memberList = memberList;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(UUID leaderId) {
        this.leaderId = leaderId;
    }

    public void addMember(UUID member){
        memberList.add(member);
    }

    public void removeMember(UUID member){
        memberList.remove(member);
    }

    public List<UUID> getMemberList() {
        return memberList;
    }

    public void setMemberList(List<UUID> memberList) {
        this.memberList = memberList;
    }
}
