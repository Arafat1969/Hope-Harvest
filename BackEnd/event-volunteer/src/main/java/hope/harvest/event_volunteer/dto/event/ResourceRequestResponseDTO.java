package hope.harvest.event_volunteer.dto.event;

import hope.harvest.event_volunteer.model.RequiredGood;
import java.util.List;

public class ResourceRequestResponseDTO {
    private Long eventId;
    private List<RequiredGood> updatedRequiredGoods;

    public ResourceRequestResponseDTO() {}

    public ResourceRequestResponseDTO(Long eventId, List<RequiredGood> updatedRequiredGoods) {
        this.eventId = eventId;
        this.updatedRequiredGoods = updatedRequiredGoods;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public List<RequiredGood> getUpdatedRequiredGoods() {
        return updatedRequiredGoods;
    }

    public void setUpdatedRequiredGoods(List<RequiredGood> updatedRequiredGoods) {
        this.updatedRequiredGoods = updatedRequiredGoods;
    }
}
