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


@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class DonationPaymentController {

    @Autowired
    private DonationPaymentService service;

    @PostMapping("/donations/anonymous")
    public ResponseEntity<ApiResponse<DonationResponseDTO>> makeAnonymousDonation(@RequestBody DonationRequestDTO requestDTO ){
        try{
            DonationResponseDTO responseDTO = service.makeAnonymousDonation(requestDTO);
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("success", "Donation Made,Payment Pending", responseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        }catch (Exception e){
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @GetMapping("/donations/anonymous/{trackingKey}")
    public ResponseEntity<ApiResponse<DonationSummaryDTO>> getAnonymousDonation(@PathVariable String trackingKey){
        try {
            DonationSummaryDTO summaryDTO = service.getAnonymousDonation(trackingKey);
            if(summaryDTO == null){
                ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error","Donation Information not found",null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("success","Anonymous Donation information found",summaryDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }

    @PostMapping("/donations")
    public ResponseEntity<ApiResponse<DonationResponseDTO>> makeDonation(@RequestBody DonationRequestDTO requestDTO ){
        try{
            DonationResponseDTO responseDTO = service.makeDonation(requestDTO);
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("success", "Donation Made,Payment Pending", responseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
        }catch (Exception e){
            ApiResponse<DonationResponseDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }


    @GetMapping("/donations")
    public ResponseEntity<ApiResponse<List<DonationSummaryDTO>>> getUserDonations(@RequestParam UUID userId){
        try {
            List<DonationSummaryDTO> donations = service.getUserDonations(userId);
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("success", "User donations fetched", donations);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<List<DonationSummaryDTO>> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
        }
    }

    @GetMapping("/donations/{donationID}")
    public ResponseEntity<ApiResponse<DonationSummaryDTO>> getParticularDonation(@PathVariable UUID donationID){
        try {
            DonationSummaryDTO summaryDTO = service.getParticularDonation(donationID);
            if(summaryDTO == null){
                ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error","Donation Information not found",null);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
            }
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("success","Anonymous Donation information found",summaryDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }


    @PostMapping("/payment/initiate")
    public ResponseEntity<ApiResponse<PaymentInitiateResponseDTO>> initiatePayment(@RequestBody PaymentInitiateRequestDTO requestDTO){
        try {
            PaymentInitiateResponseDTO responseDTO = service.initiatePayment(requestDTO);
            ApiResponse<PaymentInitiateResponseDTO> apiResponse = new ApiResponse<>("success","Payment initiated",responseDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<PaymentInitiateResponseDTO> error = new ApiResponse<>("error", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }


    @PostMapping("/payment/verify")
    public  ResponseEntity<ApiResponse<DonationSummaryDTO>> verifyPayment(@RequestBody PaymentVerifyRequestDTO requestDTO){
        try {
            DonationSummaryDTO summaryDTO = service.verifyPayment(requestDTO.getPaymentId(),requestDTO.getOtp());
            if(summaryDTO == null){
                ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("error","Invalid OTP",null);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiResponse);
            }
            ApiResponse<DonationSummaryDTO> apiResponse = new ApiResponse<>("success","OTP matched",summaryDTO);
            return ResponseEntity.status(HttpStatus.OK).body(apiResponse);
        }catch (Exception e){
            ApiResponse<DonationSummaryDTO> error = new ApiResponse<>("error","Internal Server Error",null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }


}
