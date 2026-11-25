package com.vscca.in.utill;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.Base64;
import java.util.Date;

import org.junit.jupiter.api.Test;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

class TokenValidationTest {
    private static final String KEY = Base64.getEncoder().encodeToString(new byte[32]);
    private static final String SUBJECT = "example@example.test";

    @Test
    void acceptsAValidSignedSession() {
        assertEquals(SUBJECT, TokenValidation.validatedSubject(token(SUBJECT, expiration(60000)), KEY));
    }

    @Test
    void rejectsMissingMalformedExpiredAndIncompleteSessions() {
        assertNull(TokenValidation.validatedSubject(null, KEY));
        assertNull(TokenValidation.validatedSubject("malformed-token", KEY));
        assertNull(TokenValidation.validatedSubject(token(SUBJECT, expiration(-60000)), KEY));
        assertNull(TokenValidation.validatedSubject(token(SUBJECT, null), KEY));
        assertNull(TokenValidation.validatedSubject(token(" ", expiration(60000)), KEY));
        assertNull(TokenValidation.validatedSubject(token(SUBJECT, expiration(60000)), null));
    }

    private Date expiration(long offset) {
        return new Date(System.currentTimeMillis() + offset);
    }

    private String token(String subject, Date expiresAt) {
        return Jwts.builder().setSubject(subject).setExpiration(expiresAt)
                .signWith(SignatureAlgorithm.HS256, KEY).compact();
    }
}
