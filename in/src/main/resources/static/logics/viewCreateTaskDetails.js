
$(document).ready(function(){
	getViewTaskById();
	disableFormInputHandler();
})// ready ends

function disableFormInputHandler(){
	var taskId = sessionStorage.getItem('taskId');
	var taskCompletedDate = $('#completedDate').val();
	if(taskId !== null){
	
		$('.taskInformation,.clientInformation').find('input, textarea, button, select').attr('disabled','disabled');
		$('.taskInformation,.clientInformation').find('input, textarea, button, select').attr('readonly','readonly');
	
	}else if(taskCompletedDate !== ''){
		
		$('.taskInformation,.clientInformation,.commentsSection').find('input, textarea, button, select').attr('disabled','disabled');
		$('.taskInformation,.clientInformation,.commentsSection').find('input, textarea, button, select').attr('readonly','readonly');
		$('#save').remove();
	
	}else if(taskId === null &&  taskCompletedDate === ''){
		
		$('.commentsSection').remove();
		
	}
	
	if(userRole === 'TeamMember' && ($.trim($('#remarks').val()).length <= 0)){
	
		$('.remarksColumn').addClass('hide');
	
	}
};

	function getViewTaskById(){
		var id = sessionStorage.getItem('taskId');
		if(id !== null){
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
				console.log('data task', data);
				$.each(data.body,function(i,obj){
					$("#save").attr('title', obj.taskId);
					$('#taskId').val(obj.taskId);
					$('#projectName').val(obj.projectName);
					$('#partyName').val(obj.partyName);
					$('#weightage').val(obj.weightage);
					$('#description').val(obj.taskDescription);
					$('#taskType').val(obj.taskType);
					$('#billingClientName').val(obj.billingClient);
					$('#endDate').val(obj.dueDate);
					$('#responsibility').val(obj.responsibility);
					$('#intimation').val(obj.intimation);
					$('#execution').val(obj.exceution);
					$('#consulting').val(obj.consulting);
					$('#status').val(obj.status);
					$('#reasonForDelay').val(obj.delayReason);
					$('#completedDate').val(obj.endDate);
					$('#remarks').val(obj.remarks);
					
					});
					
				setTimeout(function(){
					sessionStorage.removeItem('taskId');
				},3000)
            }
      });
	};
};
