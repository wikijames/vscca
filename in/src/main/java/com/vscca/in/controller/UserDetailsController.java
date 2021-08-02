package com.vscca.in.controller;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.dto.UserDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.UserDetails;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
public class UserDetailsController {
	@Autowired
	UserDetailsService userDetailsService;
	
	@Autowired
	LoginService loginService;
	
	@PostMapping("/userDetails")
	public ResponseDto postLogin(HttpServletRequest req,@RequestBody UserDto userDto) {
		ResponseDto response= new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		if(userDto != null) {
			UserDetails userDetails= new UserDetails();
			LoginTable loginTable = new LoginTable();
			userDetails.setFirstName(userDto.getFirstName());
			userDetails.setEmailId(userDto.getEmailId());
			userDetails.setLastName(userDto.getLastName());
			userDetails.setMobileNumber(userDto.getMobileNumber());
			userDetails.setAddress(userDto.getAddress());
			userDetails.setCity(userDto.getCity());
			userDetails.setCountry(userDto.getCountry());
			userDetails.setPostalCode(userDto.getPostalCode());
			userDetails.setResponsibility(userDto.getResponsibility());
			userDetails.setExecution(userDto.getExecution());
			userDetails.setConsulting(userDto.getConsulting());
			userDetails.setIntimation(userDto.getIntimation());
			userDetails.setAboutMe(userDto.getAboutMe());
			userDetails.setAccessType(userDto.getAccessType());
			userDetails.setLocation(userDto.getLocation());
			userDetails.setIsActive(1);
			loginTable.setUserName(userDto.getEmailId());
			loginTable.setPassword("123");
			loginService.save(loginTable);
			userDetailsService.save(userDetails);
				response.setSuccess(200);
				response.setMessage("success");
				
			}
			else {
				response.setSuccess(500);
				response.setMessage("Fill again");
			}
			}
		
		return response;
	}

	@GetMapping("/consultingUsers")
	public ResponseDto userDetailsByconsulting(HttpServletRequest req) {
		ResponseDto response= new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<UserDetails> userDetails=userDetailsService.userDetailsByConsulting();
		response.setSuccess(200);
		response.setBody(userDetails);
		response.setMessage("success");
			}
		return response;
	}
	
	@GetMapping("/responsiblityUsers")
	public ResponseDto userDetailsByResponsibility(HttpServletRequest req) {
		ResponseDto response= new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<UserDetails> userDetails=userDetailsService.userDetailsByResponsibility();
		response.setSuccess(200);
		response.setBody(userDetails);
		response.setMessage("success");
			}
		return response;
	}
	
	
	@GetMapping("/executionUsers")
	public ResponseDto userDetailsByExceution(HttpServletRequest req) {
		ResponseDto response= new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<UserDetails> userDetails=userDetailsService.userDetailsByExecution();
		response.setSuccess(200);
		response.setBody(userDetails);
		response.setMessage("success");
			}
		return response;
	}
	
	
	@GetMapping("/intimationUsers")
	public ResponseDto userDetailsByIntemation(HttpServletRequest req) {
		ResponseDto response= new ResponseDto();
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
				if(token == null && TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
				response.setSuccess(401);
				response.setMessage("Unauthorized");
			}else {
		List<UserDetails> userDetails=userDetailsService.userDetailsByIntimation();
		response.setSuccess(200);
		response.setBody(userDetails);
		response.setMessage("success");
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
