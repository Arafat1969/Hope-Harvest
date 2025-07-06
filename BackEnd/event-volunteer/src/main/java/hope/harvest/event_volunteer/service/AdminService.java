package hope.harvest.event_volunteer.service;

import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.FormTeamRequestDTO;
import hope.harvest.event_volunteer.dto.team.TeamDetailsDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingRequestDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingResponseDTO;
import hope.harvest.event_volunteer.dto.volunteer.VolunteerResponseDTO;
import hope.harvest.event_volunteer.dto.volunteer.VolunteerSummaryDTO;
import hope.harvest.event_volunteer.model.*;
import hope.harvest.event_volunteer.repo.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminService {


    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private TeamRepo teamRepo;

    @Autowired
    private TeamMemberRepo teamMemberRepo;

    @Autowired
    private VolunteerRepo volunteerRepo;

    @Autowired
    private VolunteerRatingRepo volunteerRatingRepo;

    public List<EventSummaryDTO> getAllEventsForAdmin() {
        return eventRepo.findAll().stream()
                .map(this::mapToSummaryDTO)
                .collect(Collectors.toList());
    }

    public EventDetailsDTO createEventsForAdminByCampaignID(UUID campaignId, EventCreateRequestDTO requestDTO) {
        Event event = new Event();

        event.setTitle(requestDTO.getTitle());
        event.setDescription(requestDTO.getDescription());
        event.setReport(null);
        event.setStartDate(requestDTO.getStartDate());
        event.setEndDate(requestDTO.getEndDate());
        event.setLocationAddress(requestDTO.getLocationAddress());
        event.setLocationCity(requestDTO.getLocationCity());
        event.setLocationDistrict(requestDTO.getLocationDistrict());
        event.setStatus(requestDTO.getStatus());
        event.setRequiredGoods(requestDTO.getRequiredGoods());
        event.setBudgetAmount(requestDTO.getBudgetAmount());
        event.setExternalCampaignId(campaignId);

        Event newEvent = eventRepo.save(event);

        return mapToDetailsDTO(newEvent);
    }

    public List<EventSummaryDTO> getEventsForAdminByCampaignID(UUID campaignId) {
        List<Event> eventList = eventRepo.findByExternalCampaignId(campaignId);

        return eventList.stream()
                .map(this::mapToSummaryDTO)
                .collect(Collectors.toList());
    }

    public EventDetailsDTO getEventForAdminByEventId(Long eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        return mapToDetailsDTO(event);
    }

    public EventDetailsDTO updateEventByEventId(Long eventId, EventUpdateRequestDTO requestDTO) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        if (requestDTO.getDescription() != null)
            event.setDescription(requestDTO.getDescription());

        if (requestDTO.getStartDate() != null)
            event.setStartDate(requestDTO.getStartDate());

        if (requestDTO.getEndDate() != null)
            event.setEndDate(requestDTO.getEndDate());

        if (requestDTO.getLocationAddress() != null)
            event.setLocationAddress(requestDTO.getLocationAddress());

        if (requestDTO.getLocationCity() != null)
            event.setLocationCity(requestDTO.getLocationCity());

        if (requestDTO.getLocationDistrict() != null)
            event.setLocationDistrict(requestDTO.getLocationDistrict());

        if (requestDTO.getStatus() != null)
            event.setStatus(requestDTO.getStatus());

        if (requestDTO.getRequiredGoods() != null)
            event.setRequiredGoods(requestDTO.getRequiredGoods());

        if (requestDTO.getBudgetAmount() != null)
            event.setBudgetAmount(requestDTO.getBudgetAmount());

        return mapToDetailsDTO(eventRepo.save(event));
    }



    public EventDetailsDTO updateEventStatusByEventId(Long eventId, EventUpdateStatusDTO requestDTO) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        event.setStatus(requestDTO.getStatus());
        if(requestDTO.getReport()!= null){
            event.setReport(requestDTO.getReport());
        }

        Event updatedEvent = eventRepo.save(event);
        return mapToDetailsDTO(updatedEvent);
    }

    public Boolean deleteEventByEventId(Long eventId) {
        if (!eventRepo.existsById(eventId)) return false;
        eventRepo.deleteById(eventId);
        return true;
    }

    public TeamDetailsDTO formTeamForEventByEventId(Long eventId, FormTeamRequestDTO requestDTO) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found"));

        Volunteer leader = volunteerRepo.findById(requestDTO.getLeaderId())
                .orElseThrow(() -> new EntityNotFoundException("Volunteer not found"));

