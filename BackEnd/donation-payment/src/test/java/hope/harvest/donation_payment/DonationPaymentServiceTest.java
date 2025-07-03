package hope.harvest.donation_payment;

import hope.harvest.donation_payment.dto.donation.*;
        import hope.harvest.donation_payment.dto.payment.*;
        import hope.harvest.donation_payment.model.*;
        import hope.harvest.donation_payment.repo.*;
import hope.harvest.donation_payment.service.DonationPaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import hope.harvest.donation_payment.model.DonationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DonationPaymentServiceTest {

    @Mock
    private DonationRepo donationRepo;

    @Mock
    private PaymentRepo paymentRepo;

    @Mock
    private CampaignRepo campaignRepo;

    @InjectMocks
    private DonationPaymentService donationPaymentService;

    private UUID testDonationId;
    private UUID testCampaignId;
    private UUID testPaymentId;
    private UUID testUserId;

    @BeforeEach
    void setUp() {
        testDonationId = UUID.randomUUID();
        testCampaignId = UUID.randomUUID();
        testPaymentId = UUID.randomUUID();
        testUserId = UUID.randomUUID();
    }

    @Test
    void makeDonation_ValidRequest_CreatesDonation() {
        // Arrange
        DonationRequestDTO requestDTO = new DonationRequestDTO();
        requestDTO.setExternalUserId(testUserId);
        requestDTO.setCampaignId(testCampaignId);
        requestDTO.setAmount(BigDecimal.valueOf(100));

        Campaign campaign = new Campaign();
        campaign.setCampaignID(testCampaignId);

        Donation savedDonation = new Donation();
        savedDonation.setDonationID(testDonationId);
        savedDonation.setAmount(BigDecimal.valueOf(100));

        when(campaignRepo.findById(testCampaignId)).thenReturn(Optional.of(campaign));
        when(donationRepo.save(any(Donation.class))).thenReturn(savedDonation);

        // Act
        DonationResponseDTO response = donationPaymentService.makeDonation(requestDTO);

        // Assert
        assertEquals(testDonationId, response.getDonationId());
        verify(donationRepo, times(1)).save(any(Donation.class));
    }

    @Test
    void initiatePayment_ValidDonation_CreatesPayment() {
        // Arrange
        Donation donation = new Donation();
        donation.setDonationID(testDonationId);

        PaymentInitiateRequestDTO requestDTO = new PaymentInitiateRequestDTO();
        requestDTO.setDonationId(testDonationId);
        requestDTO.setGatewayName("Test Gateway");
        requestDTO.setAmount(BigDecimal.valueOf(100));

        when(donationRepo.findById(testDonationId)).thenReturn(Optional.of(donation));
        when(paymentRepo.findByDonation(donation)).thenReturn(Optional.empty());
        when(paymentRepo.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment p = invocation.getArgument(0);
            p.setPaymentId(testPaymentId);
            return p;
        });

        // Act
        PaymentInitiateResponseDTO response = donationPaymentService.initiatePayment(requestDTO);

        // Assert
        assertNotNull(response.getOtp());
        assertEquals(testPaymentId, response.getPaymentId());
    }

    @Test
    void verifyPayment_ValidOtp_CompletesTransaction() {
        BigDecimal expectedAmount = new BigDecimal("100");

        Campaign campaign = new Campaign();
        campaign.setCollectedAmount(BigDecimal.ZERO);

        Donation donation = new Donation();
        donation.setDonationID(testDonationId);
        donation.setCampaign(campaign);
        donation.setStatus(String.valueOf(DonationStatus.PENDING));
        donation.setAmount(BigDecimal.ZERO); // will be updated
        donation.setDonationDate(ZonedDateTime.now());

        Payment payment = new Payment();
        payment.setPaymentId(testPaymentId);
        payment.setDonation(donation);
        payment.setStatus("PENDING");
        payment.setOtp("123456");
        payment.setAmount(expectedAmount);
        payment.setGatewayName("Nagad");

        donation.setPaymentMethod(null);  // Initially null
        campaign.setTitle("Sample Campaign");

        PaymentVerifyRequestDTO request = new PaymentVerifyRequestDTO();
        request.setPaymentId(testPaymentId);
        request.setOtp("123456");
        request.setOrganizationName("BUET");

        when(paymentRepo.findById(testPaymentId)).thenReturn(Optional.of(payment));
        when(donationRepo.save(any(Donation.class))).thenAnswer(i -> i.getArgument(0));
        when(paymentRepo.save(any(Payment.class))).thenReturn(payment);
        when(campaignRepo.save(any(Campaign.class))).thenReturn(campaign);

        DonationSummaryDTO result = donationPaymentService.verifyPayment(request);

        assertEquals(DonationStatus.COMPLETED.name(), donation.getStatus());  // ✅ correct: string vs string

        assertEquals(expectedAmount, donation.getAmount());
        assertEquals("Nagad", donation.getPaymentMethod());
        assertEquals(expectedAmount, result.getAmount());
    }


    @Test
    void verifyPayment_InvalidOtp_ThrowsException() {
        // Arrange
        Payment payment = new Payment();
        payment.setPaymentId(testPaymentId);
        payment.setOtp("123456");
        payment.setStatus("PENDING");

        PaymentVerifyRequestDTO requestDTO = new PaymentVerifyRequestDTO();
        requestDTO.setPaymentId(testPaymentId);
        requestDTO.setOtp("654321");

        when(paymentRepo.findById(testPaymentId)).thenReturn(Optional.of(payment));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            donationPaymentService.verifyPayment(requestDTO);
        });
    }
}