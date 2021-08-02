package com.vscca.in.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
public class LoginController {
	
	
	@Autowired
	LoginService loginService;
	
	@Autowired
	UserDetailsService userDetailsService;
	
	@PostMapping("/login")
	public ResponseDto postLogin(@RequestBody RequestDto requestDto) {
		ResponseDto response= new ResponseDto();
		if(requestDto != null) {
			LoginTable loginTable= loginService.findByuserName(requestDto.getUserName());
		//	System.out.println(loginTable.getUserName());
			if(requestDto.userName.equals(loginTable.getUserName()) && requestDto.Password.equals(loginTable.getPassword())) {
				final int EXPIRATIONTIME = 1000*60*60*1*1;// 60 mint
			String jwtToken = Jwts.builder().setSubject(loginTable.getUserName()).setExpiration(new Date(System.currentTimeMillis()+EXPIRATIONTIME))
						.claim("roles","user").setIssuedAt(new Date()).signWith(SignatureAlgorithm.HS256,VsccaConstants.secretKey).compact();
				response.setSuccess(200);
				response.setMessage("success");
				response.setToken(jwtToken);
				response.setBody(userDetailsService.findByEmailId(requestDto.userName).getAccessType());
				loginTable.setToken(jwtToken);
				loginService.save(loginTable);
			}
			else {
				response.setSuccess(401);
				response.setMessage("unautherized user");
			}
		}
		
		return response;
	}
	
	

}
