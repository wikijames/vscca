package com.vscca.in.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	
	@GetMapping("/")
	public String getIndex() {
		return "hello";
	}
	
	

}
