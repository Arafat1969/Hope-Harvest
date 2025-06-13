package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.adminCampaign.*;
import hope.harvest.donation_payment.dto.campaign.CampaignCategoryDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminCampaignService {
    public CampaignResponseDTO createNewCampaign(CampaignCreateRequestDTO campaignCreateRequestDTO) {
        return null;
    }

    public CampaignCategoryCreateDTO createNewCampaignCategory(CampaignCategoryCreateDTO campaignCategoryCreateDTO) {
        return null;
    }

    public List<CampaignCategoryDTO> getAllCampaignCategories() {
        return null;
    }

    public CampaignCategoryDTO getCampaignCategoryByCategoryID(UUID categoryId ) {
        return  null;
    }

    public CampaignCategoryDTO updateCampaignCategoryByCategoryID(UUID categoryId, CampaignCategoryCreateDTO requestDTO) {
        return null;
    }

    public List<CampaignResponseDTO> getAllCampaigns() {
        return null;
    }

    public CampaignResponseDTO getCampaignByCampaignID(UUID campaignID) {
        return null;
    }

    public CampaignResponseDTO updateCampaignByCampaignID(UUID campaignID, CampaignUpdateRequestDTO campaignUpdateRequestDTO) {
        return null;
    }

    public boolean deleteCampaignByCampaignID(UUID campaignID) {
        return false;
    }

    public List<CampaignRequestResponseDTO> getAllCampaignRequests() {
        return null;
    }

    public CampaignRequestResponseDTO getCampaignRequestByRequestID(UUID requestID) {
        return null;
    }

    public CampaignRequestResponseDTO approveCampaignRequestByRequestID(UUID requestID, CampaignRequestStatusUpdateDTO requestStatusUpdateDTO) {
        return null;
    }

    public CampaignResponseDTO updateCampaignStatusByCampaignID(UUID campaignID, CampaignStatusUpdateDTO campaignStatusUpdateDTO) {
        return null;
    }
}
