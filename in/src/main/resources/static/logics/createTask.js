$(document).ready(function(){
    const sessionTaskId = sessionStorage.getItem('taskId');
    if (sessionTaskId != null) {
        $('#fileinfo').hide();
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
        const taskId = $('#save').attr('title');
        if (sessionTaskId != null && !taskId) {
            alert('Task details are unavailable. Reopen the task before saving.');
            return;
        }
        saveTask(Boolean(taskId), dueDate);
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
