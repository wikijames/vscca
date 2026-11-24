package com.vscca.in.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.spy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.UserDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.model.UserDetails;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.VsccaConstants;

@ExtendWith(MockitoExtension.class)
class AccountAuthorizationControllerTest {
    private static final String CALLER = "caller@example.test";
    private static final String TARGET = "target@example.test";
    private static final String SESSION = "synthetic-session";
    private static final String PASSWORD = "synthetic-new-password";

    @Mock
    private LoginService loginService;
    @Mock
    private UserDetailsService userDetailsService;

    private AccountAuthorization authorization;
    private PasswordChangeController passwordController;
    private UserDetailsController profileController;
    private MockHttpServletRequest request;

    @BeforeEach
    void setUp() {
        authorization = spy(new AccountAuthorization(loginService, userDetailsService));
        passwordController = new PasswordChangeController(loginService, authorization);
        profileController = new UserDetailsController();
        profileController.loginService = loginService;
        profileController.userDetailsService = userDetailsService;
        profileController.accountAuthorization = authorization;
        request = new MockHttpServletRequest();
    }

    @Test
    void passwordChangesRequireAValidSession() {
        assertEquals(401, passwordController.passwordChange(request, change()).getSuccess());
        request.addHeader(VsccaConstants.TOKEN_HEADER, "malformed-token");
        assertEquals(401, passwordController.passwordChangeSelf(request, change()).getSuccess());
        verifyNoInteractions(loginService, userDetailsService);
    }

    @ParameterizedTest
    @CsvSource({"TeamMember, 1", "Manager, 1", "Admin, 0"})
    void onlyActiveAdministratorsCanResetAnotherPassword(String role, int active) {
        signIn();
        when(userDetailsService.findByEmailId(CALLER)).thenReturn(profile(role, active));

        assertEquals(403, passwordController.passwordChange(request, change()).getSuccess());
        verifyNoInteractions(loginService);
    }

    @Test
    void activeAdministratorCanResetAnotherPassword() {
        signIn();
        when(userDetailsService.findByEmailId(CALLER)).thenReturn(profile("Admin", 1));
        LoginTable target = new LoginTable();
        when(loginService.findByuserName(TARGET)).thenReturn(target);

        assertEquals(200, passwordController.passwordChange(request, change()).getSuccess());
        assertEquals(PASSWORD, target.getPassword());
        verify(loginService).save(target);
    }

    @Test
    void selfServiceChangesOnlyTheAuthenticatedAccount() {
        LoginTable caller = signIn();
        assertEquals(200, passwordController.passwordChangeSelf(request, change()).getSuccess());
        assertEquals(PASSWORD, caller.getPassword());
        verify(loginService).save(caller);
        verify(loginService, never()).findByuserName(TARGET);
        verifyNoInteractions(userDetailsService);
    }

    @Test
    void creatingAdministratorProfilesRequiresAnActiveAdministrator() {
        signIn();
        when(userDetailsService.findByEmailId(CALLER)).thenReturn(profile("Manager", 1));

        assertEquals(403, profileController.postLogin(request, profileChange("Admin")).getSuccess());
        verifyNoInteractions(loginService);
    }

    @ParameterizedTest
    @CsvSource({"TeamMember, admin", "Admin, TeamMember"})
    void editingAdministratorProfilesOrGrantsRequiresAnActiveAdministrator(String currentRole, String newRole) {
        signIn();
        UserDetails target = profile(currentRole, 1);
        when(userDetailsService.getById(17L)).thenReturn(target);
        when(userDetailsService.findByEmailId(CALLER)).thenReturn(profile("Manager", 1));

        assertEquals(403, profileController.editUserDetails(request, profileChange(newRole)).getSuccess());
        assertEquals(currentRole, target.getAccessType());
        verify(userDetailsService, never()).save(target);
    }

    @Test
    void ordinaryProfileEditsKeepTheirExistingAccessRules() {
        signIn();
        UserDetails target = profile("TeamMember", 1);
        when(userDetailsService.getById(17L)).thenReturn(target);

        assertEquals(200, profileController.editUserDetails(request, profileChange("Supervisor")).getSuccess());
        assertEquals("Supervisor", target.getAccessType());
        verify(userDetailsService).save(target);
    }

    private LoginTable signIn() {
        LoginTable caller = new LoginTable();
        caller.setUserName(CALLER);
        request.addHeader(VsccaConstants.TOKEN_HEADER, SESSION);
        doReturn(caller).when(authorization).authenticatedLogin(SESSION);
        return caller;
    }

    private UserDetails profile(String role, int active) {
        UserDetails profile = new UserDetails();
        profile.setAccessType(role);
        profile.setIsActive(active);
        return profile;
    }

    private RequestDto change() {
        RequestDto change = new RequestDto();
        change.setUserName(TARGET);
        change.setPassword(PASSWORD);
        return change;
    }

    private UserDto profileChange(String role) {
        UserDto change = new UserDto();
        change.setId(17L);
        change.setAccessType(role);
        change.setIsActive(1);
        return change;
    }
}
