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
		console.log('view manish data',data.body)
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
				//console.log('data div', div_data)
                });
            }
      });




})// jquery end

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
		console.log('view manish data',data.body)
               $.each(data.body,function(i,obj)
                {
	 		  var div_data = '<tr>'
					+ '<td>' + obj.projectName + '</td>' 
                    + '<td>' + obj.partyName + '</td>'
					+ '<td>' + obj.responsibility + '</td>'
					+ '<td>' + obj.status + '</td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid'); 
				console.log('data div', div_data)
                });
            }
      });
};

function redirectToTaskDetails(id){
	window.location = 'createTaskForm';
	sessionStorage.setItem('taskId',id);
}

