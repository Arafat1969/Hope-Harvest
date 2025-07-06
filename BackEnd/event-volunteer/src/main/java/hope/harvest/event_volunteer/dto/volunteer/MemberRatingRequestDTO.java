package hope.harvest.event_volunteer.dto.volunteer;

import java.math.BigDecimal;
import java.util.UUID;

public class MemberRatingRequestDTO {
    private UUID volunteerId;
    private int performanceRating;
    private int punctualityRating;
    private int communicationRating;
    private String feedback;
    private String strengths;
    private String areasForImprovement;
    private Integer hoursWorked;

    public MemberRatingRequestDTO() {}

    public MemberRatingRequestDTO(UUID volunteerId, int performanceRating, int punctualityRating, int communicationRating, String feedback, String strengths, String areasForImprovement, Integer hoursWorked) {
        this.volunteerId = volunteerId;
        this.performanceRating = performanceRating;
        this.punctualityRating = punctualityRating;
        this.communicationRating = communicationRating;
        this.feedback = feedback;
        this.strengths = strengths;
        this.areasForImprovement = areasForImprovement;
        this.hoursWorked = hoursWorked;
    }

    public UUID getVolunteerId() {
        return volunteerId;
    }

    public void setVolunteerId(UUID volunteerId) {
        this.volunteerId = volunteerId;
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
