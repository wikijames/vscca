function checkSession ( value ) {
    //console.log('checkSession value ==>', value);
    return value;
    /*var cookies = Cookies.get( "token" );
    if ( cookies == null || cookies == undefined || value == 401 || value == 500 ) {
        sessionStorage.clear();
		eraseCookie('token');
        window.location = '/vscca';
		Logout ();
        alert( 'Your session has been expired, Please login in again to continue...' );
    }*/
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function Logout () {
    $.ajax( {
        type: "GET",
        url: getLogoutURL,
        dataType: "json",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        success: function () {
            if ( data.success === 200 ) {
                sessionStorage.clear();
				eraseCookie('token');
                window.location = '/vscca';
            } else {
				eraseCookie('token');
                sessionStorage.clear();
                window.location = '/vscca';
            }

        },
        error: function ( e ) {
			eraseCookie('token');
            sessionStorage.clear();
            window.location = '/vscca';
        }
    } );
    sessionStorage.clear();
    window.location = '/vscca';
};

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
            checkSession( data.success );
            var obj = data.body;
            $( '#topNavuserName' ).empty();
            if (obj) {
	        $( '#topNavuserName' ).append(obj.accessType + ', ' + obj.firstName + ' ' + obj.lastName);
		    } else {
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

    setInterval( function () {
        checkSession();
    }, 300000 );
} )// ready ends
