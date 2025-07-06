package hope.harvest.event_volunteer.dto.event;

import hope.harvest.event_volunteer.model.RequiredGood;
import java.util.List;

public class ResourceRequestDTO {
    private List<RequiredGood> requestedGoods;

    public ResourceRequestDTO() {}

    public ResourceRequestDTO(List<RequiredGood> requestedGoods) {
        this.requestedGoods = requestedGoods;
    }

    public List<RequiredGood> getRequestedGoods() {
        return requestedGoods;
    }

    public void setRequestedGoods(List<RequiredGood> requestedGoods) {
        this.requestedGoods = requestedGoods;
    }
}
