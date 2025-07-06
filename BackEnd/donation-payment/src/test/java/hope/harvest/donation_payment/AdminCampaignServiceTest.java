package hope.harvest.donation_payment;

import hope.harvest.donation_payment.dto.adminCampaign.*;
import hope.harvest.donation_payment.model.*;
import hope.harvest.donation_payment.repo.*;
import hope.harvest.donation_payment.service.AdminCampaignService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminCampaignServiceTest {

    @Mock
    private CampaignRepo campaignRepo;

    @Mock
    private CampaignImagesRepo campaignImagesRepo;

    @Mock
    private CampaignCategoryRepo categoryRepo;

    @Mock
    private CampaignRequestRepo campaignRequestRepo;

    @InjectMocks
    private AdminCampaignService adminCampaignService;

    private UUID testCampaignId;
    private UUID testCategoryId;
    private UUID testRequestId;

    @BeforeEach
    void setUp() {
        testCampaignId = UUID.randomUUID();
        testCategoryId = UUID.randomUUID();
        testRequestId = UUID.randomUUID();
    }

    @Test
    void createNewCampaign_ValidRequest_ReturnsResponse() {
        // Arrange
        CampaignCreateRequestDTO requestDTO = new CampaignCreateRequestDTO();
        requestDTO.setCategoryId(testCategoryId);
        requestDTO.setTitle("Test Campaign");
        requestDTO.setGoalAmount(BigDecimal.valueOf(1000));
        requestDTO.setStartDate(LocalDate.now());
        requestDTO.setEndDate(LocalDate.now().plusDays(30));
        requestDTO.setImageUrls(List.of("url1", "url2"));

        CampaignCategory category = new CampaignCategory();
        category.setCategoryID(testCategoryId);

        Campaign savedCampaign = new Campaign();
        savedCampaign.setCampaignID(testCampaignId);
        savedCampaign.setTitle("Test Campaign");
        savedCampaign.setGoalAmount(BigDecimal.valueOf(1000));
        savedCampaign.setCollectedAmount(BigDecimal.ZERO);
        savedCampaign.setStartDate(LocalDate.now());
        savedCampaign.setEndDate(LocalDate.now().plusDays(30));

        when(categoryRepo.getReferenceById(testCategoryId)).thenReturn(category);
        when(campaignRepo.save(any(Campaign.class))).thenReturn(savedCampaign);

        // Act
        CampaignResponseDTO response = adminCampaignService.createNewCampaign(requestDTO);

        // Assert
        assertNotNull(response);
        assertEquals(testCampaignId, response.getCampaignId());
        assertEquals("Test Campaign", response.getTitle());
        verify(campaignRepo, times(1)).save(any(Campaign.class));
        verify(campaignImagesRepo, times(2)).save(any(CampaignImages.class));
    }

    @Test
    void createNewCampaign_MissingRequiredFields_ThrowsException() {
        CampaignCreateRequestDTO requestDTO = new CampaignCreateRequestDTO();

        assertThrows(IllegalArgumentException.class, () -> {
            adminCampaignService.createNewCampaign(requestDTO);
        });
    }

    @Test
    void updateCampaignByCampaignID_ValidUpdate_ReturnsUpdatedResponse() {
        // Arrange
        Campaign existingCampaign = new Campaign();
        existingCampaign.setCampaignID(testCampaignId);
        existingCampaign.setTitle("Old Title");
        existingCampaign.setDescription("Old Description");
        existingCampaign.setGoalAmount(BigDecimal.valueOf(500));

        CampaignUpdateRequestDTO updateDTO = new CampaignUpdateRequestDTO();
        updateDTO.setTitle("New Title");
        updateDTO.setDescription("New Description");
        updateDTO.setGoalAmount(BigDecimal.valueOf(1000));

        when(campaignRepo.findById(testCampaignId)).thenReturn(Optional.of(existingCampaign));
        when(campaignRepo.save(any(Campaign.class))).thenReturn(existingCampaign);

        // Act
        CampaignResponseDTO response = adminCampaignService.updateCampaignByCampaignID(testCampaignId, updateDTO);

        // Assert
        assertEquals("New Title", response.getTitle());
        assertEquals("Updated successfully", response.getStatus());
        verify(campaignRepo, times(1)).save(existingCampaign);
    }

    @Test
    void approveCampaignRequestByRequestID_ValidRequest_UpdatesStatus() {
        // Arrange
        CampaignRequest request = new CampaignRequest();
        request.setRequestId(testRequestId);
        request.setStatus("PENDING");

        CampaignRequestStatusUpdateDTO updateDTO = new CampaignRequestStatusUpdateDTO();
        updateDTO.setStatus("APPROVED");
        updateDTO.setFeedback("Looks good");

        when(campaignRequestRepo.findById(testRequestId)).thenReturn(Optional.of(request));
        when(campaignRequestRepo.save(any(CampaignRequest.class))).thenReturn(request);

        // Act
        CampaignRequestResponseDTO response = adminCampaignService.approveCampaignRequestByRequestID(testRequestId, updateDTO);

        // Assert
        assertEquals("APPROVED", response.getStatus());
        verify(campaignRequestRepo, times(1)).save(request);
    }
}