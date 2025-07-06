package hope.harvest.event_volunteer.service;

import hope.harvest.event_volunteer.dto.fund.*;
import hope.harvest.event_volunteer.dto.volunteer.AssignVolunteerRequestDTO;
import hope.harvest.event_volunteer.model.BankInfo;
import hope.harvest.event_volunteer.model.FundApplication;
import hope.harvest.event_volunteer.model.FundVerification;
import hope.harvest.event_volunteer.model.Volunteer;
import hope.harvest.event_volunteer.repo.FundApplicationRepo;
import hope.harvest.event_volunteer.repo.FundVerificationRepo;
import hope.harvest.event_volunteer.repo.VolunteerRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class FundService {
    @Autowired
    FundApplicationRepo fundApplicationRepo;

    @Autowired
    FundVerificationRepo fundVerificationRepo;

    @Autowired
    private VolunteerRepo volunteerRepo;

    public FundApplicationDetails applyForFundsByUser(FundApplicationRequestDTO requestDTO) {
        FundApplication fundApp = new FundApplication();
        fundApp.setExternalUserId(requestDTO.getExternalUserId());
        fundApp.setFullName(requestDTO.getFullName());
        fundApp.setPhoneNumber(requestDTO.getPhoneNumber());
        fundApp.setNationalId(requestDTO.getNationalId());
        fundApp.setPurpose(requestDTO.getPurpose());
        fundApp.setAmount(requestDTO.getAmount());
        fundApp.setAddressJson(requestDTO.getAddressJson());
        fundApp.setDocuments(requestDTO.getDocuments());
        fundApp.setSubmissionDate(ZonedDateTime.now());
        fundApp.setStatus("PENDING");

        BankInfo bankInfo = new BankInfo(requestDTO.getBankAccountNumber(), requestDTO.getBankAccountType(), requestDTO.getBankAccountBranch());
        fundApp.setBankInfoJson(bankInfo);

        FundApplication saved = fundApplicationRepo.save(fundApp);

        return mapToUserDetails(saved);
    }

    public List<FundApplicationDetails> seeAllFundApplicationsByUser(UUID externalUserId) {
        return fundApplicationRepo.findByExternalUserId(externalUserId)
                .stream()
                .map(this::mapToUserDetails)
                .toList();
    }

    public FundApplicationDetails seeFundApplicationOfAUserByApplicationId(UUID applicationId) {
        FundApplication fund = fundApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
        return mapToUserDetails(fund);
    }

    public List<FundDetailsAdminDTO> seeAllFundApplicationsAdmin() {
        return fundApplicationRepo.findAll()
                .stream()
                .map(this::mapToAdminDetails)
                .toList();
    }

    public FundDetailsAdminDTO seeFundApplicationAdminByApplicationId(UUID applicationId) {
        FundApplication fund = fundApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
        return mapToAdminDetails(fund);
    }

    @Transactional
    public FundDetailsAdminDTO completeFundVerification(UUID applicationId, FundVerificationStatusUpdateRequestDTO requestDTO) {
        FundApplication fund = fundApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));

        fund.setStatus(requestDTO.getStatus());
        fund.setFeedback(requestDTO.getFeedback());
        fund.setDisbursedAmount(requestDTO.getDisbursedAmount());
        fund.setDisbursementDate(requestDTO.getDisbursementDate());

        FundApplication updated = fundApplicationRepo.save(fund);

        return mapToAdminDetails(updated);
    }

    @Transactional
    public void assignVolunteerToFundVerification(UUID applicationId, AssignVolunteerRequestDTO requestDTO) {
        FundApplication fund = fundApplicationRepo.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Fund application not found"));

        Volunteer volunteer = volunteerRepo.findById(requestDTO.getVolunteerId())
                .orElseThrow(() -> new EntityNotFoundException("Volunteer not found"));

//        this.application = application;
//        this.assignedVolunteer = assignedVolunteer;
//        this.assignedDate = assignedDate;
//        this.verificationDueDate = verificationDueDate;
//        this.recommendation = recommendation;
//        this.recommendedAmount = recommendedAmount;
//        this.report = report;

        FundVerification verification = new FundVerification();

        verification.setApplication(fund);
        verification.setAssignedVolunteer(volunteer);
        verification.setAssignedDate(ZonedDateTime.now());
        verification.setVerificationDueDate(ZonedDateTime.now().plusDays(15));

        fundVerificationRepo.save(verification);
    }


    private FundApplicationDetails mapToUserDetails(FundApplication f) {
        return new FundApplicationDetails(
                f.getApplicationId(),
                f.getPurpose(),
                f.getAmount(),
                f.getAddressJson(),
                f.getSubmissionDate(),
                f.getStatus(),
                f.getFeedback(),
                f.getDisbursedAmount(),
                f.getDisbursementDate()
        );
    }

    private FundDetailsAdminDTO mapToAdminDetails(FundApplication f) {
        FundVerification fv = fundVerificationRepo.findByApplication_ApplicationId(f.getApplicationId()).orElse(null);
        UUID assignedVolunteerId = (fv != null && fv.getAssignedVolunteer() != null)
                ? fv.getAssignedVolunteer().getVolunteerId()
                : null;

        return new FundDetailsAdminDTO(
                f.getApplicationId(),
                f.getExternalUserId(),
                f.getFullName(),
                f.getPhoneNumber(),
                f.getNationalId(),
                f.getPurpose(),
                f.getAmount(),
                f.getAddressJson(),
                f.getDocuments(),
                f.getBankInfoJson().getAccountNumber(),
                f.getBankInfoJson().getAccountType(),
                f.getBankInfoJson().getAccountBranch(),
                f.getSubmissionDate(),
                f.getStatus(),
                f.getFeedback(),
                f.getDisbursedAmount(),
                f.getDisbursementDate(),
                assignedVolunteerId,
                (fv != null ? fv.getRecommendation() : null),
                (fv != null ? fv.getRecommendedAmount() : null),
                (fv != null ? fv.getReport() : null)
        );
    }

}
