package hope.harvest.event_volunteer.controller;

import hope.harvest.event_volunteer.dto.ApiResponse;
import hope.harvest.event_volunteer.dto.fund.FundApplicationDetails;
import hope.harvest.event_volunteer.dto.fund.FundApplicationRequestDTO;
import hope.harvest.event_volunteer.dto.fund.FundDetailsAdminDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationStatusUpdateRequestDTO;
import hope.harvest.event_volunteer.dto.volunteer.AssignVolunteerRequestDTO;
import hope.harvest.event_volunteer.service.FundService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/event-service")
public class FundController {

    @Autowired
    FundService fundService;

    @PostMapping("/funds/apply")
    public ResponseEntity<ApiResponse<FundApplicationDetails>> applyForFundsByUser(@RequestBody FundApplicationRequestDTO requestDTO){
        try {
            FundApplicationDetails fund = fundService.applyForFundsByUser(requestDTO);
            ApiResponse<FundApplicationDetails> response = new ApiResponse<>("success", "All fund applications fetched successfully", fund);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<FundApplicationDetails> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping("/funds/me")
    public ResponseEntity<ApiResponse<List<FundApplicationDetails>>> seeAllFundApplicationsByUser(@RequestParam UUID externalUserId){
        try {
            List<FundApplicationDetails> fundList = fundService.seeAllFundApplicationsByUser(externalUserId);
            if(fundList.isEmpty()){
                ApiResponse<List<FundApplicationDetails>> response = new ApiResponse<>("success", "No fund applications found", null);
                return ResponseEntity.status(HttpStatus.OK).body(response);
            }
            ApiResponse<List<FundApplicationDetails>> response = new ApiResponse<>("success", "All fund applications fetched successfully", fundList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<List<FundApplicationDetails>> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping ("/funds/me/{applicationId}")
    public ResponseEntity<ApiResponse<FundApplicationDetails>> seeFundApplicationOfAUserByApplicationId(@PathVariable UUID applicationId){
        try {
            FundApplicationDetails fundDetails = fundService.seeFundApplicationOfAUserByApplicationId(applicationId);
            ApiResponse<FundApplicationDetails> response = new ApiResponse<>("success", "Fund application fetched successfully", fundDetails);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<FundApplicationDetails> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<FundApplicationDetails> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping ("/admin/funds")
    public ResponseEntity<ApiResponse<List<FundDetailsAdminDTO>>> seeAllFundApplicationsAdmin(){
        try {
            List<FundDetailsAdminDTO> fundList = fundService.seeAllFundApplicationsAdmin();
//            if(fundList.isEmpty()){
//                ApiResponse<List<FundDetailsAdminDTO>> response = new ApiResponse<>("success", "No fund applications found", null);
//                return ResponseEntity.status(HttpStatus.OK).body(response);
//            }
            ApiResponse<List<FundDetailsAdminDTO>> response = new ApiResponse<>("success", "All fund applications fetched successfully", fundList);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            ApiResponse<List<FundDetailsAdminDTO>> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @GetMapping ("/admin/funds/{applicationId}")
    public ResponseEntity<ApiResponse<FundDetailsAdminDTO>> seeFundApplicationAdminByApplicationId(@PathVariable UUID applicationId){
        try {
            FundDetailsAdminDTO fundDetails = fundService.seeFundApplicationAdminByApplicationId(applicationId);
            ApiResponse<FundDetailsAdminDTO> response = new ApiResponse<>("success", "Fund application fetched successfully", fundDetails);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<FundDetailsAdminDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<FundDetailsAdminDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PatchMapping ("/admin/funds/{applicationId}/status")
    public ResponseEntity<ApiResponse<FundDetailsAdminDTO>> completeFundVerification(@PathVariable UUID applicationId, @RequestBody FundVerificationStatusUpdateRequestDTO requestDTO){
        try {
            FundDetailsAdminDTO updatedDTO = fundService.completeFundVerification(applicationId, requestDTO);
            ApiResponse<FundDetailsAdminDTO> response = new ApiResponse<>("success", "Fund verification updated", updatedDTO);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<FundDetailsAdminDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<FundDetailsAdminDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PostMapping ("/admin/funds/{applicationId}/volunteer-assign")
    public ResponseEntity<ApiResponse<String>> assignVolunteerForFundVerification(@PathVariable UUID applicationId, @RequestBody AssignVolunteerRequestDTO requestDTO){
        try {
            fundService.assignVolunteerToFundVerification(applicationId, requestDTO);
            ApiResponse<String> response = new ApiResponse<>("success", "Volunteer assigned successfully", "ok");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<String> error = new ApiResponse<>("failed", e.getMessage(), "not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<String> error = new ApiResponse<>("failed", e.getMessage(), "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

}
