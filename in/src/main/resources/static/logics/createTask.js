$(document).ready(function(){
	var sessionTaskId = sessionStorage.getItem('taskId');
	var responsibilityStatus = false;
	var executionStatus = false;
	var consulting = false;
	var intimationStatus = false;
	
	if(sessionTaskId != null){
		$('#fileinfo').hide();
		if(responsibilityStatus && executionStatus && consulting && intimationStatus ){
		 getViewTaskById();
		}	
	}
	
$('.billingClientNameClass').select2({});
  $.ajax({
    type: "GET",
    url:getBillingClientsURL,
    dataType: "json",
	 "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
    success: function (data) {
	    $.each(data.body,function(i,obj)
        {
			appendTaskOption('.billingClientNameClass', obj.client, obj.client);
        });
        }
  });

	// populate tasks Type Dropdown
  $.ajax({
    type: "GET",
    url:getTasksURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
        $.each(data.body,function(i,obj)
        {
         appendTaskOption('#taskType', obj.task, obj.task);
        });
        }
  });

	// populate responsiblityUsers Dropdown
	  $.ajax({
        type: "GET",
        url:getResponsiblityUsersURL,
        dataType: "json",
        "headers": {
	    	"Content-Type": "application/json",
			"Authorization": accessToken
	  	},
		success: function (data) {
			responsibilityStatus = true;
            $.each(data.body,function(i,obj)
            {
             appendTaskOption('#responsibility', obj.emailId, obj.firstName + ' ' + obj.lastName);
            });
            }
      });

// populate executionUsers Dropdown
  $.ajax({
    type: "GET",
    url:getExecutionUsersURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
		executionStatus = true;
        $.each(data.body,function(i,obj)
        {
         appendTaskOption('#execution', obj.emailId, obj.firstName + ' ' + obj.lastName);
        });
        }
  });

// populate consultingUsers Dropdown
  $.ajax({
    type: "GET",
    url:getConsultingUsersURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
		consulting = true;
		$.each(data.body,function(i,obj)
        {
         appendTaskOption('#consulting', obj.emailId, obj.firstName + ' ' + obj.lastName);
        });
        }
  });

// populate intimationuser Dropdown
  $.ajax({
    type: "GET",
    url:getIntimationUsersURL,
    dataType: "json",
    "headers": {
    	"Content-Type": "application/json",
		"Authorization": accessToken
  	},
	success: function (data) {
        intimationStatus = true;
        $.each(data.body,function(i,obj)
        {
         appendTaskOption('#intimation', obj.emailId, obj.firstName + ' ' + obj.lastName);
        });
        }
  });



    let dueDate;
    $('#endDate').change(function () {
        dueDate = $(this).val();
    });

    $('#save').click(function (event) {
        event.preventDefault();
        saveTask($('#save').attr('title') !== '', dueDate);
    });
});

function appendTaskOption(selector, value, label) {
    $(selector).each(function () {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        this.appendChild(option);
    });
}

function saveTask(isEditing, dueDate) {
    const payload = {
        projectName: $('#projectName').val(),
        partyName: $('#partyName').val(),
        weightage: $('#weightage').val(),
        taskDescription: $('#description').val(),
        taskType: $('#taskType').val(),
        billingClient: $('#billingClientName').val(),
        dueDate,
        responsibility: $('#responsibility').val(),
        intimation: $('#intimation').val(),
        exceution: $('#execution').val(),
        consulting: $('#consulting').val()
    };
    if (isEditing) {
        payload.status = $('#status').val();
        payload.remarks = $('#remarks').val();
        payload.delayReason = $('#reasonForDelay').val();
        payload.taskId = $('#taskId').val();
    }

    function showSaveFailure(status) {
        if (status === 401) {
            sessionStorage.clear();
            alert('Your session is no longer authorized. Sign in again before saving.');
        } else if (status === 403) {
            alert('You do not have permission to save this task.');
        } else {
            alert('Unable to save the task.');
        }
    }

    $.ajax({
        url: isEditing ? postEditTaskURL : postCreateTaskURL,
        method: 'POST',
        contentType: 'application/json',
        headers: { Authorization: accessToken },
        data: JSON.stringify(payload)
    }).done(function (response) {
        const status = Number(response && response.success);
        if (status !== 200) {
            showSaveFailure(status);
            return;
        }

        $('#createForm')[0].reset();
        alert(isEditing ? 'Task updated successfully.' : 'Task created successfully.');
        window.location = 'dashboard';
    }).fail(function (request) {
        showSaveFailure(request.status);
    });
}

function ValidateUploadFile() {
    const fileInput = document.getElementById('file');
    if (!fileInput.value) {
        alert('Select a task workbook to upload.');
        return false;
    }
    if (!/\.xlsx$/i.test(fileInput.value)) {
        alert('Select an XLSX task workbook.');
        return false;
    }
    return uploadBulkTask();
}

function uploadBulkTask() {
    const uploadButton = document.getElementById('uploadTasks');
    if (uploadButton.disabled || !confirm('Are you sure?')) {
        return false;
    }

    const form = document.getElementById('fileinfo');
    function showUploadFailure(status) {
        if (status === 401) {
            sessionStorage.clear();
            alert('Your session is no longer authorized. Sign in again before uploading.');
        } else if (status === 400) {
            alert('Upload a readable XLSX task workbook containing Sheet1.');
        } else {
            alert('Unable to import tasks. Check the workbook and try again.');
        }
    }

    const data = new FormData(form);
    uploadButton.disabled = true;
    $.ajax({
        url: postUploadBulkTaskURL,
        type: 'POST',
        data,
        headers: { Authorization: accessToken },
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            const status = Number(response && response.success);
            if (status !== 200 || response.message !== 'success') {
                showUploadFailure(status);
                return;
            }

            form.reset();
            alert('Tasks uploaded successfully.');
            window.location = 'dashboard';
        },
        error: function (request) {
            showUploadFailure(request.status);
        },
        complete: function () {
            uploadButton.disabled = false;
        }
    });

    return false;
}
