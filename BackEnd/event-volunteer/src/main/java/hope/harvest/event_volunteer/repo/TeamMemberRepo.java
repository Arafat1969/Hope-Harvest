package hope.harvest.event_volunteer.repo;
import hope.harvest.event_volunteer.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TeamMemberRepo extends JpaRepository<TeamMember,Long> {
    List<TeamMember> findByVolunteer_VolunteerId(UUID volunteerId);
    List<TeamMember> findByTeam_TeamId(Long teamId);
    Optional<TeamMember> findByTeam_TeamIdAndVolunteer_VolunteerId(Long teamId,UUID volunteerId);
}
