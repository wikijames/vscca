$(document).ready(function(){

	  $.ajax({
        type: "GET",
        url:getResponsibilityURL,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
				checkSession(data.success);
		       $.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
                    + '<td>' + obj.weightage + '</td>'
					+ '<td>' + obj.responsibility + '</td>'
                    + '<td>' + obj.dueDate + '</td>'
                    + '<td>' + isTaskDescription(obj.taskDescription) + '</td>'
					+ '<td>' + obj.status + '</td>'
					+ '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View</a></td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid');
				console.log('data div', data.body)
                });
            }
      });

})// jquery end

function formatDate(date) {
    new Date(Date.now()).toLocaleString().split(',')[0]
}
function isTaskDescription(value){
	if(value != null || value != '' || value != undefined){
		return 'Yes';
	}else{
		return 'No'
	}
};
	function viewTaskTypeHandler(){
		var value = $('#viewType').val();
		$('#taskNameChangeHeading').text('Your task');
		if(value == 'responsibility'){
			$('#taskNameChangeHeading').text('Your task');
			return populateData(getResponsibilityURL);
		}
		else if(value == 'exceution'){
			$('#taskNameChangeHeading').text("Today's Task");
			return populateData(getExceutionURL);
		}
		else if(value == 'intimation'){
			$('#taskNameChangeHeading').text("7 Days's Plan");
			return populateData(getIntimationURL);
		}
		else if(value == 'consulting'){
			$('#taskNameChangeHeading').text("Overdue Task");
			return populateData(getConsultingURL);
		}
	}

	function viewType(){
		var value = $('#viewType').val();
		if(value == 'responsibility'){
			return populateData(getResponsibilityURL);
		}
		else if(value == 'exceution'){
			return populateData(getExceutionURL);
		}
		else if(value == 'intimation'){
			return populateData(getIntimationURL);
		}
		else if(value == 'consulting'){
			return populateData(getConsultingURL);
		}
	}

function populateData(url){
	//$('#table_id').dataTable().destroy();
	$('#table_id tbody').empty();
	$.ajax({
        type: "GET",
        url:url,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
			success: function (data) {
				checkSession(data.success);
               $.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
					+ '<td>' + obj.responsibility + '</td>'
					+ '<td>' + obj.status + '</td>'
					+ '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View</a></td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid');
                });
            }
      });
};

function redirectToTaskDetails(id){
	window.location = 'createTaskForm';
	sessionStorage.setItem('taskId',id);
}

