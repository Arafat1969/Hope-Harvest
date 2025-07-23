package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.adminCampaign.*;
import hope.harvest.donation_payment.dto.campaign.CampaignCategoryDTO;
import hope.harvest.donation_payment.model.Campaign;
import hope.harvest.donation_payment.model.CampaignCategory;
import hope.harvest.donation_payment.model.CampaignImages;
import hope.harvest.donation_payment.model.CampaignRequest;
import hope.harvest.donation_payment.repo.CampaignCategoryRepo;
import hope.harvest.donation_payment.repo.CampaignImagesRepo;
import hope.harvest.donation_payment.repo.CampaignRepo;
import hope.harvest.donation_payment.repo.CampaignRequestRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;
import java.util.UUID;

@Service
public class AdminCampaignService {
    @Autowired
    CampaignRepo campaignRepo;
    @Autowired
    CampaignImagesRepo campaignImagesRepo;
    @Autowired
    CampaignCategoryRepo categoryRepo;
    @Autowired
    CampaignRequestRepo campaignRequestRepo;
    String imgAltText;
    public CampaignResponseDTO createNewCampaign(CampaignCreateRequestDTO requestDTO) {

        if (requestDTO.getCategoryId() == null || requestDTO.getTitle() == null || requestDTO.getGoalAmount() == null) {
            throw new IllegalArgumentException("Missing required fields");
        }

        Campaign campaign = new Campaign();
        campaign.setCategory(categoryRepo.getReferenceById(requestDTO.getCategoryId()));
        campaign.setTitle(requestDTO.getTitle());
        campaign.setDescription(requestDTO.getDescription());
        campaign.setGoalAmount(requestDTO.getGoalAmount());
        campaign.setDetails(requestDTO.getDetails());
        campaign.setCollectedAmount(BigDecimal.ZERO);
        campaign.setStartDate(requestDTO.getStartDate());
        campaign.setEndDate(requestDTO.getEndDate());
        campaign.setExpectedImpact(requestDTO.getExpectedImpact());

        campaign = campaignRepo.save(campaign);

        if(!requestDTO.getImageUrls().isEmpty()){
            for (String x : requestDTO.getImageUrls()){
                CampaignImages campaignImages = new CampaignImages();
                campaignImages.setCampaign(campaign);
                campaignImages.setImageUrl(x);
                campaignImages.setImageAltText(imgAltText);
                campaignImages.setDisplayOrder(0);

                campaignImages = campaignImagesRepo.save(campaignImages);
            }
        }

        CampaignResponseDTO responseDTO = new CampaignResponseDTO();
        responseDTO.setCampaignId(campaign.getCampaignID());
        responseDTO.setStatus("New Campaign Created");
        responseDTO.setTitle(campaign.getTitle());
        responseDTO.setGoalAmount(campaign.getGoalAmount());
        responseDTO.setCollectedAmount(campaign.getCollectedAmount());
        responseDTO.setStartDate(campaign.getStartDate());
        responseDTO.setEndDate(campaign.getEndDate());
        return responseDTO;
    }

    public CampaignCategoryDTO createNewCampaignCategory(CampaignCategoryCreateDTO requestDTO) {

        if (requestDTO.getName() == null || requestDTO.getDescription() == null) {
            throw new IllegalArgumentException("Category name and description are required");
        }

        if (categoryRepo.existsByName(requestDTO.getName())) {
            throw new RuntimeException("Category name already exists");
        }

        CampaignCategory category = new CampaignCategory();
        category.setDescription(requestDTO.getDescription());
        category.setName(requestDTO.getName());
        category = categoryRepo.save(category);

        CampaignCategoryDTO responseDTO  = new CampaignCategoryDTO(
                category.getCategoryID(),
                category.getName(),
                category.getDescription()
        );

        return responseDTO;
    }

