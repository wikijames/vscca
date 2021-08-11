
function loadRoleBaseNavigation(){
	if(userRole.toLowerCase() === 'admin' ){
		//$('.userInfoNav').addClass('hideNav');
	}else if(userRole.toLowerCase() === 'supervisor' ){
		$('.userInfoNav').addClass('hideNav');
	}else if(userRole.toLowerCase() === 'team member'){
		$('.userInfoNav').addClass('hideNav');
		$('.createTaskNav').addClass('hideNav');
		$('.reportNav').addClass('hideNav');
	}
};

$(document).ready(function(){
	loadRoleBaseNavigation();
})// ready ends

