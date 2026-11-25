package com.vscca.in.utill;

import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

public final class TokenValidation {
    private TokenValidation() {
    }

    public static boolean getAuthentication(String token) {
        return finadEmailIdByToken(token) != null;
    }

    public static String finadEmailIdByToken(String token) {
        return validatedSubject(token, VsccaConstants.secretKey);
    }

    static String validatedSubject(String token, String signingKey) {
        if (token == null || token.trim().isEmpty() || signingKey == null || signingKey.trim().isEmpty()) {
            return null;
        }

        try {
            Claims claims = Jwts.parser().setSigningKey(signingKey).parseClaimsJws(token).getBody();
            String subject = claims.getSubject();
            Date expiration = claims.getExpiration();
            if (subject == null || subject.trim().isEmpty() || expiration == null || !expiration.after(new Date())) {
                return null;
            }
            return subject;
        } catch (JwtException | IllegalArgumentException invalidToken) {
            return null;
        }
    }
}
