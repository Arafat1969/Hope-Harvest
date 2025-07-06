package hope.harvest.event_volunteer.service;

import hope.harvest.event_volunteer.dto.fund.FundVerificationDetailsDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationReportRequestDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationReportResponseDTO;
import hope.harvest.event_volunteer.dto.fund.FundVerificationSummary;
import hope.harvest.event_volunteer.dto.team.TeamSummaryDTO;
import hope.harvest.event_volunteer.dto.volunteer.*;
import hope.harvest.event_volunteer.model.*;
import hope.harvest.event_volunteer.repo.FundVerificationRepo;
import hope.harvest.event_volunteer.repo.TeamMemberRepo;
import hope.harvest.event_volunteer.repo.VolunteerRatingRepo;
import hope.harvest.event_volunteer.repo.VolunteerRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VolunteerService {

    @Autowired
    VolunteerRepo volunteerRepo;

    @Autowired
    TeamMemberRepo teamMemberRepo;

    @Autowired
    FundVerificationRepo fundVerificationRepo;

    @Autowired
    VolunteerRatingRepo volunteerRatingRepo;

    public VolunteerResponseDTO registerForVolunteer(VolunteerRegistrationRequestDTO requestDTO) {


        if(volunteerRepo.existsByExternalUserId(requestDTO.getExternalUserId())){
            throw new RuntimeException("User already registered as volunteer");
        }

        Volunteer volunteer = new Volunteer();
        volunteer.setExternalUserId(requestDTO.getExternalUserId());
        volunteer.setNationalId(requestDTO.getNationalId());
        volunteer.setPhoneNumber(requestDTO.getPhoneNumber());
        volunteer.setEmail(requestDTO.getEmail());
        volunteer.setAddressCity(requestDTO.getAddressCity());
        volunteer.setAddressPostalCode(requestDTO.getAddressPostalCode());
        volunteer.setAddressDistrict(requestDTO.getAddressDistrict());
        volunteer.setSkills(requestDTO.getSkills());
        volunteer.setInterests(requestDTO.getInterests());
        volunteer.setAvailability(true);
        volunteer.setStatus("ACTIVE");
        volunteer.setTotalHours(0);
        volunteer.setAssignmentsCompleted(0);
        volunteer.setAverageRating(BigDecimal.ZERO);

        Volunteer registeredVolunteer = volunteerRepo.save(volunteer);

        return generateVolunteerResponseDTO(registeredVolunteer);

    }


    public VolunteerResponseDTO generateVolunteerResponseDTO(Volunteer volunteer){
        VolunteerResponseDTO volunteerResponseDTO = new VolunteerResponseDTO();
        volunteerResponseDTO.setVolunteerId(volunteer.getVolunteerId());
        volunteerResponseDTO.setExternalUserId(volunteer.getExternalUserId());
        volunteerResponseDTO.setNationalId(volunteer.getNationalId());
        volunteerResponseDTO.setPhoneNumber(volunteer.getPhoneNumber());
        volunteerResponseDTO.setEmail(volunteer.getEmail());
        volunteerResponseDTO.setAddressCity(volunteer.getAddressCity());
        volunteerResponseDTO.setAddressPostalCode(volunteer.getAddressPostalCode());
        volunteerResponseDTO.setAddressDistrict(volunteer.getAddressDistrict());
        volunteerResponseDTO.setSkills(volunteer.getSkills());
        volunteerResponseDTO.setInterests(volunteer.getInterests());
        volunteerResponseDTO.setAvailability(volunteer.getAvailability());
        volunteerResponseDTO.setStatus(volunteer.getStatus());
        volunteerResponseDTO.setTotalHours(volunteer.getTotalHours());
        volunteerResponseDTO.setAssignmentsCompleted(volunteer.getAssignmentsCompleted());
        volunteerResponseDTO.setAverageRating(volunteer.getAverageRating());

        return volunteerResponseDTO;
    }

    public VolunteerResponseDTO seeMyVolunteerProfile(UUID volunteerId) {
        Volunteer volunteer = volunteerRepo.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        return generateVolunteerResponseDTO(volunteer);
    }


    @Transactional
    public VolunteerResponseDTO updateMyVolunteerProfile(VolunteerUpdateRequestDTO requestDTO) {
        Volunteer volunteer = volunteerRepo.findById(requestDTO.getVolunteerId())
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));


        if(requestDTO.getPhoneNumber()!=null){
            volunteer.setPhoneNumber(requestDTO.getPhoneNumber());
        }

        if(requestDTO.getEmail()!=null){
            volunteer.setEmail(requestDTO.getEmail());
        }

        if(requestDTO.getAddressCity()!=null){
            volunteer.setAddressDistrict(requestDTO.getAddressCity());
        }

        if(requestDTO.getAddressPostalCode()!=null){
            volunteer.setAddressPostalCode(requestDTO.getAddressPostalCode());
        }

        if(requestDTO.getAddressDistrict()!=null){
            volunteer.setAddressDistrict(requestDTO.getAddressDistrict());
        }

        if(requestDTO.getSkills()!=null){
            volunteer.setSkills(requestDTO.getSkills());
        }

        if(requestDTO.getInterests()!=null){
            volunteer.setInterests(requestDTO.getInterests());
        }
        volunteer.setAvailability(requestDTO.getAvailability());


        if(requestDTO.getStatus()!=null){
            volunteer.setStatus(requestDTO.getStatus());
        }

        volunteerRepo.save(volunteer);

        return generateVolunteerResponseDTO(volunteer);
    }

    public List<TeamSummaryDTO> showTeamsForParticularVolunteer(UUID volunteerId) {
        List<TeamMember> memberships = teamMemberRepo.findByVolunteer_VolunteerId(volunteerId);

        return memberships.stream()
                .map(member -> {
                    Team team = member.getTeam();
                    return new TeamSummaryDTO(
                            team.getTeamId(),
                            team.getName(),
                            team.getEvent().getTitle(),
                            team.getEvent().getStartDate(),
                            team.getEvent().getLocationAddress(),
                            team.getEvent().getLocationCity(),
                            team.getEvent().getLocationDistrict(),
                            team.getLeader().getVolunteerId().equals(volunteerId)
                    );
                })
                .collect(Collectors.toList());
    }


    public List<FundVerificationSummary> showAssignedFundVerficationForParticularVolunteer(UUID volunteerId) {
        List<FundVerification> verifications = fundVerificationRepo.findByAssignedVolunteer_VolunteerId(volunteerId);

        return verifications.stream()
                .map(verification -> {
                    var application = verification.getApplication();
                    return new FundVerificationSummary(
                            verification.getVerificationId(),
                            application.getFullName(),
                            application.getPurpose(),
                            application.getAmount(),
                            verification.getVerificationDueDate(),
                            application.getStatus()
                    );
                })
                .collect(Collectors.toList());
    }


    public FundVerificationDetailsDTO showAssignedFundVerficationForParticularVolunteerByVerificationId(UUID verificationId) {
        FundVerification verification = fundVerificationRepo.findById(verificationId)
                .orElseThrow(() -> new EntityNotFoundException("Verification not found with ID: " + verificationId));

        return new FundVerificationDetailsDTO(
                verification.getVerificationId(),
                verification.getApplication().getApplicationId(),
                verification.getApplication().getExternalUserId(),
                verification.getApplication().getFullName(),
                verification.getApplication().getPhoneNumber(),
                verification.getApplication().getNationalId(),
                verification.getApplication().getPurpose(),
                verification.getApplication().getAmount(),
                verification.getApplication().getAddressJson(),
                verification.getApplication().getDocuments(),
                verification.getApplication().getBankInfoJson().getAccountNumber(),
                verification.getApplication().getBankInfoJson().getAccountType(),
                verification.getApplication().getBankInfoJson().getAccountBranch(),
                verification.getVerificationDueDate(),
                verification.getApplication().getStatus()
        );
    }


    public FundVerificationReportResponseDTO submitFundVerificationReportByVerificationId(FundVerificationReportRequestDTO reportDTO) {
        FundVerification fundVerification = fundVerificationRepo.findById(reportDTO.getVerificationId())
                .orElseThrow(()-> new EntityNotFoundException("Verification not found with ID: " + reportDTO.getVerificationId()));

        fundVerification.setRecommendation(reportDTO.getRecommendation());
        fundVerification.setRecommendedAmount(reportDTO.getRecommendedAmount());
        fundVerification.setReport(reportDTO.getReport());

        fundVerificationRepo.save(fundVerification);

        return new FundVerificationReportResponseDTO(
                fundVerification.getVerificationId(),
                fundVerification.getApplication().getApplicationId(),
                fundVerification.getApplication().getExternalUserId(),
                fundVerification.getApplication().getFullName(),
                fundVerification.getApplication().getPhoneNumber(),
                fundVerification.getApplication().getNationalId(),
                fundVerification.getApplication().getPurpose(),
                fundVerification.getApplication().getAmount(),
                fundVerification.getApplication().getAddressJson(),
                fundVerification.getApplication().getDocuments(),
                fundVerification.getApplication().getBankInfoJson().getAccountNumber(),
                fundVerification.getApplication().getBankInfoJson().getAccountType(),
                fundVerification.getApplication().getBankInfoJson().getAccountBranch(),
                fundVerification.getVerificationDueDate(),
                fundVerification.getRecommendation(),
                fundVerification.getRecommendedAmount(),
                fundVerification.getReport(),
                fundVerification.getApplication().getStatus()
        );
    }

    public List<RatingSummaryDTO> showRatingsForParticularVolunteer(UUID volunteerId) {
        List<VolunteerRating> ratings = volunteerRatingRepo.findByVolunteer_VolunteerId(volunteerId);

        return ratings.stream()
                .map(rating -> new RatingSummaryDTO(
                        rating.getRatingId(),
                        rating.getTeam().getName(),
                        rating.getOverallRating(),
                        rating.getFeedback(),
                        rating.getHoursWorked()
                ))
                .collect(Collectors.toList());
    }

    public RatingDetailsDTO showRatingDetailsForParticularVolunteer(Long ratingId) {
        VolunteerRating volunteerRating = volunteerRatingRepo.findById(ratingId)
                .orElseThrow(()-> new EntityNotFoundException("Verification not found with ID: " + ratingId));

        return new RatingDetailsDTO(
            volunteerRating.getRatingId(),
            volunteerRating.getVolunteer().getVolunteerId(),
            volunteerRating.getTeam().getName(),
            volunteerRating.getTeam().getEvent().getTitle(),
            volunteerRating.getRatedBy().getExternalUserId(),
            volunteerRating.getPerformanceRating(),
            volunteerRating.getPunctualityRating(),
            volunteerRating.getCommunicationRating(),
            volunteerRating.getOverallRating(),
            volunteerRating.getFeedback(),
            volunteerRating.getStrengths(),
            volunteerRating.getAreasForImprovement(),
            volunteerRating.getHoursWorked()
        );
    }
}
