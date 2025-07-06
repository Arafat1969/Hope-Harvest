package hope.harvest.event_volunteer;

import hope.harvest.event_volunteer.dto.fund.*;
import hope.harvest.event_volunteer.dto.team.TeamSummaryDTO;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.model.*;
import hope.harvest.event_volunteer.repo.*;
import hope.harvest.event_volunteer.service.VolunteerService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VolunteerServiceTest {

    @Mock VolunteerRepo volunteerRepo;
    @Mock TeamMemberRepo teamMemberRepo;
    @Mock FundVerificationRepo fundVerificationRepo;
    @Mock VolunteerRatingRepo volunteerRatingRepo;

    @InjectMocks
    VolunteerService volunteerService;

    private UUID volunteerId;
    private Volunteer volunteer;

    @BeforeEach
    void setup() {
        volunteerId = UUID.randomUUID();
        volunteer = new Volunteer();
        volunteer.setVolunteerId(volunteerId);
        volunteer.setExternalUserId(UUID.randomUUID());
        volunteer.setPhoneNumber("0123456789");
        volunteer.setEmail("test@example.com");
        volunteer.setTotalHours(0);
        volunteer.setAssignmentsCompleted(0);
        volunteer.setAverageRating(BigDecimal.ZERO);
    }

    @Test
    void registerForVolunteer_success() {
        VolunteerRegistrationRequestDTO request = new VolunteerRegistrationRequestDTO();
        request.setExternalUserId(UUID.randomUUID());

        when(volunteerRepo.existsByExternalUserId(any())).thenReturn(false);
        when(volunteerRepo.save(any())).thenReturn(volunteer);

        VolunteerResponseDTO result = volunteerService.registerForVolunteer(request);

        assertNotNull(result);
        assertEquals(volunteerId, result.getVolunteerId());
    }

    @Test
    void registerForVolunteer_alreadyExists_throwsException() {
        VolunteerRegistrationRequestDTO request = new VolunteerRegistrationRequestDTO();
        request.setExternalUserId(UUID.randomUUID());

        when(volunteerRepo.existsByExternalUserId(any())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> volunteerService.registerForVolunteer(request));
    }

    @Test
    void seeMyVolunteerProfile_success() {
        when(volunteerRepo.findById(volunteerId)).thenReturn(Optional.of(volunteer));

        VolunteerResponseDTO result = volunteerService.seeMyVolunteerProfile(volunteerId);

        assertEquals(volunteerId, result.getVolunteerId());
    }

    @Test
    void updateMyVolunteerProfile_success() {
        VolunteerUpdateRequestDTO request = new VolunteerUpdateRequestDTO();
        request.setVolunteerId(volunteerId);
        request.setPhoneNumber("0987654321");
        request.setAvailability(true);

        when(volunteerRepo.findById(volunteerId)).thenReturn(Optional.of(volunteer));
        when(volunteerRepo.save(any())).thenReturn(volunteer);

        VolunteerResponseDTO result = volunteerService.updateMyVolunteerProfile(request);
        assertEquals("0987654321", result.getPhoneNumber());
    }

    @Test
    void showTeamsForParticularVolunteer_success() {
        // Setup team and event
        Team team = new Team();
        team.setTeamId(1L);  // <-- Use Long, not UUID
        team.setName("Team A");

        Event event = new Event();
        event.setTitle("Event A");
        event.setLocationAddress("Dhaka");
        event.setLocationCity("Dhaka City");
        event.setLocationDistrict("Dhaka District");
        team.setEvent(event);

        team.setLeader(volunteer);  // The same volunteer is leader

        // Setup team member
        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setVolunteer(volunteer); // same volunteer

        when(teamMemberRepo.findByVolunteer_VolunteerId(volunteerId)).thenReturn(List.of(member));

        // Act
        List<TeamSummaryDTO> result = volunteerService.showTeamsForParticularVolunteer(volunteerId);

        // Assert
        assertEquals(1, result.size());
        TeamSummaryDTO dto = result.get(0);
        assertEquals("Team A", dto.getName());
        assertEquals("Event A", dto.getEventTitle());
        assertTrue(dto.isLeader());  // Volunteer is leader
    }


    @Test
    void showAssignedFundVerifications_success() {
        FundApplication application = new FundApplication();
        application.setFullName("John Doe");
        application.setPurpose("Purpose");
        application.setAmount(BigDecimal.TEN);
        application.setStatus("PENDING");

        FundVerification verification = new FundVerification();
        verification.setVerificationId(UUID.randomUUID());
        verification.setVerificationDueDate(ZonedDateTime.now());
        verification.setApplication(application);

        when(fundVerificationRepo.findByAssignedVolunteer_VolunteerId(volunteerId)).thenReturn(List.of(verification));

        List<FundVerificationSummary> result = volunteerService.showAssignedFundVerficationForParticularVolunteer(volunteerId);

        assertEquals(1, result.size());
    }

    @Test
    void showAssignedFundVerificationById_success() {
        FundVerification verification = new FundVerification();
        verification.setVerificationId(UUID.randomUUID());
        FundApplication application = new FundApplication();
        application.setExternalUserId(UUID.randomUUID());
        application.setBankInfoJson(new BankInfo("123", "Savings", "Main"));
        verification.setApplication(application);

        when(fundVerificationRepo.findById(any())).thenReturn(Optional.of(verification));

        FundVerificationDetailsDTO result = volunteerService.showAssignedFundVerficationForParticularVolunteerByVerificationId(verification.getVerificationId());

        assertEquals(verification.getVerificationId(), result.getVerificationId());
    }

    @Test
    void submitFundVerificationReportByVerificationId_success() {
        FundVerification verification = new FundVerification();
        verification.setVerificationId(UUID.randomUUID());
        FundApplication application = new FundApplication();
        application.setExternalUserId(UUID.randomUUID());
        application.setBankInfoJson(new BankInfo("123", "Savings", "Main"));
        verification.setApplication(application);

        FundVerificationReportRequestDTO request = new FundVerificationReportRequestDTO();
        request.setVerificationId(verification.getVerificationId());
        request.setReport("All good");
        request.setRecommendedAmount(BigDecimal.TEN);
        request.setRecommendation("Approved");

        when(fundVerificationRepo.findById(request.getVerificationId())).thenReturn(Optional.of(verification));
        when(fundVerificationRepo.save(any())).thenReturn(verification);

        FundVerificationReportResponseDTO result = volunteerService.submitFundVerificationReportByVerificationId(request);

        assertEquals(request.getReport(), result.getReport());
    }

    @Test
    void showRatingsForVolunteer_success() {
        VolunteerRating rating = new VolunteerRating();
        Team team = new Team();
        team.setName("Team A");
        rating.setTeam(team);
        rating.setRatingId(1L);
        rating.setOverallRating(BigDecimal.ONE);

        when(volunteerRatingRepo.findByVolunteer_VolunteerId(volunteerId)).thenReturn(List.of(rating));

        List<RatingSummaryDTO> result = volunteerService.showRatingsForParticularVolunteer(volunteerId);

        assertEquals(1, result.size());
    }

    @Test
    void showRatingDetails_success() {
        VolunteerRating rating = new VolunteerRating();
        rating.setRatingId(1L);
        rating.setVolunteer(volunteer);
        Team team = new Team();
        team.setName("Team X");
        Event event = new Event();
        event.setTitle("Event X");
        team.setEvent(event);
        team.setLeader(volunteer);
        rating.setTeam(team);
        rating.setRatedBy(volunteer);

        when(volunteerRatingRepo.findById(1L)).thenReturn(Optional.of(rating));

        RatingDetailsDTO result = volunteerService.showRatingDetailsForParticularVolunteer(1L);

        assertEquals(1L, result.getRatingId());
        assertEquals("Team X", result.getTeamName());
    }
}
