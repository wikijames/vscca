package com.vscca.in.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.serivce.LoginService;

@RestController
public class LoginController {
	
	@Autowired
	LoginService loginService;
	
	@PostMapping("/login")
	public ResponseDto postLogin(@RequestBody RequestDto requestDto) {
		ResponseDto response= new ResponseDto();
		if(requestDto != null) {
			LoginTable loginTable= loginService.findByuserName(requestDto.getUserName());
		//	System.out.println(loginTable.getUserName());
			if(requestDto.userName.equals(loginTable.getUserName()) && requestDto.Password.equals(loginTable.getPassword())) {
				response.setSuccess(200);
			}
			else {
				response.setSuccess(401);
			}
		}
		
		return response;
	}
	
	

}
