//var envVar = "http://192.168.0.108:8080/vscca/";
var envVar = "http://localhost:8080/vscca/";
var userRole = sessionStorage.getItem('roles');
var accessToken = sessionStorage.getItem('token')
//login
var postLoginURL = envVar + 'login';
//profile add
var getAccessURL = envVar + 'access';
var postProfileURL = envVar + 'userDetails';
//profile view
var getUsersProfileURL = envVar + 'users';
var getUserProfileByIdURL = envVar + 'usersById';
var getLocationURL = envVar + 'location';

//view task
var getResponsibilityURL = envVar + 'taskDetails';
var getExceutionURL = envVar + 'taskDetailsExceution';
var getIntimationURL = envVar + 'taskDetailsIntimation';
var getConsultingURL = envVar + 'taskDetailsConsulting';
//create task
var getBillingClientsURL = envVar + 'billingClients';
var getTasksURL = envVar + 'tasks';
var getResponsiblityUsersURL = envVar + 'responsiblityUsers';
var getExecutionUsersURL = envVar + 'executionUsers';
var getConsultingUsersURL = envVar + 'consultingUsers';
var getIntimationUsersURL = envVar + 'intimationUsers';
var postCreateTaskURL = envVar + 'createTask';

// edit view
var getTaskDetailsByIdURL = envVar + 'taskDetailsById';
var postEditTaskURL = envVar + 'editTask';
var getLogoutURL = envVar + 'logout';

//change password
var postPasswordChangeSelfURL = envVar + 'passwordChangeSelf';
var PostPasswordChangeURL = envVar + 'passwordChange';
var getUsersURL = envVar + 'users';

function checkSession(value) {
	var cookies = Cookies.get("token");
	console.log('cook', cookies);
	if (cookies == null || cookies == undefined || value == 401 || value == 500) {
		sessionStorage.clear();
		window.location = '/vscca';
		alert('Your session has been expired, Please login in again to continue...');
	}
}


function Logout() {
	$.ajax({
		type: "GET",
		url: getLogoutURL,
		dataType: "json",
		"headers": {
			"Content-Type": "application/json",
			"Authorization": accessToken
		},
		success: function() {
			if (data.success === 200) {
				sessionStorage.clear();
				window.location = '/vscca';
			} else {
				sessionStorage.clear();
				window.location = '/vscca';
			}

		},
		error: function(e) {
			sessionStorage.clear();
			window.location = '/vscca';
		}
	});
	sessionStorage.clear();
	window.location = '/vscca';
};

function topNavUserName() {
	$.ajax({
		type: "GET",
		url: getUserProfileByIdURL,
		dataType: "json",
		"headers": {
			"Content-Type": "application/json",
			"Authorization": accessToken
		},
		success: function(data) {
			checkSession(data.success);
			var obj = data.body;
			$('#topNavuserName').append(obj.firstName + ' ' + obj.lastName);
		}
	});

};

function roleBaseAccess() {
	if (userRole.toLowerCase() == 'admin') {
		$('.changePasswordTopNav').remove();
	} else if (userRole.toLowerCase() == 'supervisor') {
		$('.adminPanelTopNav').remove();
        $('#forAdmin').remove();
	} else if (userRole.toLowerCase() == 'teammember') {
		$('.adminPanelTopNav').remove();
        $('#forAdmin').remove();
	}

}

$(document).ready(function() {
    roleBaseAccess();
	topNavUserName();
	setInterval(function() {
		checkSession();
	}, 300000);
})// ready ends
