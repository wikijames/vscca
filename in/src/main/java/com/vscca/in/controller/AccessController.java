package com.vscca.in.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequestWrapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.Access;
import com.vscca.in.serivce.AccessService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

@RestController
public class AccessController {
	@Autowired
	AccessService accessService;
	@GetMapping(value="/access")
	public ResponseDto getAccess(HttpServletRequestWrapper req) {
		String token= req.getHeader(VsccaConstants.TOKEN_HEADER);
		ResponseDto response = new ResponseDto();
		if(token != null) {
		if(!TokenValidation.getAuthentication(token)) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		}else {
		List<Access> access=accessService.findAll();
		response.setSuccess(200);
		response.setMessage("success");
		response.setBody(access);
		}
		}else {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		}
		return response;
	}

}
