package com.vscca.in.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.Access;
import com.vscca.in.serivce.AccessService;

@RestController
public class AccessController {
	@Autowired
	AccessService accessService;
	@GetMapping(value="/access")
	public ResponseDto getAccess() {
		ResponseDto response = new ResponseDto();
		List<Access> access=accessService.findAll();
		response.setSuccess(200);
		response.setMessage("success");
		response.setBody(access);
		return response;
	}

}
