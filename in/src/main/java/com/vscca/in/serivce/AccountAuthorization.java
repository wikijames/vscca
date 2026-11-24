package com.vscca.in.serivce;

import org.springframework.stereotype.Service;

import com.vscca.in.model.LoginTable;
import com.vscca.in.model.UserDetails;
import com.vscca.in.utill.VsccaConstants;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@Service
public class AccountAuthorization {
    private final LoginService loginService;
    private final UserDetailsService userDetailsService;

    public AccountAuthorization(LoginService loginService, UserDetailsService userDetailsService) {
        this.loginService = loginService;
        this.userDetailsService = userDetailsService;
    }

    public LoginTable authenticatedLogin(String token) {
        if (token == null || token.trim().isEmpty()) {
            return null;
        }

        Claims claims;
        try {
            claims = Jwts.parser().setSigningKey(VsccaConstants.secretKey).parseClaimsJws(token).getBody();
        } catch (JwtException | IllegalArgumentException invalidToken) {
            return null;
        }

        String userName = claims.getSubject();
        if (userName == null || userName.trim().isEmpty() || claims.getExpiration() == null) {
            return null;
        }

        LoginTable login = loginService.findByuserName(userName);
        return login != null && token.equals(login.getToken()) ? login : null;
    }

    public boolean isActiveAccount(String token) {
        LoginTable login = authenticatedLogin(token);
        if (login == null) {
            return false;
        }

        UserDetails profile = userDetailsService.findByEmailId(login.getUserName());
        return profile != null && profile.getIsActive() == 1;
    }

    public boolean isActiveAdministrator(LoginTable caller) {
        UserDetails profile = userDetailsService.findByEmailId(caller.getUserName());
        return profile != null && profile.getIsActive() == 1 && isAdministratorRole(profile.getAccessType());
    }

    public static boolean isAdministratorRole(String accessType) {
        return "Admin".equalsIgnoreCase(accessType);
    }
}
