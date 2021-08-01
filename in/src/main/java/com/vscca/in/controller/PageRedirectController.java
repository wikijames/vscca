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

	@RequestMapping(value = "/createTask", method = RequestMethod.GET)
	   public String createTask() {
		   return "createTask";
	   }

	@RequestMapping(value = "/viewTask", method = RequestMethod.GET)
	   public String viewTask() {
		   return "viewTask";
	   }
	
}
