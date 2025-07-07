package hope.harvest.donation_payment;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class DonationPaymentApplicationTests {

	@Test
	void contextLoads() {
		// This test verifies that the Spring context loads successfully
	}

	@Test
	void mainMethodTest() {
		// Test that the main method can be called without throwing an exception
		DonationPaymentApplication.main(new String[] {});
	}
}