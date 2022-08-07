package com.vscca.in.controller;

import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.TaskInfo;
import com.vscca.in.model.TaskStatus;
import com.vscca.in.model.TaskUserDetails;
import com.vscca.in.serivce.BillingClientService;
import com.vscca.in.serivce.TaskInfoService;
import com.vscca.in.serivce.TaskStatusService;
import com.vscca.in.serivce.TaskTypeService;
import com.vscca.in.serivce.TaskUserDetailsService;
import com.vscca.in.utill.ExcelHelper;

@RestController
public class ExcelController {

	// @Autowired
	// ExcelService fileService;

	@Autowired
	TaskTypeService taskTypeService;

	@Autowired
	BillingClientService billingClientService;

	@Autowired
	TaskInfoService taskInfoService;

	@Autowired
	TaskStatusService taskStatusService;

	@Autowired
	TaskUserDetailsService taskUserDetailsService;

	@PostMapping("/upload")
	public ResponseDto uploadFile(@RequestBody MultipartFile file) {
		String message = "";
		ResponseDto response = new ResponseDto();
		if (ExcelHelper.hasExcelFormat(file)) {
			try {
				response.setMessage(excelToTutorials(file.getInputStream()));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			response.setSuccess(200);
		}
		return response;
	}

	public String excelToTutorials(InputStream is) {
		try {
			String[] HEADERs = {"project name", "party name", "weighted", "created at", "due Date", "billing client",
					"task type", "task description", "billing client", "responsibility", "consulting", "execution",
					"intimation"};
			String SHEET = "Sheet1";
			Workbook workbook = new XSSFWorkbook(is);
			Sheet sheet = workbook.getSheet(SHEET);
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
				TaskInfo taskInfo = new TaskInfo();
				TaskInfo taskId = new TaskInfo();
				TaskUserDetails taskUserDetail = new TaskUserDetails();
				TaskStatus taskStatus = new TaskStatus();
				SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
				Date date = new Date();
				int cellIdx = 0;
				while (cellsInRow.hasNext()) {
					Cell currentCell = cellsInRow.next();
					switch (cellIdx) {
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
						taskInfo.setBillingClient(currentCell.getStringCellValue());
						taskId = taskInfoService.save(taskInfo);
						taskUserDetail.setTaskId(taskId.getId());
						break;
					case 8:
						taskUserDetail.setResponsibility(currentCell.getStringCellValue());
						break;
					case 9:
						taskUserDetail.setConsulting(currentCell.getStringCellValue());
						break;
					case 10:
						taskUserDetail.setExceution(currentCell.getStringCellValue());
						break;
					case 11:
						taskUserDetail.setIntimation(currentCell.getStringCellValue());
						
						break;
//		          case 13:
//		        	  try {
//		        	  taskStatus.setEndDate(formatter.parse(formatter.format(currentCell.getStringCellValue())));
//		        	  }catch (Exception e) {
//						// TODO: handle exception
//					}
//		        	 
//			            break;
					default:
						break;
					}
					cellIdx++;
					taskId = taskInfoService.save(taskInfo);
					taskUserDetail.setTaskId(taskId.getId());
					taskUserDetailsService.save(taskUserDetail);
					taskStatus.setTaskId(taskId.getId());
					taskStatus.setStatus("In Process");
					taskStatusService.save(taskStatus);
				}
			}
			workbook.close();
			return "success";
		} catch (IOException e) {
			throw new RuntimeException("fail to parse Excel file: " + e.getMessage());
		}
	}

}
