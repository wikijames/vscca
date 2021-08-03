var envVar = "http://localhost:8080/vscca/";
var userRole = sessionStorage.getItem('roles');
var accessToken = sessionStorage.getItem('token')
//login
var postLoginURL = envVar+'login';
//profile add
var postProfileURL = envVar+'userDetails';
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

function logoutOnSessionExpire(){
	alert('Your session has been expired, Please login in again to continue...');
	sessionStorage.clear();
	window.location = '/vscca';
}

$(document).ready(function(){
	$('#adminLogout').click(function(){
		sessionStorage.clear();
		window.location = '/vscca';
	});
	
})// ready ends