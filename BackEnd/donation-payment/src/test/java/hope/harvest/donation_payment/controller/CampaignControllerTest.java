package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.controller.CampaignController;
import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.campaign.*;
import hope.harvest.donation_payment.dto.donation.DonationSummaryDTO;
import hope.harvest.donation_payment.service.CampaignService;
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
class CampaignControllerTest {

    @Mock
    private CampaignService campaignService;

    @InjectMocks
    private CampaignController campaignController;

    private final UUID testCampaignId = UUID.randomUUID();
    private final UUID testCategoryId = UUID.randomUUID();
    private final UUID testUserId = UUID.randomUUID();
    private final UUID testRequestId = UUID.randomUUID();

    @Test
    void showCampaignsHomepage_Success() {
        // Arrange
        CampaignSummaryDTO campaign = new CampaignSummaryDTO();
        when(campaignService.showCampaignsHomepage()).thenReturn(List.of(campaign));

        // Act
        ResponseEntity<ApiResponse<List<CampaignSummaryDTO>>> response =
                campaignController.showCampaignsHomepage();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void showCampaignsHomepage_NotFound() {
        // Arrange
        when(campaignService.showCampaignsHomepage()).thenReturn(null);

        // Act
        ResponseEntity<ApiResponse<List<CampaignSummaryDTO>>> response =
                campaignController.showCampaignsHomepage();

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void showAllCampaignCategories_Success() {
        // Arrange
        CampaignCategoryDTO category = new CampaignCategoryDTO();
        when(campaignService.showAllCampaignCategories()).thenReturn(List.of(category));

        // Act
        ResponseEntity<ApiResponse<List<CampaignCategoryDTO>>> response =
                campaignController.showAllCampaignCategories();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void getAllImagesForGallery_Success() {
        // Arrange
        ImageResponseDto image = new ImageResponseDto();
        when(campaignService.getAllImagesForGallery()).thenReturn(List.of(image));

        // Act
        ResponseEntity<ApiResponse<List<ImageResponseDto>>> response =
                campaignController.getAllImagesForGallery();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void showCampaignsOfParticularCategory_Success() {
        // Arrange
        CampaignSummaryDTO campaign = new CampaignSummaryDTO();
        when(campaignService.showCampaignsOfParticularCategory(testCategoryId))
                .thenReturn(List.of(campaign));

        // Act
        ResponseEntity<ApiResponse<List<CampaignSummaryDTO>>> response =
                campaignController.showCampaignsOfParticularCategory(testCategoryId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void showDetailsOfParticularCampaign_Success() {
        // Arrange
        CampaignDetailsDTO campaign = new CampaignDetailsDTO();
        when(campaignService.showDetailsOfParticularCampaign(testCampaignId))
                .thenReturn(campaign);

        // Act
        ResponseEntity<ApiResponse<CampaignDetailsDTO>> response =
                campaignController.showDetailsOfParticularCampaign(testCampaignId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertNotNull(response.getBody().getData());
    }

    @Test
    void requestForNewCampaign_Success() {
        // Arrange
        CampaignRequestDTO request = new CampaignRequestDTO();
        CampaignRequestResponseDTO responseDto = new CampaignRequestResponseDTO();
        when(campaignService.requestForNewCampaign(request)).thenReturn(responseDto);

        // Act
        ResponseEntity<ApiResponse<CampaignRequestResponseDTO>> response =
                campaignController.requestForNewCampaign(request);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        verify(campaignService).requestForNewCampaign(request);
    }

    @Test
    void getAllRequestsForAParticularUser_Success() {
        // Arrange
        CampaignRequestResponseDTO request = new CampaignRequestResponseDTO();
        when(campaignService.getAllRequestsForAParticularUser(testUserId))
                .thenReturn(List.of(request));

        // Act
        ResponseEntity<ApiResponse<List<CampaignRequestResponseDTO>>> response =
                campaignController.getAllRequestsForAParticularUser(testUserId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void getParticularRequestForAParticularUser_Success() {
        // Arrange
        CampaignRequestResponseDTO request = new CampaignRequestResponseDTO();
        when(campaignService.getParticularRequestForAParticularUser(testUserId, testRequestId))
                .thenReturn(request);

        // Act
        ResponseEntity<ApiResponse<CampaignRequestResponseDTO>> response =
                campaignController.getParticularRequestForAParticularUser(testUserId, testRequestId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertNotNull(response.getBody().getData());
    }

    @Test
    void getUserDonationsToCampaign_Success() {
        // Arrange
        DonationSummaryDTO donation = new DonationSummaryDTO();
        when(campaignService.getUserDonationsToCampaign(testCampaignId, testUserId))
                .thenReturn(List.of(donation));

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                campaignController.getUserDonationsToCampaign(testCampaignId, testUserId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void getUserDonationsToCampaign_NotFound() {
        // Arrange
        when(campaignService.getUserDonationsToCampaign(testCampaignId, testUserId))
                .thenReturn(null);

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                campaignController.getUserDonationsToCampaign(testCampaignId, testUserId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    // Additional error case tests
    @Test
    void showCampaignsHomepage_Exception() {
        // Arrange
        when(campaignService.showCampaignsHomepage())
                .thenThrow(new RuntimeException("Service error"));

        // Act
        ResponseEntity<ApiResponse<List<CampaignSummaryDTO>>> response =
                campaignController.showCampaignsHomepage();

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void requestForNewCampaign_Exception() {
        // Arrange
        CampaignRequestDTO request = new CampaignRequestDTO();
        when(campaignService.requestForNewCampaign(request))
                .thenThrow(new RuntimeException("Invalid request"));

        // Act
        ResponseEntity<ApiResponse<CampaignRequestResponseDTO>> response =
                campaignController.requestForNewCampaign(request);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }
}