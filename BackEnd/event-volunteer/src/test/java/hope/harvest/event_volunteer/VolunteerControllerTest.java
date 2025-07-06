package hope.harvest.event_volunteer;

import com.fasterxml.jackson.databind.ObjectMapper;
import hope.harvest.event_volunteer.controller.VolunteerController;
import hope.harvest.event_volunteer.dto.*;
import hope.harvest.event_volunteer.dto.fund.*;
import hope.harvest.event_volunteer.dto.team.TeamSummaryDTO;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.service.VolunteerService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VolunteerController.class)
public class VolunteerControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private VolunteerService volunteerService;

    private UUID volunteerId;

    @BeforeEach
    void setup() {
        volunteerId = UUID.randomUUID();
    }

    @Test
    void registerVolunteer_success() throws Exception {
        VolunteerRegistrationRequestDTO request = new VolunteerRegistrationRequestDTO();
        VolunteerResponseDTO response = new VolunteerResponseDTO();

        when(volunteerService.registerForVolunteer(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/event-service/volunteers/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void seeMyVolunteerProfile_success() throws Exception {
        when(volunteerService.seeMyVolunteerProfile(volunteerId)).thenReturn(new VolunteerResponseDTO());

        mockMvc.perform(get("/api/v1/event-service/volunteers/{volunteerId}", volunteerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void updateMyVolunteerProfile_success() throws Exception {
        VolunteerUpdateRequestDTO request = new VolunteerUpdateRequestDTO();
        when(volunteerService.updateMyVolunteerProfile(any())).thenReturn(new VolunteerResponseDTO());

        mockMvc.perform(put("/api/v1/event-service/volunteers/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showTeamsForParticularVolunteer_success() throws Exception {
        when(volunteerService.showTeamsForParticularVolunteer(volunteerId)).thenReturn(List.of(new TeamSummaryDTO()));

        mockMvc.perform(get("/api/v1/event-service/volunteers/me/teams")
                        .param("volunteerId", volunteerId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showAssignedFundVerifications_success() throws Exception {
        when(volunteerService.showAssignedFundVerficationForParticularVolunteer(volunteerId))
                .thenReturn(List.of(new FundVerificationSummary()));

        mockMvc.perform(get("/api/v1/event-service/volunteers/me/fund-verifications")
                        .param("volunteerId", volunteerId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showFundVerificationById_success() throws Exception {
        UUID verificationId = UUID.randomUUID();
        when(volunteerService.showAssignedFundVerficationForParticularVolunteerByVerificationId(verificationId))
                .thenReturn(new FundVerificationDetailsDTO());

        mockMvc.perform(get("/api/v1/event-service/volunteers/me/fund-verifications/{id}", verificationId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void submitFundVerificationReport_success() throws Exception {
        FundVerificationReportRequestDTO request = new FundVerificationReportRequestDTO();
        when(volunteerService.submitFundVerificationReportByVerificationId(any()))
                .thenReturn(new FundVerificationReportResponseDTO());

        mockMvc.perform(put("/api/v1/event-service/volunteers/me/fund-verifications/{id}", UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showRatingsForVolunteer_success() throws Exception {
        when(volunteerService.showRatingsForParticularVolunteer(volunteerId)).thenReturn(List.of(new RatingSummaryDTO()));

        mockMvc.perform(get("/api/v1/event-service/volunteers/me/ratings")
                        .param("volunteerId", volunteerId.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    void showRatingDetails_success() throws Exception {
        when(volunteerService.showRatingDetailsForParticularVolunteer(1L)).thenReturn(new RatingDetailsDTO());

        mockMvc.perform(get("/api/v1/event-service/volunteers/me/ratings/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }
}
