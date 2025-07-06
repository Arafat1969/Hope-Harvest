package hope.harvest.event_volunteer;

import com.fasterxml.jackson.databind.ObjectMapper;
import hope.harvest.event_volunteer.controller.EventController;
import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.TeamDetailsDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingRequestDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingResponseDTO;
import hope.harvest.event_volunteer.service.EventService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
public class EventControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private EventService eventService;

    private UUID campaignId;
    private Long eventId;

    @BeforeEach
    void setup() {
        campaignId = UUID.randomUUID();
        eventId = 1L;
    }

    @Test
    void showAllEventsByCampaignId_success() throws Exception {
        when(eventService.showAllEventsByCampaignId(campaignId)).thenReturn(List.of(new EventDetailsDTO()));
        mockMvc.perform(get("/api/v1/event-service/{campaignId}/events", campaignId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showEventOfACampaignByEventId_success() throws Exception {
        when(eventService.getEventByEventId(eventId)).thenReturn(new EventDetailsDTO());
        mockMvc.perform(get("/api/v1/event-service/events/{eventId}", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showEventTeamByEventID_success() throws Exception {
        when(eventService.showEventTeamByEventID(eventId)).thenReturn(new TeamDetailsDTO());
        mockMvc.perform(get("/api/v1/event-service/events/{eventId}/team", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void submitEventReportByTeamLeader_success() throws Exception {
        EventReportRequestDTO request = new EventReportRequestDTO();
        EventReportResponseDTO response = new EventReportResponseDTO();

        when(eventService.submitEventReport(eq(eventId), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/event-service/events/{eventId}/team/leader/reports", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void updateEventReportByTeamLeader_success() throws Exception {
        EventReportRequestDTO request = new EventReportRequestDTO();
        EventReportResponseDTO response = new EventReportResponseDTO();

        when(eventService.updateEventReport(eq(eventId), any())).thenReturn(response);

        mockMvc.perform(put("/api/v1/event-service/events/{eventId}/team/leader/reports", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void requestAdditionalResourcesByTeamLeader_success() throws Exception {
        ResourceRequestDTO request = new ResourceRequestDTO();
        ResourceRequestResponseDTO response = new ResourceRequestResponseDTO();

        when(eventService.requestAdditionalResources(eq(eventId), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/event-service/events/{eventId}/team/leader/resource-requests", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void submitMemberRatingsByTeamLeader_success() throws Exception {
        MemberRatingRequestDTO request = new MemberRatingRequestDTO();
        MemberRatingResponseDTO response = new MemberRatingResponseDTO();

        when(eventService.submitMemberRating(eq(eventId), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/event-service/events/{eventId}/team/leader/member-ratings", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void submitEventReportByTeamLeader_notFound() throws Exception {
        when(eventService.submitEventReport(eq(eventId), any())).thenReturn(null);

        mockMvc.perform(post("/api/v1/event-service/events/{eventId}/team/leader/reports", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new EventReportRequestDTO())))
                .andExpect(status().isNotFound());
    }

    @Test
    void submitMemberRatingsByTeamLeader_notFound() throws Exception {
        when(eventService.submitMemberRating(eq(eventId), any())).thenReturn(null);

        mockMvc.perform(post("/api/v1/event-service/events/{eventId}/team/leader/member-ratings", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new MemberRatingRequestDTO())))
                .andExpect(status().isNotFound());
    }
}