    public List<CampaignCategoryDTO> getAllCampaignCategories() {
        List<CampaignCategory> categories = categoryRepo.findAll();

        if (categories.isEmpty()) {
            return null;
        }

        List<CampaignCategoryDTO> responseDTO = categories.stream()
                .map(category -> new CampaignCategoryDTO(
                        category.getCategoryID(),
                        category.getName(),
                        category.getDescription()
                ))
                .toList();

        return responseDTO;
    }

    public CampaignCategoryDTO getCampaignCategoryByCategoryID(UUID categoryId) {
        CampaignCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Campaign category not found"));

        return new CampaignCategoryDTO(
                category.getCategoryID(),
                category.getName(),
                category.getDescription()
        );
    }


    public CampaignCategoryDTO updateCampaignCategoryByCategoryID(UUID categoryId, CampaignCategoryCreateDTO requestDTO) {
        CampaignCategory category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Campaign category not found"));

        Optional<CampaignCategory> existing = categoryRepo.findByName(requestDTO.getName());
        if (existing.isPresent() && !existing.get().getCategoryID().equals(categoryId)) {
            throw new RuntimeException("Category name already exists");
        }

        category.setName(requestDTO.getName());
        category.setDescription(requestDTO.getDescription());

        category = categoryRepo.save(category);

        return new CampaignCategoryDTO(
                category.getCategoryID(),
                category.getName(),
                category.getDescription()
        );
    }


    public List<CampaignResponseDTO> getAllCampaigns() {
        List<Campaign> campaigns = campaignRepo.findAll();

        return campaigns.stream()
                .map(campaign -> {
                    CampaignResponseDTO dto = new CampaignResponseDTO();
                    dto.setCampaignId(campaign.getCampaignID());
                    dto.setTitle(campaign.getTitle());
                    dto.setGoalAmount(campaign.getGoalAmount());
                    dto.setCollectedAmount(campaign.getCollectedAmount());
                    dto.setStartDate(campaign.getStartDate());
                    dto.setEndDate(campaign.getEndDate());
                    dto.setStatus("Fetched");

                    campaignImagesRepo.findByCampaign(campaign)
                            .ifPresent(img -> dto.setImageUrl(img.getImageUrl()));

                    return dto;
                })
                .toList();
    }



    public CampaignResponseDTO getCampaignByCampaignID(UUID campaignID) {
        Campaign campaign = campaignRepo.findById(campaignID)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        CampaignResponseDTO responseDTO = new CampaignResponseDTO();
        responseDTO.setCampaignId(campaign.getCampaignID());
        responseDTO.setTitle(campaign.getTitle());
        responseDTO.setDescription(campaign.getDescription());
        responseDTO.setDetails(campaign.getDetails());
        if (LocalDate.now().isBefore(campaign.getEndDate())) {
            responseDTO.setStatus("Ongoing");
        }else {
            responseDTO.setStatus("Completed");
        }

        responseDTO.setGoalAmount(campaign.getGoalAmount());
        responseDTO.setCollectedAmount(campaign.getCollectedAmount());
        responseDTO.setStartDate(campaign.getStartDate());
        responseDTO.setEndDate(campaign.getEndDate());

        campaignImagesRepo.findByCampaign(campaign)
                .ifPresent(img -> responseDTO.setImageUrl(img.getImageUrl()));

        return responseDTO;
    }

