package com.vscca.in.controller;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.UserDetails;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
public class LoginController {

	@Autowired
	LoginService loginService;

	@Autowired
	UserDetailsService userDetailsService;

	@Autowired
	AccountAuthorization accountAuthorization;

	@CrossOrigin
	@PostMapping("/login")
	public ResponseDto postLogin(@RequestBody RequestDto credentials) {
		if (credentials == null || credentials.getUserName() == null || credentials.getUserName().trim().isEmpty()
				|| credentials.getPassword() == null || credentials.getPassword().isEmpty()) {
			return unauthorized();
		}

		String userName = credentials.getUserName();
		UserDetails profile = userDetailsService.findByEmailId(userName);
		if (profile == null || profile.getIsActive() != 1) {
			return unauthorized();
		}

		LoginTable account = loginService.findByuserName(userName);
		if (account == null || !userName.equalsIgnoreCase(account.getUserName())
				|| !credentials.getPassword().equals(account.getPassword())) {
			return unauthorized();
		}

		final long expirationMillis = 2592000000L;
		Date issuedAt = new Date();
		String token = Jwts.builder().setSubject(account.getUserName())
				.setExpiration(new Date(issuedAt.getTime() + expirationMillis)).claim("roles", "user")
				.setIssuedAt(issuedAt).signWith(SignatureAlgorithm.HS256, VsccaConstants.secretKey).compact();
		account.setToken(token);
		loginService.save(account);

		ResponseDto response = new ResponseDto();
		response.setSuccess(200);
		response.setMessage("success");
		response.setToken(token);
		response.setBody(profile.getAccessType());
		return response;
	}

	@CrossOrigin
	@GetMapping("/logout")
	public ResponseDto postLogin(HttpServletRequest request) {
		LoginTable account = accountAuthorization.authenticatedLogin(request.getHeader(VsccaConstants.TOKEN_HEADER));
		if (account == null) {
			return unauthorized();
		}

		account.setToken(null);
		loginService.save(account);
		ResponseDto response = new ResponseDto();
		response.setSuccess(200);
		response.setMessage("success");
		return response;
	}

	private ResponseDto unauthorized() {
		ResponseDto response = new ResponseDto();
		response.setSuccess(401);
		response.setMessage("Unauthorized");
		return response;
	}
}
