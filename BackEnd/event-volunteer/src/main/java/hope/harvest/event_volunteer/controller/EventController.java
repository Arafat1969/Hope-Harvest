package hope.harvest.event_volunteer.controller;

import hope.harvest.event_volunteer.dto.ApiResponse;
import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.TeamDetailsDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingRequestDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingResponseDTO;
import hope.harvest.event_volunteer.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1/event-service")
public class EventController {

    @Autowired
    EventService eventService;

    @GetMapping ("/{campaignId}/events")
    public ResponseEntity<ApiResponse<List<EventDetailsDTO>>> showAllEventsByCampaignId(@PathVariable UUID campaignId) {
        try {
            List<EventDetailsDTO> eventDetailsDTOS = eventService.showAllEventsByCampaignId(campaignId);
            if(eventDetailsDTOS == null){
                ApiResponse<List<EventDetailsDTO>> apiResponse = new ApiResponse<>("success", "No events created for this campaign",null);
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<List<EventDetailsDTO>> apiResponse = new ApiResponse<>("success", "Events for this campaign is fetched",eventDetailsDTOS);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<List<EventDetailsDTO>> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<ApiResponse<EventDetailsDTO>> showEventOfACampaignByEventId(@PathVariable Long eventId) {
        try {
            EventDetailsDTO eventDetailsDTOS = eventService.getEventByEventId(eventId);
            if(eventDetailsDTOS == null){
                ApiResponse<EventDetailsDTO> apiResponse = new ApiResponse<>("success", "No events created for this campaign",null);
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<EventDetailsDTO> apiResponse = new ApiResponse<>("success", "Events for this campaign is fetched",eventDetailsDTOS);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<EventDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping ("/events/{eventId}/team")
    public ResponseEntity<ApiResponse<TeamDetailsDTO>> showEventTeamByEventID(@PathVariable Long eventId){
        try {
            TeamDetailsDTO teamDetailsDTO = eventService.showEventTeamByEventID(eventId);
            if(teamDetailsDTO == null){
                ApiResponse<TeamDetailsDTO> apiResponse = new ApiResponse<>("success", "No teams created for this event",null);
                return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<TeamDetailsDTO> apiResponse = new ApiResponse<>("success", "Team for this event is fetched",teamDetailsDTO);
            return  ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<TeamDetailsDTO> error = new ApiResponse<>("failed", e.getMessage(),null);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }



    @PostMapping("/events/{eventId}/team/leader/reports")
    public ResponseEntity<ApiResponse<EventReportResponseDTO>> submitEventReportByTeamLeader(@PathVariable Long eventId, @RequestBody EventReportRequestDTO reportDTO) {
        try {
            EventReportResponseDTO responseDTO = eventService.submitEventReport(eventId, reportDTO);
            if (responseDTO == null) {
                ApiResponse<EventReportResponseDTO> apiResponse = new ApiResponse<>("success", "Report could not be submitted", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<EventReportResponseDTO> apiResponse = new ApiResponse<>("success", "Report submitted successfully", responseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<EventReportResponseDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PutMapping("/events/{eventId}/team/leader/reports")
    public ResponseEntity<ApiResponse<EventReportResponseDTO>> updateEventReportByTeamLeader(@PathVariable Long eventId, @RequestBody EventReportRequestDTO reportDTO) {
        try {
            EventReportResponseDTO responseDTO = eventService.updateEventReport(eventId, reportDTO);
            if (responseDTO == null) {
                ApiResponse<EventReportResponseDTO> apiResponse = new ApiResponse<>("success", "Report could not be updated", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<EventReportResponseDTO> apiResponse = new ApiResponse<>("success", "Report updated successfully", responseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<EventReportResponseDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


    @PostMapping("/events/{eventId}/team/leader/resource-requests")
    public ResponseEntity<ApiResponse<ResourceRequestResponseDTO>> requestAdditionalResourcesByTeamLeader(@PathVariable Long eventId, @RequestBody ResourceRequestDTO requestDTO) {
        try {
            ResourceRequestResponseDTO responseDTO = eventService.requestAdditionalResources(eventId, requestDTO);
            if (responseDTO == null) {
                ApiResponse<ResourceRequestResponseDTO> apiResponse = new ApiResponse<>("success", "Request could not be submitted", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<ResourceRequestResponseDTO> apiResponse = new ApiResponse<>("success", "Resource request submitted", responseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<ResourceRequestResponseDTO> error = new ApiResponse<>("failed", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }



    @PostMapping("/events/{eventId}/team/leader/member-ratings")
    public ResponseEntity<ApiResponse<MemberRatingResponseDTO>> submitMemberRatingsByTeamLeader(@PathVariable Long eventId, @RequestBody MemberRatingRequestDTO ratingsDTOs) {
        try {
            MemberRatingResponseDTO responseDTOs = eventService.submitMemberRating(eventId, ratingsDTOs);
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

}
