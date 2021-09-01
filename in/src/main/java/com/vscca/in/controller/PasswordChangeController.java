package com.vscca.in.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.dto.UserDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
public class PasswordChangeController {

	@Autowired
	LoginService loginService;
	
	@CrossOrigin
	@PostMapping("/passwordChange")
	public ResponseDto passwordChange(HttpServletRequest req, @RequestBody RequestDto requestDto) {
		ResponseDto response= new ResponseDto();
		String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
		if (token == null && TokenValidation.getAuthentication(token) != true
				|| getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		} else {
		if (requestDto != null) {
			LoginTable loginTable = loginService.findByuserName(requestDto.getUserName());
			// System.out.println(loginTable.getUserName());
			
				response.setSuccess(200);
				response.setMessage("success");
				
				loginTable.setPassword(requestDto.getPassword());
				loginService.save(loginTable);
			} 
		}
		return response;
		
	}
	
	@CrossOrigin
	@PostMapping("/passwordChangeSelf")
	public ResponseDto passwordChangeSelf(HttpServletRequest req, @RequestBody RequestDto requestDto) {
		ResponseDto response= new ResponseDto();
		String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
		if (token == null && TokenValidation.getAuthentication(token) != true
				|| getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		} else {
		if (requestDto != null) {
			LoginTable loginTable = loginService.findByuserName(TokenValidation.finadEmailIdByToken(token));
			// System.out.println(loginTable.getUserName());
			
				response.setSuccess(200);
				response.setMessage("success");
				
				loginTable.setPassword(requestDto.getPassword());
				loginService.save(loginTable);
			} 
		}
		return response;
		
	}
	public boolean getTokenAuthentication(String token) {
		if (token != null) {

			String emailId = Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody()
					.getSubject();
			LoginTable details = new LoginTable();
			details = loginService.findByuserName(emailId);
			if (null == details.getToken()) {
				return false;
			}

			String tokenByEmailId = details.getToken();
			if (tokenByEmailId.equals(token)) {
				return true;
			} else {
				return false;
			}
		}
		return false;

	}
}