    public CampaignResponseDTO updateCampaignByCampaignID(UUID campaignID, CampaignUpdateRequestDTO dto) {
        Campaign campaign = campaignRepo.findById(campaignID)
                .orElseThrow(() -> new RuntimeException("Campaign not found"));

        boolean updated = false;

        if (dto.getTitle() != null && !dto.getTitle().equals(campaign.getTitle())) {
            campaign.setTitle(dto.getTitle());
            updated = true;
        }
        if (dto.getDescription() != null && !dto.getDescription().equals(campaign.getDescription())) {
            campaign.setDescription(dto.getDescription());
            updated = true;
        }
        if (dto.getDetails() != null && !dto.getDetails().equals(campaign.getDetails())) {
            campaign.setDetails(dto.getDetails());
            updated = true;
        }
        if (dto.getGoalAmount() != null && !dto.getGoalAmount().equals(campaign.getGoalAmount())) {
            campaign.setGoalAmount(dto.getGoalAmount());
            updated = true;
        }
        if (dto.getStartDate() != null && !dto.getStartDate().equals(campaign.getStartDate())) {
            campaign.setStartDate(dto.getStartDate());
            updated = true;
        }
        if (dto.getEndDate() != null && !dto.getEndDate().equals(campaign.getEndDate())) {
            campaign.setEndDate(dto.getEndDate());
            updated = true;
        }
        if (dto.getExpectedImpact() != null && !dto.getExpectedImpact().equals(campaign.getExpectedImpact())) {
            campaign.setExpectedImpact(dto.getExpectedImpact());
            updated = true;
        }

        if (updated) {
            campaign = campaignRepo.save(campaign);
        }


        CampaignResponseDTO response = new CampaignResponseDTO();
        response.setCampaignId(campaign.getCampaignID());
        response.setTitle(campaign.getTitle());
        response.setGoalAmount(campaign.getGoalAmount());
        response.setCollectedAmount(campaign.getCollectedAmount());
        response.setStartDate(campaign.getStartDate());
        response.setEndDate(campaign.getEndDate());
        response.setStatus(updated ? "Updated successfully" : "No changes detected");

        campaignImagesRepo.findByCampaign(campaign)
                .ifPresent(img -> response.setImageUrl(img.getImageUrl()));

        return response;
    }


    public boolean deleteCampaignByCampaignID(UUID campaignID) {
        if (!campaignRepo.existsById(campaignID)) {
            throw new RuntimeException("Campaign not found");
        }

        campaignRepo.deleteById(campaignID);
        return true;
    }


    public List<CampaignRequestResponseDTO> getAllCampaignRequests() {
        List<CampaignRequest> requests = campaignRequestRepo.findAll();

        return requests.stream()
                .map(req -> new CampaignRequestResponseDTO(
                        req.getRequestId(),
                        req.getTitle(),
                        req.getExternalUserId(),
                        req.getProposerEmail(),
                        req.getProposerPhone(),
                        req.getStatus(),
                        req.getStartDate(),
                        req.getEndDate(),
                        req.getFeedback()
                ))
                .toList();
    }



    public CampaignRequestResponseDTO getCampaignRequestByRequestID(UUID requestID) {
        CampaignRequest req = campaignRequestRepo.findById(requestID)
                .orElseThrow(() -> new RuntimeException("Campaign request not found"));

        return new CampaignRequestResponseDTO(
                req.getRequestId(),
                req.getTitle(),
                req.getExternalUserId(),
                req.getProposerEmail(),
                req.getProposerPhone(),
                req.getStatus(),
                req.getStartDate(),
                req.getEndDate(),
                req.getFeedback()
        );
    }

    public CampaignRequestResponseDTO approveCampaignRequestByRequestID(UUID requestID, CampaignRequestStatusUpdateDTO requestStatusUpdateDTO) {
        CampaignRequest request = campaignRequestRepo.findById(requestID)
                .orElseThrow(() -> new RuntimeException("Campaign request not found"));

        request.setStatus(requestStatusUpdateDTO.getStatus());
        request.setFeedback(requestStatusUpdateDTO.getFeedback());
        request.setReviewDate(ZonedDateTime.now());

        campaignRequestRepo.save(request);

        return new CampaignRequestResponseDTO(
                request.getRequestId(),
                request.getTitle(),
                request.getExternalUserId(),
                request.getProposerEmail(),
                request.getProposerPhone(),
                request.getStatus(),
                request.getStartDate(),
                request.getEndDate(),
                request.getFeedback()
        );
    }


    public CampaignResponseDTO updateCampaignStatusByCampaignID(UUID campaignID, CampaignStatusUpdateDTO campaignStatusUpdateDTO) {
        return null;
    }
}
