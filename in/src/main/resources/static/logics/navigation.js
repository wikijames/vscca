
function redirectPage(link){
	var getLink = link;
	var dashboardPage = '<div th:replace="dash:: dasboard"></div>'
	var profilePage = '<div th:replace="profile :: profile"></div>';
	var createTaskPage = '<div th:replace="createTask :: createTask"></div>';
	
	console.log('link'+getLink);
	if(link == 'dashboard'){
		return dashboardPage;
	}else if(link == 'profile'){
		return profilePage;
	}else if(link == 'createTask'){
		return createTaskPage;
	}
}

function loadRoleBaseNavigation(){
	if(userRole === 'admin' || userRole === 'Admin'){
		//$('.userInfoNav').addClass('hideNav');
	}else if(userRole === 'CA' ){
		$('.userInfoNav').addClass('hideNav');
	}else if(userRole === 'TeamMember'){
		$('.userInfoNav').addClass('hideNav');
		$('.createTaskNav').addClass('hideNav');
		$('.reportNav').addClass('hideNav');
	}
};

$(document).ready(function(){
	loadRoleBaseNavigation();
})// ready ends

