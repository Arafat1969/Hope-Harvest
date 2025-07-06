package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.service.AdminDonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/donation-service")
public class AdminDonationController {

    @Autowired
    private AdminDonationService service;


    @GetMapping("/admin/donations")
    public ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> getAllDonations() {
        try {
            List<DonationSummaryDTO> donations = service.getAllDonations();
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("success", "All donations fetched", donations);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<DonationSummaryDTO>> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }



    @GetMapping("/admin/donations/{donationId}")
    public ResponseEntity<ApiResponse<DonationDetailsDTO>> getDonationByDonationId(@PathVariable UUID donationId) {
        try {
            DonationDetailsDTO donation = service.getDonationByDonationId(donationId);
            if (donation == null) {
                ApiResponse<DonationDetailsDTO> apiResponse = new ApiResponse<>("error", "Donation not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<DonationDetailsDTO> apiResponse = new ApiResponse<>("success", "Donation details fetched", donation);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationDetailsDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }



    @GetMapping("/admin/donations/{campaignId}")
    public ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> getDonationsByCampaign(@PathVariable UUID campaignId) {
        try {
            List<DonationSummaryDTO> donations = service.getDonationsByCampaign(campaignId);
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("success", "Donations for campaign fetched", donations);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<DonationSummaryDTO>> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }



    @PostMapping("/admin/donations/{donationId}/usage")
    public ResponseEntity<ApiResponse<DonationUsageDTO>> recordDonationUsage(@PathVariable UUID donationId,
                                                                             @RequestBody DonationUsageDTO donationUsageDTO) {
        try {
            DonationUsageDTO response = service.recordDonationUsage(donationId, donationUsageDTO);
            ApiResponse<DonationUsageDTO> apiResponse = new ApiResponse<>("success", "Donation usage recorded", response);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationUsageDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }



    @GetMapping("/admin/donations/statistics")
    public ResponseEntity<ApiResponse<DonationStatisticsDTO>> getDonationStatistics() {
        try {
            DonationStatisticsDTO stats = service.getDonationStatistics();
            ApiResponse<DonationStatisticsDTO> apiResponse = new ApiResponse<>("success", "Donation statistics fetched", stats);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationStatisticsDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
