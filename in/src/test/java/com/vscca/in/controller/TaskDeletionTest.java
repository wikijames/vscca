package com.vscca.in.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.vscca.in.model.LoginTable;
import com.vscca.in.model.UserDetails;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskUserDetailsService;
import com.vscca.in.serivce.UserDetailsService;
import com.vscca.in.utill.VsccaConstants;

@ExtendWith(MockitoExtension.class)
class TaskDeletionTest {
    private static final String PATH = "/deleteTaskDetailsById";
    private static final String TOKEN = "synthetic-session";

    @Mock private AccountAuthorization authorization;
    @Mock private UserDetailsService profiles;
    @Mock private TaskInfoService tasks;
    @Mock private TaskStatusService statuses;
    @Mock private TaskUserDetailsService assignments;
    @InjectMocks private TaskController controller;

    private MockMvc mvc;

    @BeforeEach
    void setUp() {
        mvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void rejectsGetAndRequiresAuthenticationForDelete() throws Exception {
        mvc.perform(get(PATH).param("taskId", "17"))
                .andExpect(status().isMethodNotAllowed());
        mvc.perform(delete(PATH).param("taskId", "17"))
                .andExpect(jsonPath("$.success").value(401));
        verifyNoInteractions(tasks, statuses, assignments, profiles);
    }

    @ParameterizedTest
    @CsvSource({"Supervisor, 1", "TeamMember, 1", "Admin, 0", "Manager, 0"})
    void deniesDeletionWithoutAnActivePrivilegedRole(String role, int active) throws Exception {
        signIn(role, active);
        mvc.perform(delete(PATH).param("taskId", "17").header(VsccaConstants.TOKEN_HEADER, TOKEN))
                .andExpect(jsonPath("$.success").value(403));
        verifyNoInteractions(tasks, statuses, assignments);
    }

    @ParameterizedTest
    @ValueSource(strings = {"Admin", "Manager"})
    void deletesTheTaskAndItsRelatedRecordsForPermittedRoles(String role) throws Exception {
        signIn(role, 1);
        mvc.perform(delete(PATH).param("taskId", "17").header(VsccaConstants.TOKEN_HEADER, TOKEN))
                .andExpect(jsonPath("$.success").value(200));
        verify(statuses).deleteByTaskId(17L);
        verify(assignments).deleteByTaskId(17L);
        verify(tasks).deleteById(17L);
    }

    private void signIn(String role, int active) {
        LoginTable caller = new LoginTable();
        caller.setUserName("caller@example.test");
        UserDetails profile = new UserDetails();
        profile.setAccessType(role);
        profile.setIsActive(active);
        when(authorization.authenticatedLogin(TOKEN)).thenReturn(caller);
        when(profiles.findByEmailId(caller.getUserName())).thenReturn(profile);
    }
}
