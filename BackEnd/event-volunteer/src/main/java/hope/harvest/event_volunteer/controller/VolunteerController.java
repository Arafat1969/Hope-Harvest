package hope.harvest.event_volunteer.controller;

import hope.harvest.event_volunteer.dto.ApiResponse;
import hope.harvest.event_volunteer.dto.fund.FundVerificationDetailsDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationReportRequestDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationReportResponseDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationSummary;
import hope.harvest.event_volunteer.dto.team.TeamSummaryDTO;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.service.VolunteerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/event-service")
public class VolunteerController {
    @Autowired
    VolunteerService volunteerService;

    @PostMapping ("/volunteers/register")
    public ResponseEntity<ApiResponse<VolunteerResponseDTO>> registerForVolunteer(@RequestBody VolunteerRegistrationRequestDTO requestDTO){
        try{
            VolunteerResponseDTO volunteerResponseDTO = volunteerService.registerForVolunteer(requestDTO);
            ApiResponse<VolunteerResponseDTO> apiResponse = new ApiResponse<>("success","Volunteer Registered Successfull",volunteerResponseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        }catch (Exception e){
            ApiResponse<VolunteerResponseDTO> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }

    }


    @GetMapping("/volunteers/{volunteerId}")
    public ResponseEntity<ApiResponse<VolunteerResponseDTO>> seeMyVolunteerProfile(@PathVariable UUID volunteerId){
        try{
            VolunteerResponseDTO volunteerResponseDTO = volunteerService.seeMyVolunteerProfile(volunteerId);
            ApiResponse<VolunteerResponseDTO> apiResponse = new ApiResponse<>("success","Volunteer profile data found",volunteerResponseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<VolunteerResponseDTO> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }


    @PutMapping ("/volunteers/me")
    public ResponseEntity<ApiResponse<VolunteerResponseDTO>> updateMyVolunteerProfile(@RequestBody VolunteerUpdateRequestDTO requestDTO){
        try{
            VolunteerResponseDTO volunteerResponseDTO = volunteerService.updateMyVolunteerProfile(requestDTO);
            ApiResponse<VolunteerResponseDTO> apiResponse = new ApiResponse<>("success","Volunteer profile data updated",volunteerResponseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<VolunteerResponseDTO> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }


    @GetMapping ("/volunteers/me/teams")
    public ResponseEntity<ApiResponse<List<TeamSummaryDTO>>> showTeamsForParticularVolunteer(@RequestParam UUID volunteerId){
        try{
            List<TeamSummaryDTO> teamSummaryDTOS = volunteerService.showTeamsForParticularVolunteer(volunteerId);
            ApiResponse<List<TeamSummaryDTO>> apiResponse = new ApiResponse<>("success","Volunteer team data fetched",teamSummaryDTOS);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<TeamSummaryDTO>> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }


    @GetMapping ("/volunteers/me/fund-verifications")
    public ResponseEntity<ApiResponse<List<FundVerificationSummary>>> showAssignedFundVerficationForParticularVolunteer(@RequestParam UUID volunteerId){
        try{
            List<FundVerificationSummary> fundVerificationSummaryList = volunteerService.showAssignedFundVerficationForParticularVolunteer(volunteerId);
            ApiResponse<List<FundVerificationSummary>> apiResponse = new ApiResponse<>("success","Pending Fund Verifications fetched",fundVerificationSummaryList);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<FundVerificationSummary>> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @GetMapping ("/volunteers/me/fund-verifications/{verificationId}")
    public ResponseEntity<ApiResponse<FundVerificationDetailsDTO>> showAssignedFundVerficationForParticularVolunteerByVerificationId(@PathVariable UUID verificationId){
        try{
            FundVerificationDetailsDTO fundVerificationSummaryList = volunteerService.showAssignedFundVerficationForParticularVolunteerByVerificationId(verificationId);
            ApiResponse<FundVerificationDetailsDTO> apiResponse = new ApiResponse<>("success","Pending Fund Verifications fetched",fundVerificationSummaryList);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<FundVerificationDetailsDTO> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }


    @PutMapping ("/volunteers/me/fund-verifications/{verificationId}")
    public ResponseEntity<ApiResponse<FundVerificationReportResponseDTO>> submitFundVerificationReportByVerificationId(@RequestBody FundVerificationReportRequestDTO reportDTO){
        try{
            FundVerificationReportResponseDTO fundVerificationReportResponseDTO = volunteerService.submitFundVerificationReportByVerificationId(reportDTO);
            ApiResponse<FundVerificationReportResponseDTO> apiResponse = new ApiResponse<>("success","Pending Fund Verifications fetched",fundVerificationReportResponseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<FundVerificationReportResponseDTO> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }


    @GetMapping ("/volunteers/me/ratings")
    public ResponseEntity<ApiResponse<List<RatingSummaryDTO>>> showRatingsForParticularVolunteer(@RequestParam UUID volunteerId){
        try{
            List<RatingSummaryDTO> ratingSummaryDTOS = volunteerService.showRatingsForParticularVolunteer(volunteerId);
            ApiResponse<List<RatingSummaryDTO>> apiResponse = new ApiResponse<>("success","Volunteer Rating Summary fetched", ratingSummaryDTOS);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<RatingSummaryDTO>> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @GetMapping ("/volunteers/me/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingDetailsDTO>> showRatingDetailsForParticularVolunteer(@PathVariable Long ratingId){
        try{
            RatingDetailsDTO ratingDetailsDTO = volunteerService.showRatingDetailsForParticularVolunteer(ratingId);
            ApiResponse<RatingDetailsDTO> apiResponse = new ApiResponse<>("success","Volunteer Rating Summary fetched", ratingDetailsDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<RatingDetailsDTO> apiResponse = new ApiResponse<>("error",e.getMessage(),null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }
}
