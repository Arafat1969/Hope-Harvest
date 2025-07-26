package hope.harvest.event_volunteer.service;

import hope.harvest.event_volunteer.dto.event.*;
import hope.harvest.event_volunteer.dto.team.TeamDetailsDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingRequestDTO;
import hope.harvest.event_volunteer.dto.volunteer.MemberRatingResponseDTO;
import hope.harvest.event_volunteer.dto.volunteer.VolunteerSummaryDTO;
import hope.harvest.event_volunteer.model.*;
import hope.harvest.event_volunteer.repo.*;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.geom.RoundRectangle2D;
import java.math.BigDecimal;
import java.math.MathContext;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {
    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private TeamRepo teamRepo;

    @Autowired
    private TeamMemberRepo teamMemberRepo;

    @Autowired
    private VolunteerRatingRepo volunteerRatingRepo;

    @Autowired
    private VolunteerRepo volunteerRepo;


    public List<EventDetailsDTO> showAllEventsByCampaignId(UUID campaignId) {
        List<Event> events = eventRepo.findByExternalCampaignId(campaignId);

        return events.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public EventDetailsDTO getEventByEventId(Long eventId) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found for campaign"));

        return mapToDTO(event);
    }

    private EventDetailsDTO mapToDTO(Event event) {
        return new EventDetailsDTO(
                event.getEventId(),
                event.getTitle(),
                event.getDescription(),
                event.getReport(),
                event.getStartDate(),
                event.getEndDate(),
                event.getLocationAddress(),
                event.getLocationCity(),
                event.getLocationDistrict(),
                event.getStatus(),
                event.getRequiredGoods(),
                event.getBudgetAmount()
        );
    }

    public TeamDetailsDTO showEventTeamByEventID(Long eventId) {
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

    public EventReportResponseDTO submitEventReport(Long eventId, EventReportRequestDTO reportDTO) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));

        event.setReport(reportDTO.getReport());
        eventRepo.save(event);

        return new EventReportResponseDTO(event.getEventId(), event.getReport());
    }

    @Transactional
    public EventReportResponseDTO updateEventReport(Long eventId, EventReportRequestDTO reportDTO) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));

        event.setReport(reportDTO.getReport());
        eventRepo.save(event);

        return new EventReportResponseDTO(event.getEventId(), event.getReport());
    }



    @Transactional
    public MemberRatingResponseDTO submitMemberRating(Long eventId, MemberRatingRequestDTO ratingDTO) {
        Team team = teamRepo.findByEvent_EventId(eventId)
                .orElseThrow(() -> new RuntimeException("Team not found for Event ID: " + eventId));

        TeamMember teamMember = teamMemberRepo.findByTeam_TeamIdAndVolunteer_VolunteerId(team.getTeamId(), ratingDTO.getVolunteerId())
                .orElseThrow(() -> new EntityNotFoundException("Volunteer is not part of this event's team"));

        Volunteer volunteer = teamMember.getVolunteer();

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

        BigDecimal newRating = BigDecimal.valueOf((ratingDTO.getCommunicationRating()+ ratingDTO.getPerformanceRating()+ ratingDTO.getPerformanceRating())/3.0);

        BigDecimal newTotalRating1 = prevAvgRating.multiply(BigDecimal.valueOf(prevAssignments))
                .add(newRating);

        BigDecimal updatedAvgRating = newTotalRating1.divide(BigDecimal.valueOf(newAssignments),2,MathContext.DECIMAL128.getRoundingMode());


//        if(saved.getOverallRating()==null){
//            throw new RuntimeException("overall rating: " + newRating);
//        }
        volunteer.setAssignmentsCompleted(newAssignments);
        volunteer.setTotalHours(newTotalHours);
        volunteer.setAverageRating(updatedAvgRating);

        volunteerRepo.save(volunteer);

        return new MemberRatingResponseDTO(saved.getRatingId(), volunteer.getVolunteerId());
    }



    @Transactional
    public ResourceRequestResponseDTO requestAdditionalResources(Long eventId, ResourceRequestDTO requestDTO) {
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with ID: " + eventId));

        event.setRequiredGoods(requestDTO.getRequestedGoods());
        eventRepo.save(event);

        return new ResourceRequestResponseDTO(event.getEventId(), event.getRequiredGoods());
    }

}
