
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
		getViewTaskById();

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

function disableEnableHandler(){
	 if (( userRole == 'Admin' ) || ( userRole == 'Supervisor' )){
     		$('.taskInformation,.clientInformation,.commentsSection').find('input, textarea, button, select').attr('disabled',false);
			$('.taskInformation,.clientInformation,.commentsSection').find('input, textarea, button, select').attr('readonly',false);
   
    } else if ( userRole == 'TeamMember' ) {
        $('.remarksColumn').addClass('hide');
    }else if ( userRole == null || userRole == undefined){
        sessionStorage.clear();
        window.location = '/vscca';
    }
}
function convertDate(value,name){
	const date = new Date(value).toLocaleDateString().split('/');
	const formattedDate = ('0' + date[1]).slice(-2)+'-'+('0' + date[0]).slice(-2)+'-'+date[2];
	$('#'+name).prop('type','text');
	$('#'+name).val(formattedDate);
}

	function getViewTaskById(){
		var id = sessionStorage.getItem('taskId');
		if(id != null){
	$.ajax({
        type: "GET",
        url:getTaskDetailsByIdURL+'?taskId='+id,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
				checkSession(data.success);
				$.each(data.body,function(i,obj)
                {
//					console.log('data.body', data.body);
					$("#save").attr('title', obj.taskId);
					$('#taskId').val(obj.taskId);
					$('#projectName').val(obj.projectName);
					$('#partyName').val(obj.partyName);
					$('#weightage').val(obj.weightage);
					$('#description').val(obj.taskDescription);
					$('#taskType').val(obj.taskType);
					$('#billingClientName').val(obj.billingClient);
					$('#responsibility').val(obj.responsibility);
					$('#intimation').val(obj.intimation);
					$('#execution').val(obj.exceution);
					$('#consulting').val(obj.consulting);
					$('#status').val(obj.status);
					$('#reasonForDelay').val(obj.delayReason);
					$('#completedDate').val(obj.endDate);
					$('#remarks').val(obj.remarks);
					$('#finalWeightage').val(obj.finalWeightage);
					convertDate(obj.dueDate,'endDate');
					convertDate(obj.endDate,'completedDate');
				});
				setTimeout(function(){
					sessionStorage.removeItem('taskId');
				},3000)
            }
      });
	};
};

function getViewTaskDeleteById(){
		var id = sessionStorage.getItem('taskId');
		if(id != null){
			if (confirm("Are you sure?")) {
        // your deletion code

	$.ajax({
        type: "GET",
        url: deleteTaskDetailsById+'?taskId='+id,
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
