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
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.TokenValidation;
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

	@CrossOrigin
	@PostMapping("/login")
	public ResponseDto postLogin(@RequestBody RequestDto requestDto) {
		ResponseDto response = new ResponseDto();
		if (requestDto != null) {
			LoginTable loginTable = loginService.findByuserName(requestDto.getUserName());
			// System.out.println(loginTable.getUserName());
			if (requestDto.getUserName().equalsIgnoreCase(loginTable.getUserName())
					&& requestDto.getPassword().equals(loginTable.getPassword())) {
				final long EXPIRATIONTIME= 2592000000L;
				String jwtToken = Jwts.builder().setSubject(loginTable.getUserName())
						.setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME)).claim("roles", "user")
						.setIssuedAt(new Date()).signWith(SignatureAlgorithm.HS256, VsccaConstants.secretKey).compact();
				response.setSuccess(200);
				response.setMessage("success");
				response.setToken(jwtToken);
				response.setBody(userDetailsService.findByEmailId(requestDto.userName).getAccessType());
				loginTable.setToken(jwtToken);
				loginService.save(loginTable);
			} else {
				response.setSuccess(401);
				response.setMessage("unautherized user");
			}
		}

		return response;
	}

	@CrossOrigin
	@GetMapping("/logout")
	public ResponseDto postLogin(HttpServletRequest req) {
		ResponseDto response = new ResponseDto();
		String token = req.getHeader(VsccaConstants.TOKEN_HEADER);
		if (token == null && TokenValidation.getAuthentication(token) != true
				|| getTokenAuthentication(token) != true) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
		} else {
			String emailId = TokenValidation.finadEmailIdByToken(token);
			LoginTable loginTable = loginService.findByuserName(emailId);
			response.setSuccess(200);
			response.setMessage("success");
			loginTable.setToken(null);
			loginService.save(loginTable);
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
