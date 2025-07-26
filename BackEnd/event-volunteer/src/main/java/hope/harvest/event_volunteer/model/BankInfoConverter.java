package hope.harvest.event_volunteer.model;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class BankInfoConverter implements AttributeConverter<BankInfo, String> {

    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(BankInfo bankInfo) {
        try {
            return bankInfo != null ? mapper.writeValueAsString(bankInfo) : null;
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not serialize bankInfo", e);
        }
    }

    @Override
    public BankInfo convertToEntityAttribute(String dbData) {
        try {
            return dbData != null ? mapper.readValue(dbData, BankInfo.class) : null;
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Could not deserialize bankInfo", e);
        }
    }
}
