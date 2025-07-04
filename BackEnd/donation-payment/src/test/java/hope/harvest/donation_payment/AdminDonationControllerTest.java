package hope.harvest.donation_payment;

import hope.harvest.donation_payment.controller.AdminDonationController;
import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.donation.*;
        import hope.harvest.donation_payment.service.AdminDonationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminDonationControllerTest {

    @Mock
    private AdminDonationService donationService;

    @InjectMocks
    private AdminDonationController donationController;

    private final UUID testDonationId = UUID.randomUUID();
    private final UUID testCampaignId = UUID.randomUUID();

    @Test
    void getAllDonations_Success() {
        // Arrange
        DonationSummaryDTO donation = new DonationSummaryDTO();
        when(donationService.getAllDonations()).thenReturn(List.of(donation));

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                donationController.getAllDonations();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
        verify(donationService).getAllDonations();
    }

    @Test
    void getAllDonations_Exception() {
        // Arrange
        when(donationService.getAllDonations())
                .thenThrow(new RuntimeException("Database error"));

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                donationController.getAllDonations();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void getDonationByDonationId_Success() {
        // Arrange
        DonationDetailsDTO donation = new DonationDetailsDTO();
        when(donationService.getDonationByDonationId(testDonationId)).thenReturn(donation);

        // Act
        ResponseEntity<ApiResponse<DonationDetailsDTO>> response =
                donationController.getDonationByDonationId(testDonationId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertNotNull(response.getBody().getData());
    }

    @Test
    void getDonationByDonationId_NotFound() {
        // Arrange
        when(donationService.getDonationByDonationId(testDonationId)).thenReturn(null);

        // Act
        ResponseEntity<ApiResponse<DonationDetailsDTO>> response =
                donationController.getDonationByDonationId(testDonationId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void getDonationByDonationId_Exception() {
        // Arrange
        when(donationService.getDonationByDonationId(testDonationId))
                .thenThrow(new RuntimeException("Service error"));

        // Act
        ResponseEntity<ApiResponse<DonationDetailsDTO>> response =
                donationController.getDonationByDonationId(testDonationId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void getDonationsByCampaign_Success() {
        // Arrange
        DonationSummaryDTO donation = new DonationSummaryDTO();
        when(donationService.getDonationsByCampaign(testCampaignId)).thenReturn(List.of(donation));

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                donationController.getDonationsByCampaign(testCampaignId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void getDonationsByCampaign_Exception() {
        // Arrange
        when(donationService.getDonationsByCampaign(testCampaignId))
                .thenThrow(new RuntimeException("Campaign not found"));

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                donationController.getDonationsByCampaign(testCampaignId);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void recordDonationUsage_Success() {
        // Arrange
        DonationUsageDTO usageDTO = new DonationUsageDTO();
        DonationUsageDTO responseDTO = new DonationUsageDTO();
        when(donationService.recordDonationUsage(testDonationId, usageDTO)).thenReturn(responseDTO);

        // Act
        ResponseEntity<ApiResponse<DonationUsageDTO>> response =
                donationController.recordDonationUsage(testDonationId, usageDTO);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        verify(donationService).recordDonationUsage(testDonationId, usageDTO);
    }

    @Test
    void recordDonationUsage_Exception() {
        // Arrange
        DonationUsageDTO usageDTO = new DonationUsageDTO();
        when(donationService.recordDonationUsage(testDonationId, usageDTO))
                .thenThrow(new RuntimeException("Invalid donation"));

        // Act
        ResponseEntity<ApiResponse<DonationUsageDTO>> response =
                donationController.recordDonationUsage(testDonationId, usageDTO);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void getDonationStatistics_Success() {
        // Arrange
        DonationStatisticsDTO stats = new DonationStatisticsDTO();
        when(donationService.getDonationStatistics()).thenReturn(stats);

        // Act
        ResponseEntity<ApiResponse<DonationStatisticsDTO>> response =
                donationController.getDonationStatistics();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertNotNull(response.getBody().getData());
    }

    @Test
    void getDonationStatistics_Exception() {
        // Arrange
        when(donationService.getDonationStatistics())
                .thenThrow(new RuntimeException("Stats unavailable"));

        // Act
        ResponseEntity<ApiResponse<DonationStatisticsDTO>> response =
                donationController.getDonationStatistics();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }
}