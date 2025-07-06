package hope.harvest.event_volunteer;

import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.*;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.model.*;
import hope.harvest.event_volunteer.repo.*;
import hope.harvest.event_volunteer.service.AdminService;
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
class AdminServiceTest {

    @Mock private EventRepo eventRepo;
    @Mock private TeamRepo teamRepo;
    @Mock private TeamMemberRepo teamMemberRepo;
    @Mock private VolunteerRepo volunteerRepo;
    @Mock private VolunteerRatingRepo volunteerRatingRepo;

    @InjectMocks private AdminService adminService;

    private Event event;
    private Volunteer volunteer;
    private UUID campaignId;
    private Long eventId;
    private UUID volunteerId;

    @BeforeEach
    void setUp() {
        campaignId = UUID.randomUUID();
        eventId = 1L;
        volunteerId = UUID.randomUUID();

        event = new Event();
        event.setEventId(eventId);
        event.setTitle("Clean Dhaka");
        event.setLocationAddress("Street 1");
        event.setLocationCity("Dhaka");
        event.setLocationDistrict("Dhaka");

        volunteer = new Volunteer();
        volunteer.setVolunteerId(volunteerId);
        volunteer.setEmail("test@email.com");
        volunteer.setPhoneNumber("01712345678");
    }

    @Test
    void getAllEventsForAdmin_success() {
        when(eventRepo.findAll()).thenReturn(List.of(event));
        var result = adminService.getAllEventsForAdmin();
        assertEquals(1, result.size());
        assertEquals(eventId, result.get(0).getEventId());
    }

    @Test
    void createEventsForAdminByCampaignID_success() {
        EventCreateRequestDTO dto = new EventCreateRequestDTO();
        dto.setTitle("Event Title");
        dto.setLocationAddress("Addr");
        dto.setLocationCity("City");
        dto.setLocationDistrict("Dist");
        dto.setStartDate(ZonedDateTime.now());
        dto.setEndDate(ZonedDateTime.now().plusDays(1));
        dto.setBudgetAmount(BigDecimal.valueOf(1000));
        when(eventRepo.save(any())).thenReturn(event);
        var result = adminService.createEventsForAdminByCampaignID(campaignId, dto);
        assertEquals(eventId, result.getEventId());
    }

    @Test
    void getEventsForAdminByCampaignID_success() {
        when(eventRepo.findByExternalCampaignId(campaignId)).thenReturn(List.of(event));
        var result = adminService.getEventsForAdminByCampaignID(campaignId);
        assertEquals(1, result.size());
    }

    @Test
    void getEventForAdminByEventId_found() {
        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        var result = adminService.getEventForAdminByEventId(eventId);
        assertEquals(eventId, result.getEventId());
    }

    @Test
    void updateEventByEventId_found() {
        EventUpdateRequestDTO dto = new EventUpdateRequestDTO();
        dto.setDescription("Updated");
        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        when(eventRepo.save(any())).thenReturn(event);
        var result = adminService.updateEventByEventId(eventId, dto);
        assertEquals(eventId, result.getEventId());
    }

    @Test
    void updateEventStatusByEventId_found() {
        EventUpdateStatusDTO dto = new EventUpdateStatusDTO();
        dto.setStatus("COMPLETED");
        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        when(eventRepo.save(any())).thenReturn(event);
        var result = adminService.updateEventStatusByEventId(eventId, dto);
        assertEquals("COMPLETED", result.getStatus());
    }

    @Test
    void deleteEventByEventId_success() {
        when(eventRepo.existsById(eventId)).thenReturn(true);
        doNothing().when(eventRepo).deleteById(eventId);
        assertTrue(adminService.deleteEventByEventId(eventId));
    }

    @Test
    void formTeamForEventByEventId_success() {
        FormTeamRequestDTO dto = new FormTeamRequestDTO();
        dto.setLeaderId(volunteerId);
        dto.setName("Team 1");
        dto.setMemberList(List.of(volunteerId));

        when(eventRepo.findById(eventId)).thenReturn(Optional.of(event));
        when(volunteerRepo.findById(volunteerId)).thenReturn(Optional.of(volunteer));
        when(teamRepo.save(any())).thenAnswer(inv -> inv.getArgument(0));
        when(teamMemberRepo.saveAll(any())).thenReturn(null);

        TeamDetailsDTO result = adminService.formTeamForEventByEventId(eventId, dto);
        assertEquals("Team 1", result.getName());
    }

    @Test
    void seeTeamForEventByEventId_success() {
        Team team = new Team();
        team.setTeamId(1L);
        team.setName("Team Alpha");
        team.setEvent(event);
        team.setLeader(volunteer);

        TeamMember member = new TeamMember();
        member.setVolunteer(volunteer);

        when(teamRepo.findByEvent_EventId(eventId)).thenReturn(Optional.of(team));
        when(teamMemberRepo.findByTeam_TeamId(1L)).thenReturn(List.of(member));

        TeamDetailsDTO result = adminService.seeTeamForEventByEventId(eventId);
        assertEquals("Team Alpha", result.getName());
        assertEquals(1, result.getMembers().size());
    }

    @Test
    void rateTeamLeaderByEventId_success() {
        Team team = new Team();
        team.setTeamId(2L);
        team.setLeader(volunteer);
        team.setEvent(event);

        MemberRatingRequestDTO dto = new MemberRatingRequestDTO();
        dto.setPerformanceRating(5);
        dto.setPunctualityRating(5);
        dto.setCommunicationRating(5);
        dto.setHoursWorked(10);

        VolunteerRating rating = new VolunteerRating();
        rating.setRatingId(100L);
        rating.setOverallRating(BigDecimal.valueOf(5));

        when(teamRepo.findByEvent_EventId(eventId)).thenReturn(Optional.of(team));
        when(volunteerRatingRepo.save(any())).thenReturn(rating);
        when(volunteerRepo.save(any())).thenReturn(volunteer);

        MemberRatingResponseDTO response = adminService.rateTeamLeaderByEventId(eventId, dto);
        assertEquals(100L, response.getRatingId());
    }

    @Test
    void showAllVolunteersAdmin_success() {
        Volunteer v = new Volunteer();
        v.setVolunteerId(volunteerId);
        v.setEmail("admin@example.com");
        v.setPhoneNumber("01800000000");

        when(volunteerRepo.findAll()).thenReturn(List.of(v));
        var list = adminService.showAllVolunteersAdmin();
        assertEquals(1, list.size());
        assertEquals("admin@example.com", list.get(0).getEmail());
    }

    @Test
    void showAllVolunteerByVolunteerIdAdmin_found() {
        Volunteer v = new Volunteer();
        v.setVolunteerId(volunteerId);
        v.setEmail("one@hope.org");
        v.setPhoneNumber("01711112222");

        when(volunteerRepo.findById(volunteerId)).thenReturn(Optional.of(v));

        VolunteerResponseDTO result = adminService.showAllVolunteerByVolunteerIdAdmin(volunteerId);
        assertEquals("one@hope.org", result.getEmail());
    }

    @Test
    void showAllVolunteerByVolunteerIdAdmin_notFound() {
        when(volunteerRepo.findById(volunteerId)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> adminService.showAllVolunteerByVolunteerIdAdmin(volunteerId));
    }
}
