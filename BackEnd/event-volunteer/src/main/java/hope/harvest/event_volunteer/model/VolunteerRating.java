package hope.harvest.event_volunteer.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity(name = "volunteer_rating")
public class VolunteerRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id", nullable = false, updatable = false)
    private Long ratingId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "volunteer_id", nullable = false, referencedColumnName = "volunteer_id", foreignKey = @ForeignKey(name = "fk_rating_volunteer"))
    private Volunteer volunteer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "team_id", nullable = false, referencedColumnName = "team_id", foreignKey = @ForeignKey(name = "fk_rating_team"))
    private Team team;

    @ManyToOne(optional = true)
    @JoinColumn(name = "rated_by_volunteer_id", referencedColumnName = "volunteer_id", foreignKey = @ForeignKey(name = "fk_rating_rated_by"))
    private Volunteer ratedBy;

    @Column(name = "performance_rating", nullable = false)
    private int performanceRating;

    @Column(name = "punctuality_rating", nullable = false)
    private int punctualityRating;

    @Column(name = "communication_rating", nullable = false)
    private int communicationRating;

    @Column(name = "overall_rating", columnDefinition = "NUMERIC(3,2)", insertable = false, updatable = false)
    private BigDecimal overallRating;

    @Column(name = "feedback", columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "strengths", columnDefinition = "TEXT")
    private String strengths;

    @Column(name = "areas_for_improvement", columnDefinition = "TEXT")
    private String areasForImprovement;

    @Column(name = "hours_worked")
    private Integer hoursWorked;

    public VolunteerRating() {

    }

    public VolunteerRating(Volunteer volunteer, Team team, Volunteer ratedBy, int performanceRating, int punctualityRating, int communicationRating, BigDecimal overallRating, String feedback, String strengths, String areasForImprovement, Integer hoursWorked) {
        this.volunteer = volunteer;
        this.team = team;
        this.ratedBy = ratedBy;
        this.performanceRating = performanceRating;
        this.punctualityRating = punctualityRating;
        this.communicationRating = communicationRating;
        this.overallRating = overallRating;
        this.feedback = feedback;
        this.strengths = strengths;
        this.areasForImprovement = areasForImprovement;
        this.hoursWorked = hoursWorked;
    }

    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

    public Volunteer getVolunteer() {
        return volunteer;
    }

    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Volunteer getRatedBy() {
        return ratedBy;
    }

    public void setRatedBy(Volunteer ratedBy) {
        this.ratedBy = ratedBy;
    }

    public int getPerformanceRating() {
        return performanceRating;
    }

    public void setPerformanceRating(int performanceRating) {
        this.performanceRating = performanceRating;
    }

    public int getPunctualityRating() {
        return punctualityRating;
    }

    public void setPunctualityRating(int punctualityRating) {
        this.punctualityRating = punctualityRating;
    }

    public int getCommunicationRating() {
        return communicationRating;
    }

    public void setCommunicationRating(int communicationRating) {
        this.communicationRating = communicationRating;
    }

    public BigDecimal getOverallRating() {
        return overallRating;
    }

    public void setOverallRating(BigDecimal overallRating) {
        this.overallRating = overallRating;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getStrengths() {
        return strengths;
    }

    public void setStrengths(String strengths) {
        this.strengths = strengths;
    }

    public String getAreasForImprovement() {
        return areasForImprovement;
    }

    public void setAreasForImprovement(String areasForImprovement) {
        this.areasForImprovement = areasForImprovement;
    }

    public Integer getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(Integer hoursWorked) {
        this.hoursWorked = hoursWorked;
    }

    @Override
    public String toString() {
        return "VolunteerRating{" +
                "ratingId=" + ratingId +
                ", volunteer=" + volunteer +
                ", team=" + team +
                ", ratedBy=" + ratedBy +
                ", performanceRating=" + performanceRating +
                ", punctualityRating=" + punctualityRating +
                ", communicationRating=" + communicationRating +
                ", overallRating=" + overallRating +
                ", feedback='" + feedback + '\'' +
                ", strengths='" + strengths + '\'' +
                ", areasForImprovement='" + areasForImprovement + '\'' +
                ", hoursWorked=" + hoursWorked +
                '}';
    }
}
