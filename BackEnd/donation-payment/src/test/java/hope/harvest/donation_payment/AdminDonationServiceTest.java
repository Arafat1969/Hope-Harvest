package hope.harvest.donation_payment;
import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.model.*;
import hope.harvest.donation_payment.repo.*;
import hope.harvest.donation_payment.service.AdminDonationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminDonationServiceTest {

    @Mock
    private DonationRepo donationRepo;

    @Mock
    private PaymentRepo paymentRepo;

    @Mock
    private CampaignRepo campaignRepo;

    @Mock
    private CampaignCategoryRepo campaignCategoryRepo;

    @Mock
    private DonationUsageRepo donationUsageRepo;

    @InjectMocks
    private AdminDonationService adminDonationService;

    private UUID testDonationId;
    private UUID testCampaignId;
    private UUID testCategoryId;

    @BeforeEach
    void setUp() {
        testDonationId = UUID.randomUUID();
        testCampaignId = UUID.randomUUID();
        testCategoryId = UUID.randomUUID();
    }

    @Test
    void getAllDonations_ReturnsCompletedDonations() {
        // Arrange
        Donation donation = new Donation();
        donation.setDonationID(testDonationId);
        donation.setStatus("COMPLETED");
        donation.setAmount(BigDecimal.valueOf(100));
        donation.setDonationDate(ZonedDateTime.now());

        Campaign campaign = new Campaign();
        campaign.setCampaignID(testCampaignId);
        campaign.setTitle("Test Campaign");
        donation.setCampaign(campaign);

        Payment payment = new Payment();
        payment.setGatewayName("Test Gateway");

        when(donationRepo.findByStatus("COMPLETED")).thenReturn(List.of(donation));
        when(paymentRepo.findByDonation(donation)).thenReturn(Optional.of(payment));

        // Act
        List<DonationSummaryDTO> result = adminDonationService.getAllDonations();

        // Assert
        assertEquals(1, result.size());
        assertEquals("Test Campaign", result.get(0).getCampaignTitle());
        verify(donationRepo, times(1)).findByStatus("COMPLETED");
    }

    @Test
    void getDonationStatistics_ReturnsCorrectStats() {
        // Arrange
        Donation completed = new Donation();
        completed.setStatus("COMPLETED");
        completed.setAmount(BigDecimal.valueOf(100));

        Donation failed = new Donation();
        failed.setStatus("FAILED");
        failed.setAmount(BigDecimal.valueOf(50));

        Campaign campaign = new Campaign();
        campaign.setTitle("Test Campaign");

        completed.setCampaign(campaign);
        failed.setCampaign(campaign);

        when(donationRepo.findAll()).thenReturn(List.of(completed, failed));

        // Act
        DonationStatisticsDTO stats = adminDonationService.getDonationStatistics();

        // Assert
        assertEquals(2, stats.getTotalDonations());
        assertEquals(BigDecimal.valueOf(150), stats.getTotalAmount());
        assertEquals(1, stats.getSuccessfulDonations());
        assertEquals(1, stats.getFailedDonations());
    }

    @Test
    void recordDonationUsage_ValidInput_CreatesUsageRecord() {
        // Arrange
        Donation donation = new Donation();
        Campaign campaign = new Campaign();
        CampaignCategory category = new CampaignCategory();

        DonationUsageDTO requestDTO = new DonationUsageDTO();
        requestDTO.setDonationId(testDonationId);
        requestDTO.setCampaignId(testCampaignId);
        requestDTO.setCategoryId(testCategoryId);
        requestDTO.setAmount(BigDecimal.valueOf(100));
        requestDTO.setDescription("Test usage");

        when(donationRepo.findById(testDonationId)).thenReturn(Optional.of(donation));
        when(campaignRepo.findById(testCampaignId)).thenReturn(Optional.of(campaign));
        when(campaignCategoryRepo.findById(testCategoryId)).thenReturn(Optional.of(category));
        when(donationUsageRepo.save(any(DonationUsage.class))).thenReturn(new DonationUsage());

        // Act
        DonationUsageDTO result = adminDonationService.recordDonationUsage(testDonationId, requestDTO);

        // Assert
        assertNotNull(result);
        verify(donationUsageRepo, times(1)).save(any(DonationUsage.class));
    }
}
