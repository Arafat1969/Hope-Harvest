package hope.harvest.event_volunteer.repo;
import hope.harvest.event_volunteer.model.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamMemberRepo extends JpaRepository<TeamMember,Long> {

}
