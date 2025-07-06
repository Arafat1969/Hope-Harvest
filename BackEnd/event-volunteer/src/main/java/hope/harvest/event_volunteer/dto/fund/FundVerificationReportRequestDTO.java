package hope.harvest.event_volunteer.dto.fund;

import java.math.BigDecimal;
import java.util.UUID;

public class FundVerificationReportRequestDTO {
    private UUID verificationId;
    private String recommendation;
    private BigDecimal recommendedAmount;
    private String report;

    public FundVerificationReportRequestDTO() {

    }

    public FundVerificationReportRequestDTO(UUID verificationId, UUID externalUserId, String recommendation, BigDecimal recommendedAmount, String report) {
        this.verificationId = verificationId;
        this.recommendation = recommendation;
        this.recommendedAmount = recommendedAmount;
        this.report = report;
    }

    public UUID getVerificationId() {
        return verificationId;
    }

    public void setVerificationId(UUID verificationId) {
        this.verificationId = verificationId;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public BigDecimal getRecommendedAmount() {
        return recommendedAmount;
    }

    public void setRecommendedAmount(BigDecimal recommendedAmount) {
        this.recommendedAmount = recommendedAmount;
    }

    public String getReport() {
        return report;
    }

    public void setReport(String report) {
        this.report = report;
    }
}
