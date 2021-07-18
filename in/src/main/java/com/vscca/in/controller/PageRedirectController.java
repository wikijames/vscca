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

	
}
