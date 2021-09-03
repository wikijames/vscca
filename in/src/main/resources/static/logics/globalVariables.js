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

// Billing client
var postBillingClientURL = envVar + '';

function checkSession(value) {
	var cookies = Cookies.get("token");
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
        $('.notForTM').remove();
	}

}
function taskNavLoadHandler(value){
    $('#taskNameChangeHeading').text('');
    if(value == 'all'){
        alert('all');
        $('#taskNameChangeHeading').text('All Task');
    }else if (value == 'today'){
        alert('today');
        $('#taskNameChangeHeading').text("Today's Task");
    }else if (value == 'week'){
        alert('week');
        $('#taskNameChangeHeading').text("7 Day's Plan");
    }else if (value == 'overdue'){
        alert('overdue');
        $('#taskNameChangeHeading').text("Overdue");
    }
}

function showTaskbyTypeHandler(value){
    if ((window.location.href.indexOf("myProfile") > -1) || (window.location.href.indexOf("password") > -1) || ((window.location.href.indexOf("reports") > -1))) {
        window.location = 'dashboard'
        taskNavLoadHandler(value);
    }else if(window.location.href.indexOf("dashboard") > -1){
        taskNavLoadHandler(value);
    }
}

$(document).ready(function() {
    roleBaseAccess();
	topNavUserName();

    $(".datepicker").datepicker({
        format: "dd-mm-yyyy",
      });

	setInterval(function() {
		checkSession();
	}, 300000);
})// ready ends
