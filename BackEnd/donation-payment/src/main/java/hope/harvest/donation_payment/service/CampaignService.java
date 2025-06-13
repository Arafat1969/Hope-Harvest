package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.campaign.*;
import hope.harvest.donation_payment.dto.donation.DonationSummaryDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CampaignService {

    public List<CampaignSummaryDTO> showCampaignsHomepage() {
        return  null;
    }

    public List<CampaignCategoryDTO> showAllCampaignCategories() {
        return null;
    }

    public List<CampaignSummaryDTO> showCampaignsOfParticularCategory(UUID categoryId) {
        return null;
    }

    public CampaignDetailsDTO showDetailsOfParticularCampaign(UUID campaignID) {
        return null;
    }

    public CampaignRequestResponseDTO requestForNewCampaign(CampaignRequestDTO requestDTO) {
        return null;
    }

    public List<CampaignRequestResponseDTO> getAllRequestsForAParticularUser() {
        return null;
    }

    public List<DonationSummaryDTO> getUserDonationsToCampaign(UUID campaignId, UUID userId) {
        return  null;
    }
}
