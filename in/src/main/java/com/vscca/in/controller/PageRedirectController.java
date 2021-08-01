package com.vscca.in.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class PageRedirectController {
	
	@RequestMapping(value = "/", method = RequestMethod.GET)
	   public String index() {
		   return "login";
	   }
	
	@RequestMapping(value = "/dashboard", method = RequestMethod.GET)
	   public String dashboard() {
		   return "dashboard";
	   }
	@RequestMapping(value = "/profile", method = RequestMethod.GET)
	   public String profile() {
		   return "profile";
	   }

	@RequestMapping(value = "/createTaskForm", method = RequestMethod.GET)
	   public String createTaskForm() {
		   return "createTask";
	   }

	@RequestMapping(value = "/viewTaskGrid", method = RequestMethod.GET)
	   public String viewTaskGrid() {
		   return "viewTask";
	   }
	
}
