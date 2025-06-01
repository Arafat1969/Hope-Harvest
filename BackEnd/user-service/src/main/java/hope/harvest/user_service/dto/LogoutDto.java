package hope.harvest.user_service.dto;

public class LogoutDto {
    private String refreshToken;

    public LogoutDto() {}

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}