//            private List<UUID> memberList;


        Team team = new Team();
        team.setEvent(event);
        team.setName(requestDTO.getName());
        team.setDescription(requestDTO.getDescription());
        team.setLeader(leader);
        team.setCreatedAt(ZonedDateTime.now());
        team.setUpdatedAt(ZonedDateTime.now());
        team = teamRepo.save(team);



        List<TeamMember> members = new ArrayList<TeamMember>();
        for(UUID memberId : requestDTO.getMemberList()){
            Volunteer volunteer = volunteerRepo.findById(memberId).orElseThrow(()-> new EntityNotFoundException("Volunteer not found"));
            TeamMember newMember = new TeamMember(team,volunteer);
            members.add(newMember);
        }

        teamMemberRepo.saveAll(members);

        return new TeamDetailsDTO(
                team.getTeamId(),
                team.getName(),
                event.getTitle(),
                event.getStartDate(),
                event.getLocationAddress(),
                event.getLocationCity(),
                event.getLocationDistrict(),
                new VolunteerSummaryDTO(leader.getVolunteerId(), leader.getExternalUserId(), leader.getEmail(), leader.getPhoneNumber()),
                members.stream().map(tm -> {
                    Volunteer v = tm.getVolunteer();
                    return new VolunteerSummaryDTO(v.getVolunteerId(), v.getExternalUserId(), v.getEmail(), v.getPhoneNumber());
                }).collect(Collectors.toList())
        );
    }

    public TeamDetailsDTO seeTeamForEventByEventId(Long eventId) {
        Team team = teamRepo.findByEvent_EventId(eventId)
                .orElseThrow(() -> new RuntimeException("Team not found for Event ID: " + eventId));

        Event event = team.getEvent();

        Volunteer leader = team.getLeader();
        VolunteerSummaryDTO leaderDTO = new VolunteerSummaryDTO(
                leader.getVolunteerId(),
                leader.getExternalUserId(),
                leader.getEmail(),
                leader.getPhoneNumber()
        );

        List<VolunteerSummaryDTO> members = teamMemberRepo.findByTeam_TeamId(team.getTeamId())
                .stream()
                .map(tm -> {
                    Volunteer v = tm.getVolunteer();
                    return new VolunteerSummaryDTO(
                            v.getVolunteerId(),
                            v.getExternalUserId(),
                            v.getEmail(),
                            v.getPhoneNumber()
                    );
                })
                .collect(Collectors.toList());

        return new TeamDetailsDTO(
                team.getTeamId(),
                team.getName(),
                event.getTitle(),
                event.getStartDate(),
                event.getLocationAddress(),
                event.getLocationCity(),
                event.getLocationDistrict(),
                leaderDTO,
                members
        );
    }

    public MemberRatingResponseDTO rateTeamLeaderByEventId(Long eventId, MemberRatingRequestDTO ratingDTO) {
        Team team = teamRepo.findByEvent_EventId(eventId)
                .orElseThrow(() -> new RuntimeException("Team not found for Event ID: " + eventId));

        Volunteer volunteer = team.getLeader();

        VolunteerRating rating = new VolunteerRating();
        rating.setTeam(team);
        rating.setVolunteer(volunteer);
        rating.setRatedBy(team.getLeader());
        rating.setPerformanceRating(ratingDTO.getPerformanceRating());
        rating.setPunctualityRating(ratingDTO.getPunctualityRating());
        rating.setCommunicationRating(ratingDTO.getCommunicationRating());
        rating.setFeedback(ratingDTO.getFeedback());
        rating.setStrengths(ratingDTO.getStrengths());
        rating.setAreasForImprovement(ratingDTO.getAreasForImprovement());
        rating.setHoursWorked(ratingDTO.getHoursWorked());

        VolunteerRating saved = volunteerRatingRepo.save(rating);

        int prevAssignments = volunteer.getAssignmentsCompleted() != null ? volunteer.getAssignmentsCompleted() : 0;
        int prevTotalHours = volunteer.getTotalHours() != null ? volunteer.getTotalHours() : 0;
        BigDecimal prevAvgRating = volunteer.getAverageRating() != null ? volunteer.getAverageRating() : BigDecimal.ZERO;

        int newAssignments = prevAssignments + 1;
        int newTotalHours = prevTotalHours + (ratingDTO.getHoursWorked() != null ? ratingDTO.getHoursWorked() : 0);

        BigDecimal newTotalRating = prevAvgRating.multiply(BigDecimal.valueOf(prevAssignments))
                .add(saved.getOverallRating() != null ? saved.getOverallRating() : BigDecimal.ZERO);

        BigDecimal updatedAvgRating = newTotalRating.divide(BigDecimal.valueOf(newAssignments),2, MathContext.DECIMAL128.getRoundingMode());


        volunteer.setAssignmentsCompleted(newAssignments);
        volunteer.setTotalHours(newTotalHours);
        volunteer.setAverageRating(updatedAvgRating);

        volunteerRepo.save(volunteer);

        return new MemberRatingResponseDTO(saved.getRatingId(), volunteer.getVolunteerId());
    }

    public List<VolunteerSummaryDTO> showAllVolunteersAdmin() {
        List<Volunteer> volunteerList = volunteerRepo.findAll();

        return volunteerList.stream()
                .map(v -> new VolunteerSummaryDTO(v.getVolunteerId(), v.getExternalUserId(), v.getEmail(), v.getPhoneNumber()))
                .collect(Collectors.toList());
    }

    public VolunteerResponseDTO showAllVolunteerByVolunteerIdAdmin(UUID volunteerId) {
        Volunteer v = volunteerRepo.findById(volunteerId)
                .orElseThrow(() -> new EntityNotFoundException("Volunteer not found"));
        return new VolunteerResponseDTO(
                v.getVolunteerId(),
                v.getExternalUserId(),
                v.getNationalId(),
                v.getPhoneNumber(),
                v.getEmail(),
                v.getAddressCity(),
                v.getAddressPostalCode(),
                v.getAddressDistrict(),
                v.getSkills(),
                v.getInterests(),
                v.getAvailability(),
                v.getStatus(),
                v.getTotalHours(),
                v.getAssignmentsCompleted(),
                v.getAverageRating()
        );
    }

    private EventDetailsDTO mapToDetailsDTO(Event e) {
        return new EventDetailsDTO(
                e.getEventId(),
                e.getTitle(),
                e.getDescription(),
                e.getReport(),
                e.getStartDate(),
                e.getEndDate(),
                e.getLocationAddress(),
                e.getLocationCity(),
                e.getLocationDistrict(),
                e.getStatus(),
                e.getRequiredGoods(),
                e.getBudgetAmount()
        );
    }

    private EventSummaryDTO mapToSummaryDTO(Event e) {

        String location = e.getLocationAddress()+","+e.getLocationCity()+","+e.getLocationDistrict();

        return new EventSummaryDTO(e.getEventId(), e.getTitle(), e.getStartDate(), e.getEndDate(),location, e.getStatus(),e.getBudgetAmount());
    }
}
