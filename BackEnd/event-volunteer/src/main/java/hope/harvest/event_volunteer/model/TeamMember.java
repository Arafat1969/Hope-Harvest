package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;

@Entity(name = "team_members")
public class TeamMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_members_id", nullable = false, updatable = false)
    private Long teamMembersId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "team_id", nullable = false, referencedColumnName = "team_id", foreignKey = @ForeignKey(name = "fk_team_member_team"))
    private Team team;

    @ManyToOne(optional = false)
    @JoinColumn(name = "volunteer_id", nullable = false, referencedColumnName = "volunteer_id", foreignKey = @ForeignKey(name = "fk_team_member_volunteer"))
    private Volunteer volunteer;

    public TeamMember() {

    }

    public TeamMember(Team team, Volunteer volunteer) {
        this.team = team;
        this.volunteer = volunteer;
    }

    public Long getTeamMembersId() {
        return teamMembersId;
    }

    public void setTeamMembersId(Long teamMembersId) {
        this.teamMembersId = teamMembersId;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    @Override
    public String toString() {
        return "TeamMember{" +
                "teamMembersId=" + teamMembersId +
                ", team=" + team +
                ", volunteer=" + volunteer +
                '}';
    }
}
