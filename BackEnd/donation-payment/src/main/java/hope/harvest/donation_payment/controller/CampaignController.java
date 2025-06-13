package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.campaign.*;
import hope.harvest.donation_payment.dto.donation.DonationSummaryDTO;
import hope.harvest.donation_payment.service.CampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class CampaignController {

    @Autowired
    CampaignService campaignService ;


    @GetMapping("/campaigns")
    public ResponseEntity<ApiResponse<List<CampaignSummaryDTO>>> showCampaignsHomepage(){
        try {
            List<CampaignSummaryDTO> campaignSummaryDTOList = campaignService.showCampaignsHomepage();
            if(campaignSummaryDTOList == null){
                ApiResponse<List<CampaignSummaryDTO>> apiResponse = new ApiResponse<>("error","No campaigns found",null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<CampaignSummaryDTO>> apiResponse = new ApiResponse<>("success","Requested campaigns found",campaignSummaryDTOList);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<CampaignSummaryDTO>> error = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/campaigns/categories")
    public ResponseEntity<ApiResponse<List<CampaignCategoryDTO>>> showAllCampaignCategories(){
        try {
            List<CampaignCategoryDTO> campaignCategoryDTOList = campaignService.showAllCampaignCategories();
            if(campaignCategoryDTOList == null){
                ApiResponse<List<CampaignCategoryDTO>> apiResponse = new ApiResponse<>("error","No campaigns found",null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<CampaignCategoryDTO>> apiResponse = new ApiResponse<>("success","Requested campaign categories found",campaignCategoryDTOList);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<CampaignCategoryDTO>> error = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping("/campaigns/categories/{categoryId}")
    public ResponseEntity<ApiResponse<List<CampaignSummaryDTO>>> showCampaignsOfParticularCategory(@PathVariable UUID categoryId){
        try {
            List<CampaignSummaryDTO> campaignSummaryDTOList = campaignService.showCampaignsOfParticularCategory(categoryId);
            if(campaignSummaryDTOList == null){
                ApiResponse<List<CampaignSummaryDTO>> apiResponse = new ApiResponse<>("error","No campaigns found",null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<CampaignSummaryDTO>> apiResponse = new ApiResponse<>("success","Requested campaigns found",campaignSummaryDTOList);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<CampaignSummaryDTO>> error = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping("/campaigns/{campaignID}")
    public ResponseEntity<ApiResponse<CampaignDetailsDTO>> showDetailsOfParticularCampaign(@PathVariable UUID campaignID){
        try {
            CampaignDetailsDTO campaignDetailsDTO = campaignService.showDetailsOfParticularCampaign(campaignID);
            if(campaignDetailsDTO == null){
                ApiResponse<CampaignDetailsDTO> apiResponse = new ApiResponse<>("error","No campaigns found",null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<CampaignDetailsDTO> apiResponse = new ApiResponse<>("success","Requested campaign found",campaignDetailsDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<CampaignDetailsDTO> error = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/campaigns/request")
    public ResponseEntity<ApiResponse<CampaignRequestResponseDTO>> requestForNewCampaign(@RequestBody CampaignRequestDTO requestDTO){
        try {
            CampaignRequestResponseDTO responseDTO = campaignService.requestForNewCampaign(requestDTO);
            ApiResponse<CampaignRequestResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign request submitted successfully", responseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignRequestResponseDTO> errorResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }



    @GetMapping("/campaigns/request")
    public ResponseEntity<ApiResponse<List<CampaignRequestResponseDTO>>> getAllRequestsForAParticularUser(){
        try {
            List<CampaignRequestResponseDTO> responseDTO = campaignService.getAllRequestsForAParticularUser();
            ApiResponse<List<CampaignRequestResponseDTO>> apiResponse = new ApiResponse<>("success","Found Requested Campaign",responseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<CampaignRequestResponseDTO>> error = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/campaigns/{campaignId}/donations")
    public ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> getUserDonationsToCampaign(@PathVariable UUID campaignId, @RequestParam UUID userId) {
        try {
            List<DonationSummaryDTO> donationSummaryDTOList = campaignService.getUserDonationsToCampaign(campaignId, userId);
            if (donationSummaryDTOList == null || donationSummaryDTOList.isEmpty()) {
                ApiResponse<List<DonationSummaryDTO>> error = new ApiResponse<>("error", "No donations found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("success", "Donations found", donationSummaryDTOList);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<DonationSummaryDTO>> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


}
