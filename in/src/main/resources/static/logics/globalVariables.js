var envVar = "http://192.168.0.108:8080/vscca/";
var userRole = sessionStorage.getItem('roles');
var accessToken = sessionStorage.getItem('token')
//login
var postLoginURL = envVar+'login';
//profile add
var getAccessURL = envVar+'access';
var postProfileURL = envVar+'userDetails';
//profile view
var getUsersProfileURL = envVar+'users';
var getUserProfileByIdURL = envVar+'usersById';
var getLocationURL = envVar+'location';

//view task
var getResponsibilityURL = envVar+'taskDetails';
var getExceutionURL = envVar+'taskDetailsExceution';
var getIntimationURL = envVar+'taskDetailsIntimation';
var getConsultingURL = envVar+'taskDetailsConsulting';
//create task
var getBillingClientsURL = envVar+'billingClients';
var getTasksURL = envVar+'tasks';
var getResponsiblityUsersURL = envVar+'responsiblityUsers';
var getExecutionUsersURL = envVar+'executionUsers';
var getConsultingUsersURL = envVar+'consultingUsers';
var getIntimationUsersURL = envVar+'intimationUsers';
var postCreateTaskURL = envVar+'createTask';

// edit view
var getTaskDetailsByIdURL = envVar+'taskDetailsById';
var postEditTaskURL = envVar+'editTask';

var getLogoutURL = envVar+'logout';

function logoutOnSessionExpire(){
	alert('Your session has been expired, Please login in again to continue...');
	sessionStorage.clear();
	window.location = '/vscca';
}

function checkSession(value){
	if(value === 401 || value === 500){
	alert('Your session has been expired, Please login in again to continue...');
	sessionStorage.clear();
	window.location = '/vscca';	
	}	
}

$(document).ready(function(){
	$('#adminLogout').click(function(){
		$.ajax({
        type: "GET",
        url:getLogoutURL,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken	
		  	},
			success: function () {
				if(data.success === 200){
					sessionStorage.clear();
					window.location = '/vscca';	
				}else{
					sessionStorage.clear();
					window.location = '/vscca';
				}
				
            },
			error: function(e){
				sessionStorage.clear();
				window.location = '/vscca';
			}
      });
		sessionStorage.clear();
		window.location = '/vscca';
		
	});
topNavUserName();	
})// ready ends


function redirectToProfilePage(){
	window.location = 'profile';
}


function topNavUserName(){
	$.ajax({
        type: "GET",
        url:getUserProfileByIdURL,
        dataType: "json",
        "headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken	
		  	},
			success: function (data) {
				checkSession(data.success);
					var obj = data.body;
					$('#topNavuserName').append(obj.firstName+' '+obj.lastName);
            }
      });
	
};

