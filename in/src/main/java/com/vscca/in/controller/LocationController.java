package com.vscca.in.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.Access;
import com.vscca.in.model.WorkLocation;
import com.vscca.in.serivce.WorkLocationService;

public class LocationController {

	@Autowired
	WorkLocationService workLocationService;
	
	@GetMapping(value="/location")
	public ResponseDto getAccess() {
		ResponseDto response = new ResponseDto();
		List<WorkLocation> location=workLocationService.findAll();
		response.setSuccess(200);
		response.setMessage("success");
		response.setBody(location);
		return response;
	}
}
