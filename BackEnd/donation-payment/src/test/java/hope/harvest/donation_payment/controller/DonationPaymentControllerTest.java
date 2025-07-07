package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.controller.DonationPaymentController;
import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.dto.payment.*;
import hope.harvest.donation_payment.service.DonationPaymentService;
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
class DonationPaymentControllerTest {

    @Mock
    private DonationPaymentService donationPaymentService;

    @InjectMocks
    private DonationPaymentController donationPaymentController;

    private final UUID testUserId = UUID.randomUUID();
    private final UUID testDonationId = UUID.randomUUID();
    private final String testTrackingKey = "track-123";

    @Test
    void makeAnonymousDonation_Success() {
        // Arrange
        DonationRequestDTO request = new DonationRequestDTO();
        DonationResponseDTO responseDto = new DonationResponseDTO();
        when(donationPaymentService.makeAnonymousDonation(request)).thenReturn(responseDto);

        // Act
        ResponseEntity<ApiResponse<DonationResponseDTO>> response =
                donationPaymentController.makeAnonymousDonation(request);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals("Donation Made,Payment Pending", response.getBody().getMessage());
    }

    @Test
    void makeAnonymousDonation_Exception() {
        // Arrange
        DonationRequestDTO request = new DonationRequestDTO();
        when(donationPaymentService.makeAnonymousDonation(request))
                .thenThrow(new RuntimeException("Invalid request"));

        // Act
        ResponseEntity<ApiResponse<DonationResponseDTO>> response =
                donationPaymentController.makeAnonymousDonation(request);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void getAnonymousDonation_Success() {
        // Arrange
        DonationSummaryDTO summary = new DonationSummaryDTO();
        when(donationPaymentService.getAnonymousDonation(testTrackingKey)).thenReturn(summary);

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.getAnonymousDonation(testTrackingKey);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
    }

    @Test
    void getAnonymousDonation_NotFound() {
        // Arrange
        when(donationPaymentService.getAnonymousDonation(testTrackingKey)).thenReturn(null);

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.getAnonymousDonation(testTrackingKey);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void makeDonation_Success() {
        // Arrange
        DonationRequestDTO request = new DonationRequestDTO();
        DonationResponseDTO responseDto = new DonationResponseDTO();
        when(donationPaymentService.makeDonation(request)).thenReturn(responseDto);

        // Act
        ResponseEntity<ApiResponse<DonationResponseDTO>> response =
                donationPaymentController.makeDonation(request);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
    }

    @Test
    void getUserDonations_Success() {
        // Arrange
        DonationSummaryDTO donation = new DonationSummaryDTO();
        when(donationPaymentService.getUserDonations(testUserId)).thenReturn(List.of(donation));

        // Act
        ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> response =
                donationPaymentController.getUserDonations(testUserId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
        assertEquals(1, response.getBody().getData().size());
    }

    @Test
    void getParticularDonation_Success() {
        // Arrange
        DonationSummaryDTO summary = new DonationSummaryDTO();
        when(donationPaymentService.getParticularDonation(testDonationId)).thenReturn(summary);

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.getParticularDonation(testDonationId);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
    }

    @Test
    void getParticularDonation_NotFound() {
        // Arrange
        when(donationPaymentService.getParticularDonation(testDonationId)).thenReturn(null);

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.getParticularDonation(testDonationId);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void initiatePayment_Success() {
        // Arrange
        PaymentInitiateRequestDTO request = new PaymentInitiateRequestDTO();
        PaymentInitiateResponseDTO responseDto = new PaymentInitiateResponseDTO();
        when(donationPaymentService.initiatePayment(request)).thenReturn(responseDto);

        // Act
        ResponseEntity<ApiResponse<PaymentInitiateResponseDTO>> response =
                donationPaymentController.initiatePayment(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
    }

    @Test
    void verifyPayment_Success() {
        // Arrange
        PaymentVerifyRequestDTO request = new PaymentVerifyRequestDTO();
        DonationSummaryDTO summary = new DonationSummaryDTO();
        when(donationPaymentService.verifyPayment(request)).thenReturn(summary);

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.verifyPayment(request);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("success", response.getBody().getStatus());
    }

    @Test
    void verifyPayment_InvalidOtp() {
        // Arrange
        PaymentVerifyRequestDTO request = new PaymentVerifyRequestDTO();
        when(donationPaymentService.verifyPayment(request)).thenReturn(null);

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.verifyPayment(request);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }

    @Test
    void verifyPayment_Exception() {
        // Arrange
        PaymentVerifyRequestDTO request = new PaymentVerifyRequestDTO();
        when(donationPaymentService.verifyPayment(request))
                .thenThrow(new RuntimeException("Service error"));

        // Act
        ResponseEntity<ApiResponse<DonationSummaryDTO>> response =
                donationPaymentController.verifyPayment(request);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("error", response.getBody().getStatus());
    }
}