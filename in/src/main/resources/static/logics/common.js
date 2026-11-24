function checkSession ( value ) {
    return value;
}

let logoutPending = false;

function Logout () {
    if ( logoutPending ) {
        return;
    }

    logoutPending = true;
    const token = accessToken;
    accessToken = null;
    sessionStorage.clear();
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    const returnToLogin = () => { window.location = '/vscca'; };
    if ( !token ) {
        returnToLogin();
        return;
    }

    $.ajax( {
        type: 'GET',
        url: getLogoutURL,
        dataType: 'json',
        cache: false,
        timeout: 5000,
        headers: { Authorization: token },
        complete: returnToLogin
    } );
}

function topNavUserName () {
    $.ajax( {
        type: "GET",
        url: getUserProfileByIdURL,
        dataType: "json",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        success: function ( data ) {
            var obj = data.body;
            const name = $( '#topNavuserName' );
            if (obj) {
                name.text(obj.accessType + ', ' + obj.firstName + ' ' + obj.lastName);
            } else {
                name.text('');
                alert('Your session seems to have expired or you have logged in from another device. Please log in again.');
                sessionStorage.clear();
                window.location = '/vscca';
            }
        }
    } );
};

function roleBaseAccess () {
    //console.log('roles',userRole);
    if ( userRole == 'Admin' || userRole == 'Manager') {
        $( '.changePasswordTopNav' ).remove();
        $( '.passwordNavforUsers' ).remove();
    } else if ( userRole == 'Supervisor' ) {
        $( '.adminPanelTopNav' ).remove();
        $( '#forAdmin' ).remove();
        $( '.forAdmin' ).remove();
        $( '.passwordNavforAdmin' ).remove();
        $(".createTaskFormStatus option[value='Done']").hide();
    } else if ( userRole == 'TeamMember' ) {
		$(".createTaskFormStatus option[value='Done']").hide();
        $( '.adminPanelTopNav' ).remove();
        $( '#forAdmin' ).remove();
        $( '.notForTM' ).remove();
		$('#deleteTaskBtn').remove();
        $( '.passwordNavforAdmin' ).remove();
    }else if ( userRole == null || userRole == undefined){
        sessionStorage.clear();
        window.location = '/vscca';
    }
};

function taskNavLoadHandler ( view ) {
    const canViewAll = userRole === 'Admin' || userRole === 'Manager';
    if ( view === 'dashboard' && canViewAll ) {
        $( '#taskNameChangeHeading' ).text( 'All Tasks' );
        return populateData( getTaskDetailsURL );
    }

    const routes = {
        dashboard: { heading: 'Your Tasks', url: getTaskDetailsByUserURL },
        yourTask: { heading: 'Your Tasks', url: getTaskDetailsByUserURL },
        today: { heading: "Today's Task", url: getTaskDetailsByUserTodayURL },
        week: { heading: "7 Day's Plan", url: getTaskDetailsByUserWeekURL },
        overdue: { heading: 'Overdue', url: getTaskDetailsByUserByDueDateURL }
    };
    if ( Object.prototype.hasOwnProperty.call( routes, view ) ) {
        const route = routes[view];
        $( '#taskNameChangeHeading' ).text( route.heading );
        return populateData( route.url );
    }
}

function showTaskbyTypeHandler () {
    const view = window.location.pathname.split( '/' ).filter( Boolean ).pop();
    taskNavLoadHandler( view );
}

function checkFileExtension(filename){
    var fileType = filename.split('.').pop();
	//console.log('fileExe', fileType )
	if(fileType === "xlsx" || fileType === "xls" || fileType === "csv" ){
		return fileType; 
	}
}


$(window).on('load', function () {
	setTimeout(function(){
		$('#loading').hide();	
	},1000);
}) 
  
$( document ).ready( function () {
    populateTaskStatusOptions();
    roleBaseAccess();
    topNavUserName();
	showTaskbyTypeHandler();
    $( ".datepicker" ).datepicker( {
        format: "dd-mm-yyyy",
		startDate: new Date()
    } );
} )// ready ends
