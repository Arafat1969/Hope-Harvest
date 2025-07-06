package hope.harvest.event_volunteer;

import com.fasterxml.jackson.databind.ObjectMapper;
import hope.harvest.event_volunteer.controller.AdminController;
import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.*;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.service.AdminService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
class AdminControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AdminService adminService;

    private UUID campaignId;
    private Long eventId;
    private UUID volunteerId;

    @BeforeEach
    void setup() {
        campaignId = UUID.randomUUID();
        eventId = 1L;
        volunteerId = UUID.randomUUID();
    }

    @Test
    void getAllEventsForAdmin_success() throws Exception {
        when(adminService.getAllEventsForAdmin()).thenReturn(List.of(new EventSummaryDTO()));
        mockMvc.perform(get("/api/v1/event-service/admin/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void createEventsForAdminByCampaignID_success() throws Exception {
        EventCreateRequestDTO dto = new EventCreateRequestDTO();
        EventDetailsDTO response = new EventDetailsDTO();
        when(adminService.createEventsForAdminByCampaignID(eq(campaignId), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/event-service/admin/campaigns/{campaignId}/events", campaignId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void getEventsForAdminByCampaignID_success() throws Exception {
        when(adminService.getEventsForAdminByCampaignID(campaignId)).thenReturn(List.of(new EventSummaryDTO()));
        mockMvc.perform(get("/api/v1/event-service/admin/campaigns/{campaignId}/events", campaignId))
                .andExpect(status().isOk());
    }

    @Test
    void getEventForAdminByEventId_success() throws Exception {
        when(adminService.getEventForAdminByEventId(eventId)).thenReturn(new EventDetailsDTO());
        mockMvc.perform(get("/api/v1/event-service/admin/events/{eventId}", eventId))
                .andExpect(status().isOk());
    }

    @Test
    void updateEventByEventId_success() throws Exception {
        EventUpdateRequestDTO dto = new EventUpdateRequestDTO();
        when(adminService.updateEventByEventId(eq(eventId), any())).thenReturn(new EventDetailsDTO());

        mockMvc.perform(put("/api/v1/event-service/admin/events/{eventId}", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void updateEventStatusByEventId_success() throws Exception {
        EventUpdateStatusDTO dto = new EventUpdateStatusDTO();
        when(adminService.updateEventStatusByEventId(eq(eventId), any())).thenReturn(new EventDetailsDTO());

        mockMvc.perform(patch("/api/v1/event-service/admin/events/{eventId}/status", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void deleteEventByEventId_success() throws Exception {
        when(adminService.deleteEventByEventId(eventId)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/event-service/admin/events/{eventId}", eventId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void formTeamForEventByEventId_success() throws Exception {
        FormTeamRequestDTO dto = new FormTeamRequestDTO();
        when(adminService.formTeamForEventByEventId(eq(eventId), any())).thenReturn(new TeamDetailsDTO());

        mockMvc.perform(post("/api/v1/event-service/admin/events/{eventId}/team", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void seeTeamForEventByEventId_success() throws Exception {
        when(adminService.seeTeamForEventByEventId(eventId)).thenReturn(new TeamDetailsDTO());
        mockMvc.perform(get("/api/v1/event-service/admin/events/{eventId}/team", eventId))
                .andExpect(status().isOk());
    }

    @Test
    void rateTeamLeaderByEventId_success() throws Exception {
        MemberRatingRequestDTO dto = new MemberRatingRequestDTO();
        MemberRatingResponseDTO response = new MemberRatingResponseDTO();
        when(adminService.rateTeamLeaderByEventId(eq(eventId), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/event-service/admin/events/{eventId}/team/leader", eventId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());
    }

    @Test
    void showAllVolunteersAdmin_success() throws Exception {
        when(adminService.showAllVolunteersAdmin()).thenReturn(List.of(new VolunteerSummaryDTO()));
        mockMvc.perform(get("/api/v1/event-service/admin/volunteers"))
                .andExpect(status().isOk());
    }

    @Test
    void showAllVolunteerByVolunteerIdAdmin_success() throws Exception {
        when(adminService.showAllVolunteerByVolunteerIdAdmin(volunteerId)).thenReturn(new VolunteerResponseDTO());
        mockMvc.perform(get("/api/v1/event-service/admin/volunteers/{volunteerId}", volunteerId))
                .andExpect(status().isOk());
    }
}
