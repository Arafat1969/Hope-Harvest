package hope.harvest.event_volunteer.model;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.List;

@Converter
public class RequiredGoodsConverter implements AttributeConverter<List<RequiredGood>,String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(List<RequiredGood> requiredGoods) {
        try {
            return objectMapper.writeValueAsString(requiredGoods);
        } catch (Exception e) {
            throw new IllegalArgumentException("Error converting required_goods to JSON", e);
        }
    }

    @Override
    public List<RequiredGood> convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, new TypeReference<List<RequiredGood>>() {});
        } catch (Exception e) {
            throw new IllegalArgumentException("Error reading required_goods JSON from DB", e);
        }
    }
}
