//package hope.harvest.event_volunteer;
//
//import hope.harvest.event_volunteer.dto.fund.*;
//import hope.harvest.event_volunteer.dto.volunteer.AssignVolunteerRequestDTO;
//import hope.harvest.event_volunteer.model.*;
//import hope.harvest.event_volunteer.repo.*;
//import hope.harvest.event_volunteer.service.FundService;
//import jakarta.persistence.EntityNotFoundException;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.math.BigDecimal;
//import java.time.ZonedDateTime;
//import java.util.*;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class FundServiceTest {
//
//    @Mock FundApplicationRepo fundApplicationRepo;
//    @Mock FundVerificationRepo fundVerificationRepo;
//    @Mock VolunteerRepo volunteerRepo;
//
//    @InjectMocks FundService fundService;
//
//    private UUID applicationId;
//    private UUID userId;
//    private UUID volunteerId;
//
//    @BeforeEach
//    void init() {
//        applicationId = UUID.randomUUID();
//        userId = UUID.randomUUID();
//        volunteerId = UUID.randomUUID();
//    }
//
//    @Test
//    void testApplyForFundsByUser() {
//        FundApplicationRequestDTO dto = new FundApplicationRequestDTO();
//        dto.setExternalUserId(userId);
//        dto.setFullName("John Doe");
//        dto.setPhoneNumber("01700000000");
//        dto.setNationalId("1234567890");
//        dto.setPurpose("Medical");
//        dto.setAmount(BigDecimal.valueOf(1000));
//        dto.setAddressJson("{\"city\":\"Dhaka\"}");
//        dto.setDocuments(List.of("{doc1}", "{doc2}"));
//        dto.setBankAccountNumber("123");
//        dto.setBankAccountType("SAVINGS");
//        dto.setBankAccountBranch("Dhaka Main");
//
//        FundApplication saved = new FundApplication();
//        saved.setApplicationId(applicationId);
//        saved.setPurpose(dto.getPurpose());
//        saved.setAmount(dto.getAmount());
//        saved.setAddressJson(dto.getAddressJson());
//        saved.setSubmissionDate(ZonedDateTime.now());
//        saved.setStatus("PENDING");
//
//        when(fundApplicationRepo.save(any())).thenReturn(saved);
//
//        FundApplicationDetails result = fundService.applyForFundsByUser(dto);
//        assertEquals(applicationId, result.getApplicationId());
//    }
//
//    @Test
//    void testSeeAllFundApplicationsByUser() {
//        FundApplication app = new FundApplication();
//        app.setApplicationId(applicationId);
//        app.setExternalUserId(userId);
//        app.setPurpose("Education");
//        app.setAmount(BigDecimal.valueOf(500));
//        app.setAddressJson("{city:'Dhaka'}");
//        app.setStatus("PENDING");
//        when(fundApplicationRepo.findByExternalUserId(userId)).thenReturn(List.of(app));
//
//        List<FundApplicationDetails> result = fundService.seeAllFundApplicationsByUser(userId);
//        assertEquals(1, result.size());
//        assertEquals(applicationId, result.get(0).getApplicationId());
//    }
//
//    @Test
//    void testSeeFundApplicationOfAUserByApplicationId_found() {
//        FundApplication app = new FundApplication();
//        app.setApplicationId(applicationId);
//        app.setPurpose("Health");
//        when(fundApplicationRepo.findById(applicationId)).thenReturn(Optional.of(app));
//
//        FundApplicationDetails dto = fundService.seeFundApplicationOfAUserByApplicationId(applicationId);
//        assertEquals("Health", dto.getPurpose());
//    }
//
//    @Test
//    void testSeeFundApplicationOfAUserByApplicationId_notFound() {
//        when(fundApplicationRepo.findById(applicationId)).thenReturn(Optional.empty());
//        assertThrows(EntityNotFoundException.class, () -> fundService.seeFundApplicationOfAUserByApplicationId(applicationId));
//    }
//
//    @Test
//    void testSeeAllFundApplicationsAdmin() {
//        FundApplication app = new FundApplication();
//        app.setApplicationId(applicationId);
//        app.setBankInfoJson(new BankInfo("123", "SAVINGS", "Uttara"));
//        when(fundApplicationRepo.findAll()).thenReturn(List.of(app));
//        when(fundVerificationRepo.findByApplication_ApplicationId(applicationId)).thenReturn(Optional.empty());
//
//        List<FundDetailsAdminDTO> result = fundService.seeAllFundApplicationsAdmin();
//        assertEquals(1, result.size());
//    }
//
//    @Test
//    void testSeeFundApplicationAdminByApplicationId_found() {
//        FundApplication app = new FundApplication();
//        app.setApplicationId(applicationId);
//        app.setBankInfoJson(new BankInfo("456", "SAVINGS", "Motijheel"));
//        when(fundApplicationRepo.findById(applicationId)).thenReturn(Optional.of(app));
//        when(fundVerificationRepo.findByApplication_ApplicationId(applicationId)).thenReturn(Optional.empty());
//
//        FundDetailsAdminDTO dto = fundService.seeFundApplicationAdminByApplicationId(applicationId);
//        assertEquals(applicationId, dto.getApplicationId());
//    }
//
//    @Test
//    void testCompleteFundVerification_success() {
//        FundApplication app = new FundApplication();
//        app.setApplicationId(applicationId);
//        app.setBankInfoJson(new BankInfo("456", "SAVINGS", "Motijheel"));
//        FundVerificationStatusUpdateRequestDTO req = new FundVerificationStatusUpdateRequestDTO();
//        req.setStatus("APPROVED");
//        req.setFeedback("Looks good");
//        req.setDisbursedAmount(BigDecimal.valueOf(1500));
//        req.setDisbursementDate(ZonedDateTime.now());
//
//        when(fundApplicationRepo.findById(applicationId)).thenReturn(Optional.of(app));
//        when(fundApplicationRepo.save(any())).thenReturn(app);
//        when(fundVerificationRepo.findByApplication_ApplicationId(applicationId)).thenReturn(Optional.empty());
//
//        FundDetailsAdminDTO dto = fundService.completeFundVerification(applicationId, req);
//        assertEquals("APPROVED", dto.getStatus());
//    }
//
//    @Test
//    void testAssignVolunteerToFundVerification_success() {
//        FundApplication app = new FundApplication();
//        app.setApplicationId(applicationId);
//        Volunteer volunteer = new Volunteer();
//        volunteer.setVolunteerId(volunteerId);
//
//        AssignVolunteerRequestDTO dto = new AssignVolunteerRequestDTO();
//        dto.setVolunteerId(volunteerId);
//
//        when(fundApplicationRepo.findById(applicationId)).thenReturn(Optional.of(app));
//        when(volunteerRepo.findById(volunteerId)).thenReturn(Optional.of(volunteer));
//
//        fundService.assignVolunteerToFundVerification(applicationId, dto);
//
//        verify(fundVerificationRepo, times(1)).save(any());
//    }
//}
