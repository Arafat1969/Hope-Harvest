package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.adminCampaign.*;
import hope.harvest.donation_payment.dto.campaign.CampaignCategoryDTO;
import hope.harvest.donation_payment.service.AdminCampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/donation-service")
public class AdminCampaignController {

    @Autowired
    private AdminCampaignService service;

    @PostMapping("/admin/campaigns/categories")
    public ResponseEntity<ApiResponse<CampaignCategoryDTO>> createNewCampaignCategory(@RequestBody CampaignCategoryCreateDTO campaignCategoryCreateDTO) {
        try {
            CampaignCategoryDTO response = service.createNewCampaignCategory(campaignCategoryCreateDTO);
            ApiResponse<CampaignCategoryDTO> apiResponse = new ApiResponse<>("success", "Category created successfully", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignCategoryDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/admin/campaigns/categories")
    public ResponseEntity<ApiResponse<List<CampaignCategoryDTO>>> getAllCampaignCategories() {
        try {
            List<CampaignCategoryDTO> response = service.getAllCampaignCategories();
            ApiResponse<List<CampaignCategoryDTO>> apiResponse = new ApiResponse<>("success", "Categories fetched", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<CampaignCategoryDTO>> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/admin/campaigns/categories/{categoryId}")
    public ResponseEntity<ApiResponse<CampaignCategoryDTO>> getCampaignCategoryByCategoryID(@PathVariable UUID categoryId) {
        try {
            CampaignCategoryDTO response = service.getCampaignCategoryByCategoryID(categoryId);
            if (response == null) {
                ApiResponse<CampaignCategoryDTO> apiResponse = new ApiResponse<>("error", "Category not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<CampaignCategoryDTO> apiResponse = new ApiResponse<>("success", "Category details fetched", response);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignCategoryDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/campaigns/categories/{categoryId}")
    public ResponseEntity<ApiResponse<CampaignCategoryDTO>> updateCampaignCategoryByCategoryID(@PathVariable UUID categoryId, @RequestBody CampaignCategoryCreateDTO requestDTO) {
        try {
            CampaignCategoryDTO response = service.updateCampaignCategoryByCategoryID(categoryId, requestDTO);
            ApiResponse<CampaignCategoryDTO> apiResponse = new ApiResponse<>("success", "Category details fetched", response);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignCategoryDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PostMapping("/admin/campaigns")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> createNewCampaign(@RequestBody CampaignCreateRequestDTO campaignCreateRequestDTO) {
        try {
            CampaignResponseDTO response = service.createNewCampaign(campaignCreateRequestDTO);
            ApiResponse<CampaignResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign created successfully", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @GetMapping("/admin/campaigns")
    public ResponseEntity<ApiResponse<List<CampaignResponseDTO>>> getAllCampaigns() {
        try {
            List<CampaignResponseDTO> response = service.getAllCampaigns();
            ApiResponse<List<CampaignResponseDTO>> apiResponse = new ApiResponse<>("success", "Campaigns fetched", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<CampaignResponseDTO>> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/admin/campaigns/{campaignID}")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> getCampaignByCampaignID(@PathVariable UUID campaignID) {
        try {
            CampaignResponseDTO response = service.getCampaignByCampaignID(campaignID);
            if (response == null) {
                ApiResponse<CampaignResponseDTO> notFound = new ApiResponse<>("error", "Campaign not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFound);
            }
            ApiResponse<CampaignResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign details fetched", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping("/admin/campaigns/{campaignID}")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> updateCampaignByCampaignID(@PathVariable UUID campaignID, @RequestBody CampaignUpdateRequestDTO campaignUpdateRequestDTO) {
        try {
            CampaignResponseDTO response = service.updateCampaignByCampaignID(campaignID, campaignUpdateRequestDTO);
            ApiResponse<CampaignResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign updated", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping("/admin/campaigns/{campaignID}")
    public ResponseEntity<ApiResponse<Boolean>> deleteCampaignByCampaignID(@PathVariable UUID campaignID) {
        try {
            boolean status = service.deleteCampaignByCampaignID(campaignID);
            ApiResponse<Boolean> apiResponse = new ApiResponse<>("success", "Campaign deleted", true);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<Boolean> apiResponse = new ApiResponse<>("error", e.getMessage(), false);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @PatchMapping("/admin/campaigns/{campaignID}/status")
    public ResponseEntity<ApiResponse<CampaignResponseDTO>> updateCampaignStatusByCampaignID(@PathVariable UUID campaignID, @RequestBody CampaignStatusUpdateDTO campaignStatusUpdateDTO) {
        try {
            CampaignResponseDTO response = service.updateCampaignStatusByCampaignID(campaignID, campaignStatusUpdateDTO);
            ApiResponse<CampaignResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign updated", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping("/admin/campaigns/requests")
    public ResponseEntity<ApiResponse<List<CampaignRequestResponseDTO>>> seeAllCampaignRequests() {
        try {
            List<CampaignRequestResponseDTO> response = service.getAllCampaignRequests();
            if( response  == null){
                ApiResponse<List<CampaignRequestResponseDTO>> apiResponse = new ApiResponse<>("failure", "No Campaign request found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<CampaignRequestResponseDTO>> apiResponse = new ApiResponse<>("success", "Campaign requests fetched", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<CampaignRequestResponseDTO>> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @GetMapping("/admin/campaigns/requests/{requestID}")
    public ResponseEntity<ApiResponse<CampaignRequestResponseDTO>> seeCampaignRequestByRequestID(@PathVariable UUID requestID) {
        try {
            CampaignRequestResponseDTO response = service.getCampaignRequestByRequestID(requestID);
            if (response == null) {
                ApiResponse<CampaignRequestResponseDTO> apiResponse = new ApiResponse<>("error", "Campaign request not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<CampaignRequestResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign request fetched", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignRequestResponseDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @PatchMapping("/admin/campaigns/requests/{requestID}")
    public ResponseEntity<ApiResponse<CampaignRequestResponseDTO>> approveCampaignRequestByRequestID(@PathVariable UUID requestID, @RequestBody CampaignRequestStatusUpdateDTO requestStatusUpdateDTO) {
        try {
            CampaignRequestResponseDTO response = service.approveCampaignRequestByRequestID(requestID, requestStatusUpdateDTO);
            ApiResponse<CampaignRequestResponseDTO> apiResponse = new ApiResponse<>("success", "Campaign request approved/rejected", response);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<CampaignRequestResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}
