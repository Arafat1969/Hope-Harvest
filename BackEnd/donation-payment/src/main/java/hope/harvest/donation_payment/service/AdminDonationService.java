package hope.harvest.donation_payment.service;

import hope.harvest.donation_payment.dto.donation.DonationDetailsDTO;
import hope.harvest.donation_payment.dto.donation.DonationStatisticsDTO;
import hope.harvest.donation_payment.dto.donation.DonationSummaryDTO;
import hope.harvest.donation_payment.dto.donation.DonationUsageDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminDonationService {
    public List<DonationSummaryDTO> getAllDonations() {
        return null;
    }

    public DonationDetailsDTO getDonationByDonationId(UUID donationId) {
        return null;
    }

    public List<DonationSummaryDTO> getDonationsByCampaign(UUID campaignId) {
        return null;
    }

    public DonationUsageDTO recordDonationUsage(UUID donationId, DonationUsageDTO donationUsageDTO) {
        return null;
    }

    public DonationStatisticsDTO getDonationStatistics() {
        return null;
    }
}
