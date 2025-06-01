package hope.harvest.donation_payment.controller;

import hope.harvest.donation_payment.service.AdminCampaignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/v1")
public class AdminCampaignController {

    @Autowired
    private AdminCampaignService service;

    void createNewCampaign(){
        service.createNewCampaign();
    }



}
