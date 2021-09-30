function checkSession ( value ) {
    var cookies = Cookies.get( "token" );
    if ( cookies == null || cookies == undefined || value == 401 || value == 500 ) {
        sessionStorage.clear();
		eraseCookie('token');
        window.location = '/vscca';
		Logout ();
        alert( 'Your session has been expired, Please login in again to continue...' );
    }
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
            
            $( '#topNavuserName' ).append( obj.firstName + ' ' + obj.lastName );
        }
    } );
};

function roleBaseAccess () {
    //console.log('roles',userRole);
    if ( userRole == 'Admin' ) {
        $( '.changePasswordTopNav' ).remove();
        $( '.passwordNavforUsers' ).remove();
    } else if ( userRole == 'Supervisor' ) {
        $( '.adminPanelTopNav' ).remove();
        $( '#forAdmin' ).remove();
        $( '.forAdmin' ).remove();
        $( '.passwordNavforAdmin' ).remove();
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

function taskNavLoadHandler ( value ) {
	 if ( userRole == 'Admin' && value == 'dashboard') {
	    $( '#taskNameChangeHeading' ).text( 'All Tasks' );
		return populateData( getTaskDetailsURL );
	}else if ( userRole != 'Admin' && value == 'dashboard'){
        $( '#taskNameChangeHeading' ).text( 'Your Tasks' );
		return populateData( getTaskDetailsByUserURL );
	}else if ( value == 'yourTask' ) {
        $( '#taskNameChangeHeading' ).text( 'Your Tasks' );
		return populateData( getTaskDetailsByUserURL );
    } else if ( value == 'today' ) {
        $( '#taskNameChangeHeading' ).text( "Today's Task" );
		return populateData(getTaskDetailsByUserTodayURL);
    } else if ( value == 'week' ) {
        $( '#taskNameChangeHeading' ).text( "7 Day's Plan" );
		return populateData(getTaskDetailsByUserWeekURL);
    } else if ( value == 'overdue' ) {
        $( '#taskNameChangeHeading' ).text( "Overdue" );
		return populateData(getTaskDetailsByUserByDueDateURL);
    }
};

function showTaskbyTypeHandler () {
	var pathname = window.location.pathname; // Returns path only (/path/example.html)
	var value = pathname.split('/').filter(e => e).slice(-1);
	value = value[0];
	taskNavLoadHandler( value );
//    if ( ( window.location.href.indexOf( "myProfile" ) > -1 ) || ( window.location.href.indexOf( "password" ) > -1 ) ||  ( window.location.href.indexOf( "reports" ) > -1 ) ) {
//        window.location = 'dashboard'
//        taskNavLoadHandler( value );
//    } else if ( window.location.href.indexOf( "dashboard" ) > -1 ) {
//        taskNavLoadHandler( value );
//    }
};

$( document ).ready( function () {
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