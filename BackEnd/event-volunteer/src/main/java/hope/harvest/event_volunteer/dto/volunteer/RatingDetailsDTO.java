package hope.harvest.event_volunteer.dto.volunteer;

import java.math.BigDecimal;
import java.util.UUID;

public class RatingDetailsDTO {
    private Long ratingId;
    private UUID volunteerId;
    private String teamName;
    private String eventName;
    private UUID externalUserId;
    private int performanceRating;
    private int punctualityRating;
    private int communicationRating;
    private BigDecimal overallRating;
    private String feedback;
    private String strengths;
    private String areasForImprovement;
    private Integer hoursWorked;

    public RatingDetailsDTO() {

    }

    public RatingDetailsDTO(Long ratingId, UUID volunteerId, String teamName, String eventName, UUID externalUserId, int performanceRating, int punctualityRating, int communicationRating, BigDecimal overallRating, String feedback, String strengths, String areasForImprovement, Integer hoursWorked) {
        this.ratingId = ratingId;
        this.volunteerId = volunteerId;
        this.teamName = teamName;
        this.eventName = eventName;
        this.externalUserId = externalUserId;
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

    public UUID getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(UUID volunteerId) {
        this.volunteerId = volunteerId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public UUID getExternalUserId() {
        return externalUserId;
    }

    public void setExternalUserId(UUID externalUserId) {
        this.externalUserId = externalUserId;
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
}
