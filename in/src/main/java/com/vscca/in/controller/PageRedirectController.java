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
	@RequestMapping(value = "/profile", method = RequestMethod.GET)
	   public String profile() {
		   return "profile";
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

}
