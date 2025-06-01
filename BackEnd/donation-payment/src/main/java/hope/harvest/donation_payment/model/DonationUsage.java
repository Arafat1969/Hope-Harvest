package hope.harvest.donation_payment.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity(name = "donation_usage")
public class DonationUsage {
//    CREATE TABLE donation_usage (
//        usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//        donation_id UUID NOT NULL REFERENCES donations(donation_id),
//        campaign_id UUID NOT NULL REFERENCES campaigns(campaign_id),
//        campaign_category_id UUID NOT NULL REFERENCES campaign_categories(category_id),
//        amount DECIMAL(12,2) NOT NULL,
//        description TEXT,
//        external_event_id UUID,
//
//        CONSTRAINT usage_amount_check CHECK (amount > 0)
//    );

    @Id
    @GeneratedValue
    @Column(name = "usage_id", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID usageID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "donation_id", nullable = false, referencedColumnName = "donation_id")
    private Donation donation;

    @ManyToOne(optional = false)
    @JoinColumn(name = "campaign_id", nullable = false, referencedColumnName = "campaign_id")
    private Campaign campaign;

    @ManyToOne(optional = false)
    @JoinColumn(name = "campaign_category_id", nullable = false, referencedColumnName = "category_id")
    private CampaignCategory campaignCategory;

    @Column(name = "amount", nullable = false, columnDefinition = "DECIMAL(12,2)")
    private BigDecimal amount;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "external_event_id", columnDefinition = "UUID")
    private UUID externalEventID;

    public DonationUsage() {

    }

    public DonationUsage(Donation donation, Campaign campaign, CampaignCategory campaignCategory, BigDecimal amount, String description, UUID externalEventID) {
        this.donation = donation;
        this.campaign = campaign;
        this.campaignCategory = campaignCategory;
        this.amount = amount;
        this.description = description;
        this.externalEventID = externalEventID;
    }

    public UUID getUsageID() {
        return usageID;
    }

    public void setUsageID(UUID usageID) {
        this.usageID = usageID;
    }

    public Donation getDonation() {
        return donation;
    }

    public void setDonation(Donation donation) {
        this.donation = donation;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    public void setCampaign(Campaign campaign) {
        this.campaign = campaign;
    }

    public CampaignCategory getCampaignCategory() {
        return campaignCategory;
    }

    public void setCampaignCategory(CampaignCategory campaignCategory) {
        this.campaignCategory = campaignCategory;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getExternalEventID() {
        return externalEventID;
    }

    public void setExternalEventID(UUID externalEventID) {
        this.externalEventID = externalEventID;
    }

    @Override
    public String toString() {
        return "DonationUsage{" +
                "usageID=" + usageID +
                ", donation=" + donation +
                ", campaign=" + campaign +
                ", campaignCategory=" + campaignCategory +
                ", amount=" + amount +
                ", description='" + description + '\'' +
                ", externalEventID=" + externalEventID +
                '}';
    }
}
