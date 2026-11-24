
$(document).ready(function(){
	disableFormInputHandler();
	$('#finalWeightage').attr('disabled','disabled');
	$('#finalWeightage').attr('readonly','readonly');
})// ready ends

function disableFormInputHandler(){
	var taskId = sessionStorage.getItem('taskId');
	var taskCompletedDate = $('#completedDate').val();
	if(taskId != null){
		$('.taskInformation,.clientInformation').find('input, textarea, button, select').attr('disabled','disabled');
		$('.taskInformation,.clientInformation').find('input, textarea, button, select').attr('readonly','readonly');

	}else if(taskCompletedDate != ''){

		$('.taskInformation,.clientInformation,.commentsSection').find('input, textarea, button, select').attr('disabled','disabled');
		$('.taskInformation,.clientInformation,.commentsSection').find('input, textarea, button, select').attr('readonly','readonly');
		$('#save').remove();
		$('#deleteTaskBtn').remove();

	}else if(taskId == null &&  taskCompletedDate == ''){
		$('.commentsSection').remove();
		$('#deleteTaskBtn').remove();
		$("#createForm")[0].reset();
						
	}
	if(userRole.toLowerCase() == 'teammember' && ($.trim($('#remarks').val()).length <= 0)){
		$('.remarksColumn').addClass('hide');
		$('#deleteTaskBtn').remove();
	}
	disableEnableHandler();
};

function createTaskElementsEnabled(){
	// Use .prop for boolean attributes so fields are
	// correctly enabled/disabled for each role.
	$('.taskInformation,.clientInformation,.commentsSection')
		.find('input, textarea, button, select')
		.prop('disabled', false)
		.prop('readonly', false);
}

function createTaskElementsDisabled(){
	$('.taskInformation,.clientInformation,.commentsSection')
		.find('input, textarea, button, select')
		.prop('disabled', true)
		.prop('readonly', true);
}

function enableElements(element) {
	$(element)
		.prop('disabled', false)
		.prop('readonly', false);
}

function disableElements(element) {
	$(element)
		.prop('disabled', true)
		.prop('readonly', true);
}

function disableEnableHandler(){
	var taskId = sessionStorage.getItem('taskId');
	 if ( userRole == 'Admin' ){
    	createTaskElementsEnabled(); 	
    }else if(taskId && userRole == 'Manager'){
		createTaskElementsEnabled();
		/*$('#deleteTaskBtn').remove();*/
		$('#projectName, #billingClientName').attr('disabled', true);
		$('#projectName, #billingClientName').attr('readonly', true);
	}else if(userRole == 'Supervisor'){
		 $('#fileinfo').remove();
		 $('#deleteTaskBtn').remove();
		 // Allow Supervisor to edit description, reason for delay
		 // and due date (endDate)
		 enableElements('#description, #reasonForDelay, #endDate');
	 	 $("#status option[value='Done']").hide();
	}else if(taskId && userRole == 'Supervisor'){
		createTaskElementsDisabled();
		$('#deleteTaskBtn').remove();
		// When opening an existing task, Supervisor can still
		// adjust description, reason for delay and due date.
		enableElements('#description, #reasonForDelay, #endDate');
	}else if (userRole == 'TeamMember') {
		$('#deleteTaskBtn').remove();
		enableElements('#description');
		/*disableElements('#reasonForDelay');*/
        //$('.remarksColumn').addClass('hide');
    }else if ( userRole == null || userRole == undefined){
        sessionStorage.clear();
        window.location = '/vscca';
    }
}
function convertDate(value,name){
	// Use shared date utility to keep formatting
	// consistent with list views.
	const formattedDate = formatDateToUi( value );
	$('#'+name).prop('type','text');
	$('#'+name).val(formattedDate);
}

function getViewTaskById() {
    const id = sessionStorage.getItem('taskId');
    if (id === null) {
        return;
    }

    function showLoadFailure() {
        alert('Unable to load the task. Reopen it and try again.');
    }

    $.ajax({
        type: 'GET',
        url: getTaskDetailsByIdURL,
        data: { taskId: id },
        dataType: 'json',
        headers: { Authorization: accessToken },
        success: function (response) {
            const task = response && Array.isArray(response.body)
                ? response.body.find(record => record && String(record.taskId) === id)
                : undefined;
            if (Number(response && response.success) !== 200 || !task) {
                showLoadFailure();
                return;
            }

            $('#taskId').val(task.taskId);
            $('#projectName').val(task.projectName);
            $('#partyName').val(task.partyName);
            $('#weightage').val(task.weightage);
            $('#description').val(task.taskDescription);
            $('#taskType').val(task.taskType);
            $('#billingClientName').val(task.billingClient);
            $('#responsibility').val(task.responsibility);
            $('#intimation').val(task.intimation);
            $('#execution').val(task.exceution);
            $('#consulting').val(task.consulting);
            $('#status').val(task.status);
            $('#reasonForDelay').val(task.delayReason);
            $('#remarks').val(task.remarks);
            $('#finalWeightage').val(task.finalWeightage);
            convertDate(task.dueDate, 'endDate');
            convertDate(task.endDate, 'completedDate');
            $('#save').attr('title', task.taskId);

            if (sessionStorage.getItem('taskId') === id) {
                sessionStorage.removeItem('taskId');
            }
        },
        error: showLoadFailure
    });
}

function getViewTaskDeleteById(){
		var id = $("#save").attr('title');
		if(id != null){
			if (confirm("Are you sure?")) {
        // your deletion code

	$.ajax({
        type: "GET",
        url: getDeleteTaskDetailsByIdURL+'?taskId='+id,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
				alert('Task has been deleted succesfully');
				window.location = 'dashboard';
            }
      });

    }
    return false;

	};
};
function fileUploadValidation(){
	//var empty = document.getElementById("taskFile").value = null;
	//var inputFile = document.getElementById("taskFile").value;
	//var fileType = accept=".xlsx, .xls, .csv"
	//if(!inputFile ){
		//alert('its null');
	//}
	
}

