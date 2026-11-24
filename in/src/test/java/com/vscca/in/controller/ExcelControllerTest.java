package com.vscca.in.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.poi.EmptyFileException;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskStatus;
import com.vscca.in.model.TaskUserDetails;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskUserDetailsService;
import com.vscca.in.utill.VsccaConstants;

@ExtendWith(MockitoExtension.class)
class ExcelControllerTest {
    @Mock
    private TaskInfoService taskInfoService;
    @Mock
    private TaskStatusService taskStatusService;
    @Mock
    private TaskUserDetailsService taskUserDetailsService;
    @Mock
    private AccountAuthorization accountAuthorization;
    @InjectMocks
    private ExcelController controller;

    @Test
    void importsASyntheticWorkbook() throws Exception {
        when(accountAuthorization.isActiveAccount("synthetic-token")).thenReturn(true);
        when(taskInfoService.save(any(TaskInfo.class))).thenAnswer(invocation -> {
            TaskInfo task = invocation.getArgument(0);
            assertEquals("Synthetic project", task.getProjectName());
            assertEquals("Synthetic review", task.getTaskDescription());
            assertNull(task.getPartyName());
            task.setId(17L);
            return task;
        });

        MockMvcBuilders.standaloneSetup(controller).build()
                .perform(multipart("/upload").file(workbookUpload())
                        .header(VsccaConstants.TOKEN_HEADER, "synthetic-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(200))
                .andExpect(jsonPath("$.message").value("success"));
        verify(taskInfoService).save(any(TaskInfo.class));
        ArgumentCaptor<TaskStatus> status = ArgumentCaptor.forClass(TaskStatus.class);
        ArgumentCaptor<TaskUserDetails> assignment = ArgumentCaptor.forClass(TaskUserDetails.class);
        verify(taskStatusService).save(status.capture());
        verify(taskUserDetailsService).save(assignment.capture());
        assertEquals(17L, status.getValue().getTaskId());
        assertEquals("In Process", status.getValue().getStatus());
        assertEquals(17L, assignment.getValue().getTaskId());
        assertEquals("consultant@example.test", assignment.getValue().getConsulting());
    }

    @Test
    void rejectsAnEmptyUploadBeforeSavingTasks() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(VsccaConstants.TOKEN_HEADER, "synthetic-token");
        when(accountAuthorization.isActiveAccount("synthetic-token")).thenReturn(true);

        assertThrows(EmptyFileException.class, () -> controller.uploadFile(request, upload(new byte[0])));

        verifyNoInteractions(taskInfoService, taskStatusService, taskUserDetailsService);
    }

    @Test
    void rejectsUploadsWithoutAnActiveSessionBeforeReadingTheWorkbook() throws Exception {
        MockMvcBuilders.standaloneSetup(controller).build()
                .perform(multipart("/upload").file(upload(new byte[0])))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(401));

        verify(accountAuthorization).isActiveAccount(null);
        verifyNoInteractions(taskInfoService, taskStatusService, taskUserDetailsService);
    }

    private MockMultipartFile workbookUpload() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Sheet1");
            sheet.createRow(0).createCell(0).setCellValue("Project name");
            Row task = sheet.createRow(1);
            task.createCell(0).setCellValue("Synthetic project");
            task.createCell(2).setCellValue(3);
            task.createCell(6).setCellValue("Synthetic review");
            task.createCell(8).setCellValue("consultant@example.test");
            sheet.createRow(2);
            workbook.write(bytes);
            return upload(bytes.toByteArray());
        }
    }

    private MockMultipartFile upload(byte[] bytes) {
        return new MockMultipartFile("file", "tasks.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes);
    }
}
