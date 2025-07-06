package hope.harvest.event_volunteer.dto.volunteer;

import hope.harvest.event_volunteer.model.Team;
import hope.harvest.event_volunteer.model.Volunteer;
import jakarta.persistence.*;

import java.math.BigDecimal;

public class RatingSummaryDTO {
    private Long ratingId;

    private String teamName;

    private BigDecimal overallRating;

    private String feedback;

    private Integer hoursWorked;

    public RatingSummaryDTO() {
    }

    public RatingSummaryDTO(Long ratingId, String teamName, BigDecimal overallRating, String feedback, Integer hoursWorked) {
        this.ratingId = ratingId;
        this.teamName = teamName;
        this.overallRating = overallRating;
        this.feedback = feedback;
        this.hoursWorked = hoursWorked;
    }

    public Long getRatingId() {
        return ratingId;
    }

    public void setRatingId(Long ratingId) {
        this.ratingId = ratingId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
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

    public Integer getHoursWorked() {
        return hoursWorked;
    }

    public void setHoursWorked(Integer hoursWorked) {
        this.hoursWorked = hoursWorked;
    }
}
