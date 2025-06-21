package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.campaign.*;
import hope.harvest.donation_payment.dto.donation.DonationSummaryDTO;
import hope.harvest.donation_payment.model.*;
import hope.harvest.donation_payment.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CampaignService {

    @Autowired
    CampaignRepo campaignRepo;

    @Autowired
    CampaignImagesRepo campaignImagesRepo;

    @Autowired
    CampaignCategoryRepo categoryRepo;

    @Autowired
    CampaignRequestRepo campaignRequestRepo;

    @Autowired
    DonationRepo donationRepo;

    public List<CampaignSummaryDTO> showCampaignsHomepage() {
        List<Campaign> campaigns = campaignRepo.findAll();

        return campaigns.stream().map(campaign -> {
            String imageUrl = campaignImagesRepo.findByCampaign(campaign)
                    .map(CampaignImages::getImageUrl)
                    .orElse(null); // You can also set a default placeholder URL here

            return new CampaignSummaryDTO(
                    campaign.getCampaignID(),
                    campaign.getTitle(),
                    campaign.getDescription(), // Assuming description is used as shortDescription
                    campaign.getGoalAmount(),
                    campaign.getCollectedAmount(),
                    imageUrl
            );
        }).toList();
    }


    public List<CampaignCategoryDTO> showAllCampaignCategories() {
        List<CampaignCategory> categories = categoryRepo.findAll();

        return categories.stream()
                .map(category -> new CampaignCategoryDTO(
                        category.getCategoryID(),
                        category.getName(),
                        category.getDescription()
                ))
                .toList();
    }


    public List<CampaignSummaryDTO> showCampaignsOfParticularCategory(UUID categoryId) {
        CampaignCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        List<Campaign> campaigns = campaignRepo.findByCategory(category);

        return campaigns.stream()
                .map(campaign -> {
                    String imageUrl = campaignImagesRepo.findByCampaign(campaign)
                            .map(CampaignImages::getImageUrl)
                            .orElse(null);

                    return new CampaignSummaryDTO(
                            campaign.getCampaignID(),
                            campaign.getTitle(),
                            campaign.getDescription(),
                            campaign.getGoalAmount(),
                            campaign.getCollectedAmount(),
                            imageUrl
                    );
                })
                .toList();
    }


    public CampaignDetailsDTO showDetailsOfParticularCampaign(UUID campaignID) {
        Campaign campaign = campaignRepo.findById(campaignID)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        CampaignCategory category = campaign.getCategory();

        CampaignCategoryDTO categoryDTO = new CampaignCategoryDTO(
                category.getCategoryID(),
                category.getName(),
                category.getDescription()
        );

        String imageUrl = campaignImagesRepo.findByCampaign(campaign)
                .map(CampaignImages::getImageUrl)
                .orElse(null);

        return new CampaignDetailsDTO(
                campaign.getCampaignID(),
                campaign.getTitle(),
                campaign.getDescription(),
                campaign.getDetails(),
                campaign.getGoalAmount(),
                campaign.getCollectedAmount(),
                campaign.getExpectedImpact(),
                categoryDTO,
                imageUrl
        );
    }


    public CampaignRequestResponseDTO requestForNewCampaign(CampaignRequestDTO requestDTO) {
        if (requestDTO.getEndDate().isBefore(requestDTO.getStartDate())) {
            throw new IllegalArgumentException("End date must be after or equal to start date.");
        }

        CampaignRequest request = new CampaignRequest();
        request.setExternalUserId(requestDTO.getExternalUserId());
        request.setTitle(requestDTO.getTitle());
        request.setDescription(requestDTO.getDescription());
        request.setGoal(requestDTO.getGoal());
        request.setCategory(categoryRepo.findById(requestDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Invalid category ID")));
        request.setStartDate(requestDTO.getStartDate());
        request.setEndDate(requestDTO.getEndDate());
        request.setExpectedImpact(requestDTO.getExpectedImpact());
        request.setProposerPhone(requestDTO.getProposerPhone());
        request.setProposerEmail(requestDTO.getProposerEmail());
        request.setStatus("PENDING");

        CampaignRequest savedRequest = campaignRequestRepo.save(request);


        return new CampaignRequestResponseDTO(
                savedRequest.getRequestId(),
                savedRequest.getTitle(),
                savedRequest.getStatus(),
                savedRequest.getStartDate(),
                savedRequest.getEndDate(),
                savedRequest.getFeedback()
        );
    }


    public List<CampaignRequestResponseDTO> getAllRequestsForAParticularUser(UUID userId) {
        List<CampaignRequest> requests = campaignRequestRepo.findByExternalUserId(userId);

        return requests.stream()
                .map(req -> new CampaignRequestResponseDTO(
                        req.getRequestId(),
                        req.getTitle(),
                        req.getStatus(),
                        req.getStartDate(),
                        req.getEndDate(),
                        req.getFeedback()
                ))
                .toList();
    }

    public List<DonationSummaryDTO> getUserDonationsToCampaign(UUID campaignId, UUID userId) {
        List<Donation> donations = donationRepo.findByCampaign_CampaignIDAndExternalUserID(campaignId, userId);

        return donations.stream()
                .map(donation -> new DonationSummaryDTO(
                        donation.getDonationID(),
                        donation.getCampaign().getTitle(),
                        donation.getAmount(),
                        donation.getDonationDate(),
                        donation.getPaymentMethod(),
                        donation.getPaymentMethod(),
                        donation.getTransactionID(),
                        donation.getTrackingKey()
                ))
                .toList();
    }


    public CampaignRequestResponseDTO getParticularRequestForAParticularUser(UUID userId, UUID requestId) {
        CampaignRequest request = campaignRequestRepo.findByRequestIdAndExternalUserId(requestId, userId)
                .orElseThrow(() -> new RuntimeException("No matching campaign request found for this user"));

        CampaignRequestResponseDTO dto = new CampaignRequestResponseDTO();
        dto.setRequestId(request.getRequestId());
        dto.setTitle(request.getTitle());
        dto.setStatus(request.getStatus());
        dto.setStartDate(request.getStartDate());
        dto.setEndDate(request.getEndDate());
        dto.setFeedback(request.getFeedback());

        return dto;
    }

    public List<ImageResponseDto> getAllImagesForGallery() {
        List<CampaignImages> campaignImages = campaignImagesRepo.findAll();

        return campaignImages.stream()
                .map(image -> new ImageResponseDto(
                        image.getImageUrl(),
                        image.getImageAltText()
                ))
                .toList();
    }
}
