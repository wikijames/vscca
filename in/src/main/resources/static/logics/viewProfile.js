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
					+ '<td>' + obj.responsibility + '</td>'
					+ '<td>' + obj.status + '</td>'
					+ '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View</a></td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid'); 
				//console.log('data div', div_data)
                });
            }
      });


populateData();

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

function isActiveUser(value){
	if(value === 1){
		return 'Active';
	}else{
		return 'Deactive'
	}
}
function populateData(){
	//$('#table_id').dataTable().destroy();
	$('#table_id tbody').empty();
	$.ajax({
        type: "GET",
        url:getUsersProfileURL,
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
					+ '<td>' + obj.firstName + ' ' + obj.lastName +'</td>' 
                    + '<td>' + obj.accessType + '</td>'
					+ '<td>' + isActiveUser(obj.isActive) + '</td>'
					+ '<td> <a onClick="redirectToProfileDetails(' + obj.id+ ')" class="btn pointer">View</a></td>'
					+ '</tr>';
			    $(div_data).appendTo('#populateGrid');
                });
            }
      });
};

function redirectToProfileDetails(id){
	window.location = 'profile';
	sessionStorage.setItem('profileId',id);
}

