package com.vscca.in.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;

@RestController
public class LoginController {
	
	@PostMapping("/Login")
	public ResponseDto postLogin(@RequestBody RequestDto requestDto) {
		ResponseDto response= new ResponseDto();
		
		return response;
	}
	
	

}
