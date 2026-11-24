package com.vscca.in.controller;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

import javax.servlet.http.HttpServletRequest;

import org.apache.poi.EmptyFileException;
import org.apache.poi.UnsupportedFileFormatException;
import org.apache.poi.ooxml.POIXMLException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskStatus;
import com.vscca.in.model.TaskUserDetails;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskUserDetailsService;
import com.vscca.in.utill.VsccaConstants;

@RestController
public class ExcelController {

	@Autowired
	AccountAuthorization accountAuthorization;

	@Autowired
	TaskInfoService taskInfoService;

	@Autowired
	TaskStatusService taskStatusService;

	@Autowired
	TaskUserDetailsService taskUserDetailsService;

	@Transactional
	@PostMapping("/upload")
	public ResponseDto uploadFile(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
		ResponseDto response = new ResponseDto();
		if (!accountAuthorization.isActiveAccount(request.getHeader(VsccaConstants.TOKEN_HEADER))) {
			response.setSuccess(401);
			response.setMessage("Unauthorized");
			return response;
		}
		if (file.isEmpty()) {
			return invalidWorkbook(response);
		}

		Workbook workbook;
		try {
			workbook = new XSSFWorkbook(file.getInputStream());
		} catch (IOException | EmptyFileException | UnsupportedFileFormatException | POIXMLException ex) {
			return invalidWorkbook(response);
		}

		try (Workbook openedWorkbook = workbook) {
			Sheet sheet = openedWorkbook.getSheet("Sheet1");
			if (sheet == null) {
				return invalidWorkbook(response);
			}
			importTaskRows(sheet);
		} catch (IOException ex) {
			throw new IllegalStateException("Could not close the task workbook", ex);
		}

		response.setSuccess(200);
		response.setMessage("success");
		return response;
	}

	private ResponseDto invalidWorkbook(ResponseDto response) {
		response.setSuccess(400);
		response.setMessage("Upload a readable XLSX task workbook containing Sheet1.");
		return response;
	}

	private void importTaskRows(Sheet sheet) {
		Iterator<Row> rows = sheet.iterator();
		int rowNumber = 0;
		while (rows.hasNext()) {
			Row currentRow = rows.next();
			// skip header
			if (rowNumber == 0) {
				rowNumber++;
				continue;
			}

			Iterator<Cell> cellsInRow = currentRow.iterator();
			if (!cellsInRow.hasNext()) {
				continue;
			}
			TaskInfo taskInfo = new TaskInfo();
			TaskUserDetails taskUserDetail = new TaskUserDetails();
			TaskStatus taskStatus = new TaskStatus();
			SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
			Date date = new Date();
			while (cellsInRow.hasNext()) {
				Cell currentCell = cellsInRow.next();
				switch (currentCell.getColumnIndex()) {
				case 0:
					taskInfo.setProjectName(currentCell.getStringCellValue());
					break;
				case 1:
					taskInfo.setPartyName(currentCell.getStringCellValue());
					break;
				case 2:
					taskInfo.setWeightage((int) currentCell.getNumericCellValue());
					try {
						taskInfo.setCreatedAt(formatter.parse(formatter.format(date)));
					} catch (ParseException e1) {
						// TODO Auto-generated catch block
						e1.printStackTrace();
					}
					break;
				case 3:
					taskInfo.setDueDate(currentCell.getDateCellValue());
					break;
				case 4:
					taskInfo.setBillingClient(currentCell.getStringCellValue());
					break;
				case 5:
					taskInfo.setTaskType(currentCell.getStringCellValue());
					break;
				case 6:
					taskInfo.setTaskDescription(currentCell.getStringCellValue());
					break;

				case 7:
					taskUserDetail.setResponsibility(currentCell.getStringCellValue());
					break;
				case 8:
					taskUserDetail.setConsulting(currentCell.getStringCellValue());
					break;
				case 9:
					taskUserDetail.setExceution(currentCell.getStringCellValue());
					break;
				case 10:
					taskUserDetail.setIntimation(currentCell.getStringCellValue());

					break;
				default:
					break;
				}
			}

			TaskInfo savedTask = taskInfoService.save(taskInfo);
			taskUserDetail.setTaskId(savedTask.getId());
			taskStatus.setTaskId(savedTask.getId());
			try {
				taskStatus.setEndDate(formatter.parse(formatter.format(date)));
			} catch (ParseException e) {
				throw new IllegalStateException("Could not set the imported task date", e);
			}
			taskStatus.setStatus("In Process");
			taskUserDetailsService.save(taskUserDetail);
			taskStatusService.save(taskStatus);
		}
	}
}
