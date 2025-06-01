package hope.harvest.user_service.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity(name = "users")
public class User {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "UUID DEFAULT gen_random_uuid()", updatable = false, nullable = false)
    private UUID user_id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password_hash;

    private boolean email_verified = false;

    @Column(nullable = false)
    private String first_name;

    @Column(nullable = false)
    private String last_name;

    private String phone_number;
    private String address_city;
    private String address_postal_code;
    private String address_country;

    @Column(nullable = false)
    private String role = "USER";

    public User() {}

    public User(String email, String password_hash, boolean email_verified, String first_name, String last_name) {
        this.email = email;
        this.password_hash = password_hash;
        this.email_verified = email_verified;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = "USER";
    }

    public UUID getUser_id() {
        return user_id;
    }

    public void setUser_id(UUID user_id) {
        this.user_id = user_id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword_hash() {
        return password_hash;
    }

    public void setPassword_hash(String password_hash) {
        this.password_hash = password_hash;
    }

    public boolean isEmail_verified() {
        return email_verified;
    }

    public void setEmail_verified(boolean email_verified) {
        this.email_verified = email_verified;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getAddress_city() {
        return address_city;
    }

    public void setAddress_city(String address_city) {
        this.address_city = address_city;
    }

    public String getAddress_postal_code() {
        return address_postal_code;
    }

    public void setAddress_postal_code(String address_postal_code) {
        this.address_postal_code = address_postal_code;
    }

    public String getAddress_country() {
        return address_country;
    }

    public void setAddress_country(String address_country) {
        this.address_country = address_country;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
