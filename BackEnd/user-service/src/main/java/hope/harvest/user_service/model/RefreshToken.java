package hope.harvest.user_service.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "UUID DEFAULT gen_random_uuid()", updatable = false, nullable = false)
    private UUID token_id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String token_value;

    @Column(nullable = false)
    private ZonedDateTime expires_at;

    @Column(nullable = false)
    private boolean is_revoked = false;

    public RefreshToken() {}

    public UUID getToken_id() {
        return token_id;
    }

    public void setToken_id(UUID token_id) {
        this.token_id = token_id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken_value() {
        return token_value;
    }

    public void setToken_value(String token_value) {
        this.token_value = token_value;
    }

    public ZonedDateTime getExpires_at() {
        return expires_at;
    }

    public void setExpires_at(ZonedDateTime expires_at) {
        this.expires_at = expires_at;
    }

    public boolean isIs_revoked() {
        return is_revoked;
    }

    public void setIs_revoked(boolean is_revoked) {
        this.is_revoked = is_revoked;
    }
}