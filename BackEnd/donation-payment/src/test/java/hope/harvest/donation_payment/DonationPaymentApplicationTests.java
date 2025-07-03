package hope.harvest.donation_payment;

import hope.harvest.donation_payment.repo.CampaignRepo;
import hope.harvest.donation_payment.repo.DonationRepo;
import hope.harvest.donation_payment.repo.PaymentRepo;
import hope.harvest.donation_payment.service.DonationPaymentService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
public class DonationPaymentApplicationTests {

    @Mock
    private DonationRepo donationRepo;

    @Mock
    private PaymentRepo paymentRepo;

    @Mock
    private CampaignRepo campaignRepo;

    @InjectMocks
    private DonationPaymentService donationPaymentService;

    @Test
    void contextLoads() {
        // Basic test to ensure service loads correctly
        assertNotNull(donationPaymentService);
    }
}
