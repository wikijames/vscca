package com.vscca.in.utill;



import java.util.Date;



import io.jsonwebtoken.Jwts;

public class TokenValidation {
	

	
	public TokenValidation() {
		
	}
	
public static boolean getAuthentication(String token) {
	
	String emailId= null;
	
	if(token != null) {
		emailId= Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody().getSubject();
		Date expirationTime = Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody().getExpiration();
		if(emailId != null && expirationTime.after(new Date(System.currentTimeMillis()))) {
			return true;
		}else {
			return false;
		}
	}
	return false;
}

public static String finadEmailIdByToken(String token) {
	String emailId = Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody().getSubject();
	return emailId;
}
}
