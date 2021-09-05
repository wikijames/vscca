package com.vscca.in.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.BillingClientDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.BillingClient;
import com.vscca.in.model.LoginTable;
import com.vscca.in.serivce.BillingClientService;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.utill.TokenValidation;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;

@RestController
public class BillingClientController {

	@Autowired
	BillingClientService billingClientService;

	@Autowired
	LoginService loginService;

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
	@PostMapping("/addBillingClient")
	public ResponseDto addBillingClient(HttpServletRequest req, @RequestBody BillingClientDto billingClientDto) {

		ResponseDto response = new ResponseDto();
		String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
		if (token == null && TokenValidation.getAuthentication(token) != true
				&& getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		} else {

			BillingClient billingClient = new BillingClient();
			billingClient.setClient(billingClientDto.getPartyName() + "-" + billingClientDto.getLedgerNo() + "-"
					+ billingClientDto.getPageNo());
			billingClientService.save(billingClient);
			response.setSuccess(200);
			response.setMessage("success");
		}
		return response;
	}

	@CrossOrigin
	@GetMapping("/getBillingById")
	public ResponseDto getBillingById(HttpServletRequest req, @RequestParam String id) {
		ResponseDto response = new ResponseDto();
		String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
		if (token == null && TokenValidation.getAuthentication(token) != true
				|| getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		} else {
			BillingClient billingClient = billingClientService.getById(Long.parseLong(id));
			response.setSuccess(200);
			response.setBody(billingClient);
			response.setMessage("success");
		}
		return response;
	}

	@CrossOrigin
	@PostMapping("/editBillingClient")
	public ResponseDto editBillingClient(HttpServletRequest req, @RequestBody BillingClientDto billingClientDto) {
		ResponseDto response = new ResponseDto();
		String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
		if (token == null && TokenValidation.getAuthentication(token) != true
				|| getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		} else {
			BillingClient billingClient = billingClientService.getById(billingClientDto.getId());

			billingClient.setClient(billingClientDto.getPartyName() + "-" + billingClientDto.getLedgerNo() + "-"
					+ billingClientDto.getPageNo());
			billingClient.setIsActive(billingClientDto.getIsActive());
			billingClientService.save(billingClient);
			response.setSuccess(200);
			response.setMessage("success");
		}
		return response;
	}
}
