package hope.harvest.event_volunteer;

import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.TeamDetailsDTO;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.model.*;
import hope.harvest.event_volunteer.repo.*;
import hope.harvest.event_volunteer.service.EventService;
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
class EventServiceTest {

    @Mock private EventRepo eventRepo;
    @Mock private TeamRepo teamRepo;
    @Mock private TeamMemberRepo teamMemberRepo;
    @Mock private VolunteerRatingRepo volunteerRatingRepo;
    @Mock private VolunteerRepo volunteerRepo;

    @InjectMocks private EventService eventService;

    private UUID campaignId;
    private Long eventId;
    private UUID volunteerId;

    private Event event;
    private Volunteer volunteer;

    @BeforeEach
    void setUp() {
        campaignId = UUID.randomUUID();
        eventId = 1L;
        volunteerId = UUID.randomUUID();

        RequiredGood good = new RequiredGood(
                "Gloves",
                10,
                "pair",
                new BigDecimal("50.00"),
                new BigDecimal("500.00")
        );

        event = new Event();
        event.setEventId(eventId);
        event.setTitle("Test Event");
        event.setRequiredGoods(List.of(good));  // ✅ correct type

        volunteer = new Volunteer();
        volunteer.setVolunteerId(volunteerId);
        volunteer.setEmail("v@example.com");
    }


    @Test
    void showAllEventsByCampaignId_success() {
        when(eventRepo.findByExternalCampaignId(campaignId)).thenReturn(List.of(event));
        var result = eventService.showAllEventsByCampaignId(campaignId);
        assertEquals(1, result.size());
        assertEquals(eventId, result.get(0).getEventId());
    }

    @Test
    void getEventByEventId_success() {
        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        var result = eventService.getEventByEventId(eventId);
        assertEquals(eventId, result.getEventId());
    }

    @Test
    void showEventTeamByEventID_success() {
        Team team = new Team();
        team.setTeamId(10L);
        team.setEvent(event);
        team.setLeader(volunteer);
        team.setName("Team X");

        TeamMember member = new TeamMember();
        member.setVolunteer(volunteer);

        when(teamRepo.findByEvent_EventId(eventId)).thenReturn(Optional.of(team));
        when(teamMemberRepo.findByTeam_TeamId(10L)).thenReturn(List.of(member));

        TeamDetailsDTO result = eventService.showEventTeamByEventID(eventId);
        assertEquals("Team X", result.getName());
        assertEquals(1, result.getMembers().size());
    }

    @Test
    void submitEventReport_success() {
        EventReportRequestDTO dto = new EventReportRequestDTO();
        dto.setReport("Report content");

        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        var result = eventService.submitEventReport(eventId, dto);

        assertEquals("Report content", result.getReport());
        verify(eventRepo).save(event);
    }

    @Test
    void updateEventReport_success() {
        EventReportRequestDTO dto = new EventReportRequestDTO();
        dto.setReport("Updated Report");

        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        var result = eventService.updateEventReport(eventId, dto);

        assertEquals("Updated Report", result.getReport());
        verify(eventRepo).save(event);
    }

    @Test
    void submitMemberRating_success() {
        Team team = new Team();
        team.setTeamId(2L);
        team.setLeader(volunteer);

        TeamMember teamMember = new TeamMember();
        teamMember.setVolunteer(volunteer);

        MemberRatingRequestDTO dto = new MemberRatingRequestDTO();
        dto.setVolunteerId(volunteerId);
        dto.setPerformanceRating(5);
        dto.setPunctualityRating(5);
        dto.setCommunicationRating(5);
        dto.setHoursWorked(10);

        VolunteerRating rating = new VolunteerRating();
        rating.setRatingId(200L);
        rating.setOverallRating(BigDecimal.valueOf(5));

        when(teamRepo.findByEvent_EventId(eventId)).thenReturn(Optional.of(team));
        when(teamMemberRepo.findByTeam_TeamIdAndVolunteer_VolunteerId(team.getTeamId(), volunteerId)).thenReturn(Optional.of(teamMember));
        when(volunteerRatingRepo.save(any())).thenReturn(rating);
        when(volunteerRepo.save(any())).thenReturn(volunteer);

        MemberRatingResponseDTO result = eventService.submitMemberRating(eventId, dto);
        assertEquals(200L, result.getRatingId());
    }

    @Test
    void requestAdditionalResources_success() {
        // Arrange: create a RequiredGood object
        RequiredGood good = new RequiredGood(
                "Blanket",                 // item
                50,                        // quantity
                "pcs",                     // unit
                new BigDecimal("150.00"), // unitPrice
                new BigDecimal("7500.00") // totalPrice
        );

        // Wrap it in a list
        List<RequiredGood> goodsList = List.of(good);

        // Create DTO and set the list
        ResourceRequestDTO dto = new ResourceRequestDTO();
        dto.setRequestedGoods(goodsList);

        // Set up event in mock
        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));

        // Act
        ResourceRequestResponseDTO result = eventService.requestAdditionalResources(eventId, dto);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getUpdatedRequiredGoods().size());
        assertEquals("Blanket", result.getUpdatedRequiredGoods().get(0).getItem());
        assertEquals("Blanket", event.getRequiredGoods().get(0).getItem());

        verify(eventRepo, times(1)).save(event);
    }


    @Test
    void getEventByEventId_notFound() {
        when(eventRepo.findById(eventId)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> eventService.getEventByEventId(eventId));
    }

    @Test
    void submitMemberRating_teamNotFound() {
        when(teamRepo.findByEvent_EventId(eventId)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> eventService.submitMemberRating(eventId, new MemberRatingRequestDTO()));
    }

    @Test
    void submitMemberRating_volunteerNotInTeam() {
        Team team = new Team();
        team.setTeamId(2L);
        when(teamRepo.findByEvent_EventId(eventId)).thenReturn(Optional.of(team));
        when(teamMemberRepo.findByTeam_TeamIdAndVolunteer_VolunteerId(any(), any())).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> eventService.submitMemberRating(eventId, new MemberRatingRequestDTO()));
    }
}
