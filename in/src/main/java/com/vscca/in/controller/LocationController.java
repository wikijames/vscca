package com.vscca.in.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.Access;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.WorkLocation;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.WorkLocationService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;

@RestController
public class LocationController {

	@Autowired
	WorkLocationService workLocationService;
	
	@Autowired
	LoginService loginService;
	
	@CrossOrigin
	@GetMapping(value="/location")
	public ResponseDto getAccess(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<WorkLocation> location=workLocationService.findAll();
		response.setSuccess(200);
		response.setMessage("success");
		response.setBody(location);
			}
		return response;
	}
	
	public boolean getTokenAuthentication(String token) {
		if(token != null) {
			
		String emailId= Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody().getSubject();
		LoginTable details= new LoginTable();
		details = loginService.findByuserName(emailId);
		if(null == details.getToken()) {
			return false;
		}
		
		String tokenByEmailId= details.getToken();
		if(tokenByEmailId.equals(token)) {
			return true;
		}else {
			return false;
		}
		}
		return false;
		
	}
}
