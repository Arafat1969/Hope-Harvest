package hope.harvest.event_volunteer.controller;

import hope.harvest.event_volunteer.dto.ApiResponse;
import hope.harvest.event_volunteer.service.AdminEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class AdminEventController {
//    @Autowired
//    AdminEventService adminEventService;
//
//    @GetMapping("/admin/events")
//    public ResponseEntity<ApiResponse> getAllEventsForAdmin(){
//
//    }
//
//    @PostMapping ("/admin/campaigns/{campaignId}/events")
//    public ResponseEntity<ApiResponse> getAllEventsForAdminByCampaignID(){
//
//    }
//
//    @GetMapping ("/admin/events/{eventId}")
//    public ResponseEntity<ApiResponse> getEventForAdminByEventId(){
//
//    }
//
//    @PutMapping ("/admin/events/{eventId}")
//    public ResponseEntity<ApiResponse> updateEventByEventId(){
//
//    }
//
//    @PatchMapping ("/admin/events/{eventId}/status")
//    public ResponseEntity<ApiResponse> updateEventStatusByEventId(){
//
//    }
//
//    @DeleteMapping ("/admin/events/{eventId}")
//    public ResponseEntity<ApiResponse> deleteEventByEventId(){
//
//    }
//
//    @PostMapping ("/admin/events/{eventId}/team")
//    public ResponseEntity<ApiResponse> formTeamForEventByEventId(){
//
//    }
//
//    @GetMapping ("/admin/events/{eventId}/team")
//    public ResponseEntity<ApiResponse> seeTeamForEventByEventId(){
//
//    }
//
//    @GetMapping ("/admin/events/{eventId}/report")
//    public ResponseEntity<ApiResponse> getEventReportsByReportId(){
//
//    }
//
//    @PostMapping ("/admin/events/{eventId}/team/leader")
//    public ResponseEntity<ApiResponse> rateTeamLeaderByEventId(){
//
//    }
//
//    @GetMapping ("/admin/events/statistics")
//    public ResponseEntity<ApiResponse> getOverallEventStatistics(){
//
//    }


}
