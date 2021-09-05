package com.vscca.in.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class PageRedirectController {

	@CrossOrigin
	@RequestMapping(value = "/", method = RequestMethod.GET)
	   public String index() {
		   return "login";
	   }

	@CrossOrigin
	@RequestMapping(value = "/dashboard", method = RequestMethod.GET)
	   public String dashboard() {
		   return "dashboard";
	   }
	@CrossOrigin
	@RequestMapping(value = "/dashboard/today", method = RequestMethod.GET)
	   public String dashboardToday() {
		   return "dashboard";
	   }
	@CrossOrigin
	@RequestMapping(value = "/dashboard/week", method = RequestMethod.GET)
	   public String dashboardWeek() {
		   return "dashboard";
	   }
	@CrossOrigin
	@RequestMapping(value = "/dashboard/overdue", method = RequestMethod.GET)
	   public String dashboardOverdue() {
		   return "dashboard";
	   }
	@CrossOrigin
	@RequestMapping(value = "/dashboard/yourTask", method = RequestMethod.GET)
	   public String dashboardYourTask() {
		   return "dashboard";
	   }

	@CrossOrigin
	@RequestMapping(value = "/profile", method = RequestMethod.GET)
	   public String profile() {
		   return "profile";
	   }
	@CrossOrigin
	@RequestMapping(value = "/myProfile", method = RequestMethod.GET)
	   public String myProfile() {
		   return "myProfile";
	   }

	@CrossOrigin
	@RequestMapping(value = "/viewProfileGrid", method = RequestMethod.GET)
	   public String viewProfileGrid() {
		   return "viewProfile";
	   }

	@CrossOrigin
	@RequestMapping(value = "/createTaskForm", method = RequestMethod.GET)
	   public String createTaskForm() {
		   return "createTask";
	   }

	@CrossOrigin
	@RequestMapping(value = "/viewTaskGrid", method = RequestMethod.GET)
	   public String viewTaskGrid() {
		   return "viewTask";
	   }

	@CrossOrigin
	@RequestMapping(value = "/password", method = RequestMethod.GET)
	   public String ChangePassword() {
		   return "password";
	   }

	@CrossOrigin
	@RequestMapping(value = "/adminPanel", method = RequestMethod.GET)
	   public String NavigateToAdminPanel() {
		   return "adminPanel";
	   }

    @CrossOrigin
	@RequestMapping(value = "/addBillingClient", method = RequestMethod.GET)
	   public String NavigateToAddBillingClient() {
		   return "addBillingClient";
	   }

    @CrossOrigin
    @RequestMapping(value = "/viewBillingClient", method = RequestMethod.GET)
        public String NavigateToViewBillingClient() {
            return "viewBillingClient";
        }
    @CrossOrigin
    @RequestMapping(value = "/reports", method = RequestMethod.GET)
    public String NavigateToViewReports() {
            return "reports";
        }
}
