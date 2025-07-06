package hope.harvest.event_volunteer.controller;

import hope.harvest.event_volunteer.dto.ApiResponse;
import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.fund.FundApplicationDetails;
import hope.harvest.event_volunteer.dto.team.FormTeamRequestDTO;
import hope.harvest.event_volunteer.dto.team.TeamDetailsDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingRequestDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingResponseDTO;
import hope.harvest.event_volunteer.dto.volunteer.VolunteerResponseDTO;
import hope.harvest.event_volunteer.dto.volunteer.VolunteerSummaryDTO;
import hope.harvest.event_volunteer.model.Team;
import hope.harvest.event_volunteer.service.AdminService;
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
public class AdminController {
    @Autowired
    AdminService adminService;

    @GetMapping("/admin/events")
    public ResponseEntity<ApiResponse<List<EventSummaryDTO>>> getAllEventsForAdmin(){
        try {
            List<EventSummaryDTO> eventSummaryDTOS = adminService.getAllEventsForAdmin();
            if(eventSummaryDTOS == null){
                ApiResponse<List<EventSummaryDTO>> apiResponse = new ApiResponse<>("success", "No events created for this campaign",null);
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<EventSummaryDTO>> apiResponse = new ApiResponse<>("success", "Events for this campaign is fetched",eventSummaryDTOS);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<EventSummaryDTO>> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping ("/admin/campaigns/{campaignId}/events")
    public ResponseEntity<ApiResponse<EventDetailsDTO>> createEventsForAdminByCampaignID(@PathVariable UUID campaignId, @RequestBody EventCreateRequestDTO requestDTO){
        try {
            EventDetailsDTO eventDetailsDTO = adminService.createEventsForAdminByCampaignID(campaignId,requestDTO);
            ApiResponse<EventDetailsDTO> apiResponse = new ApiResponse<>("success", "Events for this campaign is fetched",eventDetailsDTO);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<EventDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping ("/admin/campaigns/{campaignId}/events")
    public ResponseEntity<ApiResponse<List<EventSummaryDTO>>> getEventsForAdminByCampaignID(@PathVariable UUID campaignId){
        try {
            List<EventSummaryDTO> eventSummaryDTOS = adminService.getEventsForAdminByCampaignID(campaignId);
            if(eventSummaryDTOS == null){
                ApiResponse<List<EventSummaryDTO>> apiResponse = new ApiResponse<>("success", "No events created for this campaign",null);
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<EventSummaryDTO>> apiResponse = new ApiResponse<>("success", "Events for this campaign is fetched",eventSummaryDTOS);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<EventSummaryDTO>> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping ("/admin/events/{eventId}")
    public ResponseEntity<ApiResponse<EventDetailsDTO>> getEventForAdminByEventId(@PathVariable Long eventId){
        try {
            EventDetailsDTO eventDetailsDTO = adminService.getEventForAdminByEventId(eventId);
            ApiResponse<EventDetailsDTO> response = new ApiResponse<>("success", "Fund application fetched successfully", eventDetailsDTO);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<EventDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<EventDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PutMapping ("/admin/events/{eventId}")
    public ResponseEntity<ApiResponse<EventDetailsDTO>> updateEventByEventId(@PathVariable Long eventId, @RequestBody EventUpdateRequestDTO requestDTO){
        try {
            EventDetailsDTO eventDetailsDTO = adminService.updateEventByEventId(eventId,requestDTO);
            ApiResponse<EventDetailsDTO> apiResponse = new ApiResponse<>("success", "Events updated successfully",eventDetailsDTO);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<EventDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PatchMapping ("/admin/events/{eventId}/status")
    public ResponseEntity<ApiResponse<EventDetailsDTO>> updateEventStatusByEventId(@PathVariable Long eventId, @RequestBody EventUpdateStatusDTO requestDTO){
        try {
            EventDetailsDTO eventDetailsDTO = adminService.updateEventStatusByEventId(eventId,requestDTO);
            ApiResponse<EventDetailsDTO> apiResponse = new ApiResponse<>("success", "Event status updated successfully",eventDetailsDTO);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<EventDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @DeleteMapping ("/admin/events/{eventId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteEventByEventId(@PathVariable Long eventId){
        try {
            Boolean flag = adminService.deleteEventByEventId(eventId);
            ApiResponse<Boolean> apiResponse = new ApiResponse<>("success", "Events updated successfully",flag);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<Boolean> error = new ApiResponse<>("failed", e.getMessage(),false);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping ("/admin/events/{eventId}/team")
    public ResponseEntity<ApiResponse<TeamDetailsDTO>> formTeamForEventByEventId(@PathVariable Long eventId , @RequestBody FormTeamRequestDTO requestDTO){
        try {
            TeamDetailsDTO teamDetailsDTO = adminService.formTeamForEventByEventId(eventId,requestDTO);
            ApiResponse<TeamDetailsDTO> apiResponse = new ApiResponse<>("success", "Team updated successfully",teamDetailsDTO);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<TeamDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping ("/admin/events/{eventId}/team")
    public ResponseEntity<ApiResponse<TeamDetailsDTO>> seeTeamForEventByEventId(@PathVariable Long eventId){
        try {
            TeamDetailsDTO teamDetailsDTO = adminService.seeTeamForEventByEventId(eventId);
            ApiResponse<TeamDetailsDTO> response = new ApiResponse<>("success", "Team fetched successfully", teamDetailsDTO);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<TeamDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<TeamDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

//    @GetMapping ("/admin/events/{eventId}/report")
//    public ResponseEntity<ApiResponse> getEventReportsByReportId(){
//
//    }

    @PostMapping ("/admin/events/{eventId}/team/leader")
    public ResponseEntity<ApiResponse<MemberRatingResponseDTO>> rateTeamLeaderByEventId(@PathVariable Long eventId, @RequestBody MemberRatingRequestDTO ratingsDTOs){
        try {
            MemberRatingResponseDTO responseDTOs = adminService.rateTeamLeaderByEventId(eventId, ratingsDTOs);
            if (responseDTOs == null) {
                ApiResponse<MemberRatingResponseDTO> apiResponse = new ApiResponse<>("success", "No ratings submitted", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<MemberRatingResponseDTO> apiResponse = new ApiResponse<>("success", "Ratings submitted successfully", responseDTOs);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<MemberRatingResponseDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

//    @GetMapping ("/admin/events/statistics")
//    public ResponseEntity<ApiResponse> getOverallEventStatistics(){
//
//    }

    @GetMapping ("/admin/volunteers")
    public ResponseEntity<ApiResponse<List<VolunteerSummaryDTO>>> showAllVolunteersAdmin(){
        try {
            List<VolunteerSummaryDTO> volunteerSummaryDTOS = adminService.showAllVolunteersAdmin();
//            if(volunteerSummaryDTOS.isEmpty()){
//                ApiResponse<List<VolunteerSummaryDTO>> apiResponse = new ApiResponse<>("success", "No volunteers created for this campaign",null);
//                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
//            }
            ApiResponse<List<VolunteerSummaryDTO>> apiResponse = new ApiResponse<>("success", "Volunteer Summary is fetched",volunteerSummaryDTOS);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<VolunteerSummaryDTO>> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping ("/admin/volunteers/{volunteerId}")
    public ResponseEntity<ApiResponse<VolunteerResponseDTO>> showAllVolunteerByVolunteerIdAdmin(@PathVariable UUID volunteerId ){
        try {
            VolunteerResponseDTO eventDetailsDTO = adminService.showAllVolunteerByVolunteerIdAdmin(volunteerId );
            ApiResponse<VolunteerResponseDTO> response = new ApiResponse<>("success", "Volunteer details fetched successfully", eventDetailsDTO);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (EntityNotFoundException e) {
            ApiResponse<VolunteerResponseDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            ApiResponse<VolunteerResponseDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

//    @GetMapping ("/admin/volunteers/{volunteerId}/assignments")
//    public ResponseEntity<ApiResponse> showAssignmentsByVolunteerIdAdmin(){
//
//    }


}
