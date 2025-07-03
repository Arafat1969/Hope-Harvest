package hope.harvest.donation_payment;

import hope.harvest.donation_payment.dto.campaign.*;
import hope.harvest.donation_payment.dto.donation.DonationSummaryDTO;
import hope.harvest.donation_payment.model.*;
        import hope.harvest.donation_payment.repo.*;
import hope.harvest.donation_payment.service.CampaignService;
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
class CampaignServiceTest {

    @Mock
    private CampaignRepo campaignRepo;

    @Mock
    private CampaignImagesRepo campaignImagesRepo;

    @Mock
    private CampaignCategoryRepo categoryRepo;

    @Mock
    private CampaignRequestRepo campaignRequestRepo;

    @Mock
    private DonationRepo donationRepo;

    @InjectMocks
    private CampaignService campaignService;

    private UUID testCampaignId;
    private UUID testCategoryId;
    private UUID testUserId;
    private UUID testRequestId;

    @BeforeEach
    void setUp() {
        testCampaignId = UUID.randomUUID();
        testCategoryId = UUID.randomUUID();
        testUserId = UUID.randomUUID();
        testRequestId = UUID.randomUUID();
    }

    @Test
    void showCampaignsHomepage_ReturnsCampaignsWithImages() {
        // Arrange
        Campaign campaign = new Campaign();
        campaign.setCampaignID(testCampaignId);
        campaign.setTitle("Test Campaign");
        campaign.setDescription("Test Description");
        campaign.setGoalAmount(BigDecimal.valueOf(1000));

        CampaignImages image = new CampaignImages();
        image.setImageUrl("test-url");

        when(campaignRepo.findAll()).thenReturn(List.of(campaign));
        when(campaignImagesRepo.findByCampaign(campaign)).thenReturn(Optional.of(image));

        // Act
        List<CampaignSummaryDTO> result = campaignService.showCampaignsHomepage();

        // Assert
        assertEquals(1, result.size());
        assertEquals("test-url", result.get(0).getImageUrl());
    }

    @Test
    void showDetailsOfParticularCampaign_ValidId_ReturnsDetails() {
        // Arrange
        Campaign campaign = new Campaign();
        campaign.setCampaignID(testCampaignId);
        campaign.setTitle("Test Campaign");
        campaign.setDetails("Test Details");

        CampaignCategory category = new CampaignCategory();
        category.setCategoryID(testCategoryId);
        category.setName("Test Category");
        campaign.setCategory(category);

        CampaignImages image = new CampaignImages();
        image.setImageUrl("test-url");

        when(campaignRepo.findById(testCampaignId)).thenReturn(Optional.of(campaign));
        when(campaignImagesRepo.findByCampaign(campaign)).thenReturn(Optional.of(image));

        // Act
        CampaignDetailsDTO result = campaignService.showDetailsOfParticularCampaign(testCampaignId);

        // Assert
        assertEquals("Test Campaign", result.getTitle());
        assertEquals("Test Category", result.getCategory().getName());
    }

    @Test
    void requestForNewCampaign_ValidRequest_CreatesRequest() {
        // Arrange
        CampaignRequestDTO requestDTO = new CampaignRequestDTO();
        requestDTO.setExternalUserId(testUserId);
        requestDTO.setTitle("Test Request");
        requestDTO.setStartDate(LocalDate.now());
        requestDTO.setEndDate(LocalDate.now().plusDays(30));
        requestDTO.setCategoryId(testCategoryId);

        CampaignCategory category = new CampaignCategory();
        category.setCategoryID(testCategoryId);

        CampaignRequest savedRequest = new CampaignRequest();
        savedRequest.setRequestId(testRequestId);
        savedRequest.setStatus("PENDING");

        when(categoryRepo.findById(testCategoryId)).thenReturn(Optional.of(category));
        when(campaignRequestRepo.save(any(CampaignRequest.class))).thenReturn(savedRequest);

        // Act
        CampaignRequestResponseDTO response = campaignService.requestForNewCampaign(requestDTO);

        // Assert
        assertEquals("PENDING", response.getStatus());
        verify(campaignRequestRepo, times(1)).save(any(CampaignRequest.class));
    }

    @Test
    void getUserDonationsToCampaign_ValidIds_ReturnsDonations() {
        // Arrange
        Donation donation = new Donation();
        donation.setDonationID(UUID.randomUUID());
        donation.setAmount(BigDecimal.valueOf(100));

        Campaign campaign = new Campaign();
        campaign.setCampaignID(testCampaignId);
        campaign.setTitle("Test Campaign");
        donation.setCampaign(campaign);

        when(donationRepo.findByCampaign_CampaignIDAndExternalUserID(testCampaignId, testUserId))
                .thenReturn(List.of(donation));

        // Act
        List<DonationSummaryDTO> result = campaignService.getUserDonationsToCampaign(testCampaignId, testUserId);

        // Assert
        assertEquals(1, result.size());
        assertEquals(BigDecimal.valueOf(100), result.get(0).getAmount());
    }
}