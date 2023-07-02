package com.vscca.in.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.DscDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.dto.UserDto;
import com.vscca.in.model.Dsc;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.TaskType;
import com.vscca.in.model.UserDetails;
import com.vscca.in.serivce.DscService;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;

@RestController
public class DscController {
	
@Autowired	
DscService dscService;	
@Autowired
LoginService loginService;

@CrossOrigin
@PostMapping("/Dsc")
public ResponseDto postDsc(HttpServletRequest req,@RequestBody DscDto dscDto) {
	ResponseDto response= new ResponseDto();
	String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
	if(token == null || TokenValidation.getAuthentication(token) != true || getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		}else {
	if(dscDto != null) {
		Dsc dsc= new Dsc();
		
		dsc.setPersonName(dscDto.getPersonName());
		dsc.setActive("yes");
		dsc.setCreatedAt(dscDto.getCreatedAt());
		dsc.setPurpose(dscDto.getPurpose());
		dsc.setValidity(dscDto.getValidity());
		dsc.setValidTill(dscDto.getValidTill());
		dsc.setCategory(dscDto.getCategory());
		dsc.setMobileNo(dscDto.getMobileNo());
		dsc.setFeesCollected(dscDto.getFeesCollected());
		dsc.setDscWithUs(dscDto.getDscWithUs());
		dsc.setDscWithPerson(dscDto.getDscWithPerson());
		dsc.setRemark(dscDto.getRemark());
		dscService.save(dsc);
		}
		else {
			response.setSuccess(500);
			response.setMessage("Fill again");
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


@CrossOrigin
@GetMapping("/dsc")
public ResponseDto getTaskType(HttpServletRequest req) {
	ResponseDto response = new ResponseDto();
	String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
	if (token == null || TokenValidation.getAuthentication(token) != true
			|| getTokenAuthentication(token) != true) {
		response.setSuccess(401);
		response.setMessage("Unauthorized");
	} else {
		List<Dsc> dscs = dscService.findAll();
		response.setSuccess(200);
		response.setBody(dscs);
		response.setMessage("success");
	}
	return response;
}

}
