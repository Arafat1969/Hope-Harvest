package hope.harvest.user_service.repo;

import hope.harvest.user_service.model.RefreshToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RefreshTokenRepo extends JpaRepository<RefreshToken, UUID> {
//    Optional<RefreshToken> findByTokenValue(String token_value);
//    @Modifying
//    @Transactional
//    @Query("DELETE FROM RefreshToken r WHERE r.user.user_id = :userId")
    //void deleteByUser_UserId(UUID user_id);
}