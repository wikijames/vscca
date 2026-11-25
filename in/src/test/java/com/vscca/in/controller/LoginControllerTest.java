package com.vscca.in.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.UserDetails;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.VsccaConstants;

@ExtendWith(MockitoExtension.class)
class LoginControllerTest {
    @Mock private LoginService loginService;
    @Mock private UserDetailsService userDetailsService;
    @Mock private AccountAuthorization authorization;
    @InjectMocks private LoginController controller;

    @Test
    void deniesUnknownAccountWithoutLookingUpCredentials() {
        assertEquals(401, controller.postLogin(credentials()).getSuccess());
        verifyNoInteractions(loginService);
    }

    @Test
    void deniesMissingPasswordBeforeLookingUpAccount() {
        RequestDto credentials = credentials();
        credentials.setPassword(null);

        assertEquals(401, controller.postLogin(credentials).getSuccess());
        verifyNoInteractions(userDetailsService, loginService);
    }

    @Test
    void deniesIncorrectPasswordWithoutIssuingASession() {
        RequestDto credentials = credentials();
        UserDetails profile = new UserDetails();
        profile.setIsActive(1);
        LoginTable account = new LoginTable();
        account.setUserName(credentials.getUserName());
        account.setPassword("different-password");
        when(userDetailsService.findByEmailId(credentials.getUserName())).thenReturn(profile);
        when(loginService.findByuserName(credentials.getUserName())).thenReturn(account);

        assertEquals(401, controller.postLogin(credentials).getSuccess());
        assertNull(account.getToken());
    }

    @Test
    void logoutRevokesTheValidatedSession() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(VsccaConstants.TOKEN_HEADER, "synthetic-session");
        LoginTable account = new LoginTable();
        account.setToken("synthetic-session");
        when(authorization.authenticatedLogin("synthetic-session")).thenReturn(account);

        assertEquals(200, controller.postLogin(request).getSuccess());
        assertNull(account.getToken());
        verify(loginService).save(account);
    }

    private RequestDto credentials() {
        RequestDto credentials = new RequestDto();
        credentials.setUserName("person@example.test");
        credentials.setPassword("synthetic-password");
        return credentials;
    }
}
