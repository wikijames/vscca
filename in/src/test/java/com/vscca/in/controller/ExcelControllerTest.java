package com.vscca.in.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.poi.EmptyFileException;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.TaskInfo;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskUserDetailsService;

@ExtendWith(MockitoExtension.class)
class ExcelControllerTest {
    @Mock
    private TaskInfoService taskInfoService;
    @Mock
    private TaskStatusService taskStatusService;
    @Mock
    private TaskUserDetailsService taskUserDetailsService;
    @InjectMocks
    private ExcelController controller;

    @Test
    void importsASyntheticWorkbook() throws IOException {
        when(taskInfoService.save(any(TaskInfo.class))).thenAnswer(invocation -> {
            TaskInfo task = invocation.getArgument(0);
            assertEquals("Synthetic project", task.getProjectName());
            return task;
        });

        ResponseDto response = controller.uploadFile(workbookUpload());

        assertEquals(200, response.getSuccess());
        assertEquals("success", response.getMessage());
        verify(taskInfoService).save(any(TaskInfo.class));
        verify(taskStatusService).save(any());
        verify(taskUserDetailsService).save(any());
    }

    @Test
    void rejectsAnEmptyUploadBeforeSavingTasks() {
        assertThrows(EmptyFileException.class, () -> controller.uploadFile(upload(new byte[0])));

        verifyNoInteractions(taskInfoService, taskStatusService, taskUserDetailsService);
    }

    private MockMultipartFile workbookUpload() throws IOException {
        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Sheet1");
            sheet.createRow(0).createCell(0).setCellValue("Project name");
            sheet.createRow(1).createCell(0).setCellValue("Synthetic project");
            workbook.write(bytes);
            return upload(bytes.toByteArray());
        }
    }

    private MockMultipartFile upload(byte[] bytes) {
        return new MockMultipartFile("file", "tasks.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", bytes);
    }
}
