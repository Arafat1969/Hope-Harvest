package hope.harvest.event_volunteer.controller;

import hope.harvest.event_volunteer.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class EventController {
    @GetMapping ("/events/{eventId}")
    public ResponseEntity<ApiResponse> showAllEvents(){

    }

    @GetMapping ("/campaigns/{campaignId}/events")
    public ResponseEntity<ApiResponse> showAllEventsByCampaignId(){

    }


    @GetMapping("/campaigns/{campaignId}/events/{eventId}")
    public ResponseEntity<ApiResponse> showEventOfACampaignByEventId(){

    }

    @GetMapping ("/events/{eventId}/team")
    public ResponseEntity<ApiResponse showEventTeamByEventID(){

    }

    @GetMapping ("/events/{eventId}/team/leader")
    public ResponseEntity<ApiResponse> showEventTeamLeaderDashBoardByEventID(){

    }


    @PostMapping ("/events/{eventId}/team/leader/reports")
    public ResponseEntity<ApiResponse> submitEventReportByTeamLeader(){

    }

    @PutMapping ("/events/{eventId}/team/leader/reports")
    public ResponseEntity<ApiResponse> updateEventReportByTeamLeader(){

    }

    @PostMapping ("/events/{eventId}/team/leader/resource-requests")
    public ResponseEntity<ApiResponse> requestAdditionalResourcesByTeamLeader(){

    }


    @PostMapping ("/events/{eventId}/team/leader/member-ratings")
    public ResponseEntity<ApiResponse> submitMemberRatingsByTeamLeader(){

    }
}
