
function loadRoleBaseNavigation(){
	if(userRole == 'admin' ){
		//$('.userInfoNav').addClass('hideNav');
	}else if(userRole == 'supervisor' ){
		$('.userInfoNav').addClass('hideNav');
	}else if(userRole == 'teammember'){
		$('.userInfoNav').addClass('hideNav');
		$('.createTaskNav').addClass('hideNav');
		$('.reportNav').addClass('hideNav');
	}
};

$(document).ready(function(){
	loadRoleBaseNavigation();
})// ready ends

