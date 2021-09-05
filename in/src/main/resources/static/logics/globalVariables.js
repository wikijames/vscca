//var envVar = "http://192.168.0.108:8080/vscca/";
var envVar = "http://localhost:8080/vscca/";
var userRole = sessionStorage.getItem( 'roles' );
//var userRole = userRoleInSession.toLowerCase();
var accessToken = sessionStorage.getItem( 'token' )
//login
var postLoginURL = envVar + 'login';
//profile add
var getAccessURL = envVar + 'access';
var postProfileURL = envVar + 'userDetails';
//profile view
var getUsersProfileURL = envVar + 'users'; // old api
var getUserProfileByIdURL = envVar + 'userDetailsSelf';
var getUserDetailByIdURL = envVar + 'userDetailById';
var postEditUserDetailsURL = envVar + 'editUserDetails';
var getLocationURL = envVar + 'location';

//view task
var getResponsibilityURL = envVar + 'taskDetails';
var getExceutionURL = envVar + 'taskDetailsExceution';
var getIntimationURL = envVar + 'taskDetailsIntimation';
var getConsultingURL = envVar + 'taskDetailsConsulting';
//view all task to admin
var getTaskDetailsURL = envVar + 'taskDetails';
// your ownTask
var getTaskDetailsByUserURL = envVar + 'taskDetailsByUser';
// todays task
var getTaskDetailsByUserTodayURL = envVar + 'taskDetailsByUserToday';
// weekly task
var getTaskDetailsByUserWeekURL = envVar + 'taskDetailsByUserWeek';
//overdue task
var getTaskDetailsByUserByDueDateURL = envVar + 'taskDetailsByUserByDueDate';

// Billing CLient
var getBillingByIdURL = envVar + 'getBillingById';
var postAddBillingClientURL = envVar + 'addBillingClient';
var postEditBillingClientURL = envVar + 'editBillingClient';

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