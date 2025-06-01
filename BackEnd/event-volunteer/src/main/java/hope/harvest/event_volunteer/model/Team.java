package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;

import java.time.ZonedDateTime;

@Entity(name = "team")
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id", nullable = false, updatable = false)
    private Long teamId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false, referencedColumnName = "event_id", foreignKey = @ForeignKey(name = "fk_team_event"))
    private Event event;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "leader_id", nullable = false, referencedColumnName = "volunteer_id", foreignKey = @ForeignKey(name = "fk_team_leader"))
    private Volunteer leader;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime createdAt = ZonedDateTime.now();

    @Column(name = "updated_at", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
    private ZonedDateTime updatedAt = ZonedDateTime.now();

    public Team() {

    }

    public Team(Event event, String name, String description, Volunteer leader, ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.event = event;
        this.name = name;
        this.description = description;
        this.leader = leader;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
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

    public Volunteer getLeader() {
        return leader;
    }

    public void setLeader(Volunteer leader) {
        this.leader = leader;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Team{" +
                "teamId=" + teamId +
                ", event=" + event +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", leader=" + leader +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}
