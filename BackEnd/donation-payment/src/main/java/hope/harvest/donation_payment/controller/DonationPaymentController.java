package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.dto.ApiResponse;
import hope.harvest.donation_payment.dto.donation.*;
import hope.harvest.donation_payment.dto.payment.*;
import hope.harvest.donation_payment.service.DonationPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;


/**
 * This class handles Donation and dummy payment gateway endpoints.
 * <p>
 * Users can donate anonymously or with their information.
 * Users can also keep track of their donations using a tracking key or userId.
 * Dummy payment gateway endpoints are implemented to provide realtime payment simulations.
 * </p>
 *
 * @author Md Hasin Arafat Al Sifat
 * @since 1.0
 */
@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class DonationPaymentController {

    /**
     * This is an object of the DonationPayment service class
     * where all the business logic and database queries are handled.
     */
    @Autowired
    private DonationPaymentService service;

    /**
     * Make an anonymous donation to a campaign.
     *
     * @param requestDTO the <b>DonationRequestDTO</b> object which contains:
     *                   <ul>
     *                      <li><b>UUID externalUserId</b> – null for anonymous donation</li>
     *                      <li><b>UUID campaignId</b> – the ID of the campaign user wants to donate to</li>
     *                      <li><b>BigDecimal amount</b> – the amount to be donated</li>
     *                      <li><b>boolean isAnonymous</b> – true for anonymous donation</li>
     *                      <li><b>String status</b> – usually set to "PENDING" before payment verification</li>
     *                   </ul>
     * @return ApiResponse containing the donation response and payment pending status
     */
    @PostMapping("/donations/anonymous")
    public ResponseEntity<ApiResponse<DonationResponseDTO>> makeAnonymousDonation(@RequestBody DonationRequestDTO requestDTO) {
        try {
            DonationResponseDTO responseDTO = service.makeAnonymousDonation(requestDTO);
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("success", "Donation Made,Payment Pending", responseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    /**
     * Retrieve anonymous donation information by tracking key.
     *
     * @param trackingKey a unique string provided to anonymous donors to check their donation status
     * @return ApiResponse containing donation summary if found, otherwise error
     */
    @GetMapping("/donations/anonymous/{trackingKey}")
    public ResponseEntity<ApiResponse<DonationSummaryDTO>> getAnonymousDonation(@PathVariable String trackingKey) {
        try {
            DonationSummaryDTO summaryDTO = service.getAnonymousDonation(trackingKey);
            if (summaryDTO == null) {
                ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", "Donation Information not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("success", "Anonymous Donation information found", summaryDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    /**
     * Make a registered donation (non-anonymous) to a campaign.
     *
     * @param requestDTO the donation request object containing user ID, campaign ID, amount, and other metadata
     * @return ApiResponse containing the donation response and payment pending status
     */
    @PostMapping("/donations")
    public ResponseEntity<ApiResponse<DonationResponseDTO>> makeDonation(@RequestBody DonationRequestDTO requestDTO) {
        try {
            DonationResponseDTO responseDTO = service.makeDonation(requestDTO);
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("success", "Donation Made,Payment Pending", responseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    /**
     * Retrieve all donations made by a specific user.
     *
     * @param userId the UUID of the user
     * @return ApiResponse containing a list of the user's donation summaries
     */
    @GetMapping("/donations")
    public ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> getUserDonations(@RequestParam UUID userId) {
        try {
            List<DonationSummaryDTO> donations = service.getUserDonations(userId);
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("success", "User donations fetched", donations);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    /**
     * Retrieve a particular donation's details using the donation ID.
     *
     * @param donationID the UUID of the donation
     * @return ApiResponse containing the donation summary if found
     */
    @GetMapping("/donations/{donationID}")
    public ResponseEntity<ApiResponse<DonationSummaryDTO>> getParticularDonation(@PathVariable UUID donationID) {
        try {
            DonationSummaryDTO summaryDTO = service.getParticularDonation(donationID);
            if (summaryDTO == null) {
                ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", "Donation Information not found", null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("success", "Anonymous Donation information found", summaryDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    /**
     * Initiates a dummy payment session using provided donation and user details.
     *
     * @param requestDTO the payment initiation request containing:
     *                   <ul>
     *                      <li>donationId</li>
     *                      <li>amount</li>
     *                      <li>user metadata</li>
     *                   </ul>
     * @return ApiResponse containing the payment gateway redirect URL
     */
    @PostMapping("/payment/initiate")
    public ResponseEntity<ApiResponse<PaymentInitiateResponseDTO>> initiatePayment(@RequestBody PaymentInitiateRequestDTO requestDTO) {
        try {
            PaymentInitiateResponseDTO responseDTO = service.initiatePayment(requestDTO);
            ApiResponse<PaymentInitiateResponseDTO> apiResponse = new ApiResponse<>("success", "Payment initiated", responseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<PaymentInitiateResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Verifies the dummy payment using OTP or other validation methods.
     *
     * @param requestDTO the payment verification request containing OTP and transaction data
     * @return ApiResponse with donation summary if OTP is valid, or an error message if invalid
     */
    @PostMapping("/payment/verify")
    public ResponseEntity<ApiResponse<DonationSummaryDTO>> verifyPayment(@RequestBody PaymentVerifyRequestDTO requestDTO) {
        try {
            DonationSummaryDTO summaryDTO = service.verifyPayment(requestDTO);
            if (summaryDTO == null) {
                ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", "Invalid OTP", null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
            }
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("success", "OTP matched", summaryDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<DonationSummaryDTO> error = new ApiResponse<>("error", "Internal Server Error", null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
