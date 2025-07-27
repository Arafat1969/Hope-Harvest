//package hope.harvest.event_volunteer;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import hope.harvest.event_volunteer.controller.FundController;
//import hope.harvest.event_volunteer.dto.ApiResponse;
//import hope.harvest.event_volunteer.dto.fund.*;
//import hope.harvest.event_volunteer.dto.volunteer.AssignVolunteerRequestDTO;
//import hope.harvest.event_volunteer.service.FundService;
//import jakarta.persistence.EntityNotFoundException;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mockito;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.boot.test.mock.mockito.MockBean;
//
//import org.springframework.http.MediaType;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.math.BigDecimal;
//import java.time.ZonedDateTime;
//import java.util.List;
//import java.util.UUID;
//
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.Mockito.*;
//
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
//
//@WebMvcTest(FundController.class)
//class FundControllerTest {
//
//    @Autowired private MockMvc mockMvc;
//    @Autowired private ObjectMapper objectMapper;
//
//    @MockBean private FundService fundService;
//
//    private UUID testAppId;
//    private UUID testUserId;
//
//    @BeforeEach
//    void setUp() {
//        testAppId = UUID.randomUUID();
//        testUserId = UUID.randomUUID();
//    }
//
//    @Test
//    void applyForFundsByUser_success() throws Exception {
//        FundApplicationRequestDTO request = new FundApplicationRequestDTO();
//        FundApplicationDetails response = new FundApplicationDetails(testAppId, "Education", BigDecimal.valueOf(1000), "{}", ZonedDateTime.now(), "PENDING", null, null, null);
//
//        when(fundService.applyForFundsByUser(any())).thenReturn(response);
//
//        mockMvc.perform(post("/api/v1/event-service/funds/apply")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.status").value("success"));
//    }
//
//    @Test
//    void seeAllFundApplicationsByUser_success() throws Exception {
//        FundApplicationDetails dto = new FundApplicationDetails(testAppId, "Health", BigDecimal.valueOf(500), "{}", ZonedDateTime.now(), "PENDING", null, null, null);
//        when(fundService.seeAllFundApplicationsByUser(testUserId)).thenReturn(List.of(dto));
//
//        mockMvc.perform(get("/api/v1/event-service/funds/me")
//                        .param("externalUserId", testUserId.toString()))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].applicationId").value(testAppId.toString()));
//    }
//
//    @Test
//    void seeFundApplicationOfAUserByApplicationId_success() throws Exception {
//        FundApplicationDetails dto = new FundApplicationDetails(testAppId, "Food", BigDecimal.valueOf(800), "{}", ZonedDateTime.now(), "PENDING", null, null, null);
//        when(fundService.seeFundApplicationOfAUserByApplicationId(testAppId)).thenReturn(dto);
//
//        mockMvc.perform(get("/api/v1/event-service/funds/me/{applicationId}", testAppId))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.applicationId").value(testAppId.toString()));
//    }
//
//    @Test
//    void seeFundApplicationOfAUserByApplicationId_notFound() throws Exception {
//        when(fundService.seeFundApplicationOfAUserByApplicationId(testAppId)).thenThrow(new EntityNotFoundException("Not found"));
//
//        mockMvc.perform(get("/api/v1/event-service/funds/me/{applicationId}", testAppId))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value("failed"));
//    }
//
//    @Test
//    void seeAllFundApplicationsAdmin_success() throws Exception {
//        FundDetailsAdminDTO dto = new FundDetailsAdminDTO();
//        dto.setApplicationId(testAppId);
//        when(fundService.seeAllFundApplicationsAdmin()).thenReturn(List.of(dto));
//
//        mockMvc.perform(get("/api/v1/event-service/admin/funds"))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data[0].applicationId").value(testAppId.toString()));
//    }
//
//    @Test
//    void seeFundApplicationAdminByApplicationId_success() throws Exception {
//        FundDetailsAdminDTO dto = new FundDetailsAdminDTO();
//        dto.setApplicationId(testAppId);
//        when(fundService.seeFundApplicationAdminByApplicationId(testAppId)).thenReturn(dto);
//
//        mockMvc.perform(get("/api/v1/event-service/admin/funds/{applicationId}", testAppId))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.applicationId").value(testAppId.toString()));
//    }
//
//    @Test
//    void seeFundApplicationAdminByApplicationId_notFound() throws Exception {
//        when(fundService.seeFundApplicationAdminByApplicationId(testAppId)).thenThrow(new EntityNotFoundException("Not found"));
//
//        mockMvc.perform(get("/api/v1/event-service/admin/funds/{applicationId}", testAppId))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value("failed"));
//    }
//
//    @Test
//    void completeFundVerification_success() throws Exception {
//        FundVerificationStatusUpdateRequestDTO request = new FundVerificationStatusUpdateRequestDTO();
//        FundDetailsAdminDTO response = new FundDetailsAdminDTO();
//        response.setApplicationId(testAppId);
//        response.setStatus("APPROVED");
//
//        when(fundService.completeFundVerification(eq(testAppId), any())).thenReturn(response);
//
//        mockMvc.perform(patch("/api/v1/event-service/admin/funds/{applicationId}/status", testAppId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data.status").value("APPROVED"));
//    }
//
//    @Test
//    void completeFundVerification_notFound() throws Exception {
//        FundVerificationStatusUpdateRequestDTO request = new FundVerificationStatusUpdateRequestDTO();
//        when(fundService.completeFundVerification(eq(testAppId), any())).thenThrow(new EntityNotFoundException("Missing"));
//
//        mockMvc.perform(patch("/api/v1/event-service/admin/funds/{applicationId}/status", testAppId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isNotFound());
//    }
//
//    @Test
//    void assignVolunteerForFundVerification_success() throws Exception {
//        AssignVolunteerRequestDTO request = new AssignVolunteerRequestDTO();
//        doNothing().when(fundService).assignVolunteerToFundVerification(eq(testAppId), any());
//
//        mockMvc.perform(post("/api/v1/event-service/admin/funds/{applicationId}/volunteer-assign", testAppId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.data").value("ok"));
//    }
//
//    @Test
//    void assignVolunteerForFundVerification_notFound() throws Exception {
//        AssignVolunteerRequestDTO request = new AssignVolunteerRequestDTO();
//        doThrow(new EntityNotFoundException("Volunteer not found"))
//                .when(fundService).assignVolunteerToFundVerification(eq(testAppId), any());
//
//        mockMvc.perform(post("/api/v1/event-service/admin/funds/{applicationId}/volunteer-assign", testAppId)
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isNotFound())
//                .andExpect(jsonPath("$.status").value("failed"));
//    }
//}
