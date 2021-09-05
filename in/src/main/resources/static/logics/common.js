function checkSession ( value ) {
    var cookies = Cookies.get( "token" );
    if ( cookies == null || cookies == undefined || value == 401 || value == 500 ) {
        sessionStorage.clear();
        window.location = '/vscca';
        alert( 'Your session has been expired, Please login in again to continue...' );
    }
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
                window.location = '/vscca';
            } else {
                sessionStorage.clear();
                window.location = '/vscca';
            }

        },
        error: function ( e ) {
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
            //console.log('user Name on top', obj);
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
        $( '.adminPanelTopNav' ).remove();
        $( '#forAdmin' ).remove();
        $( '.notForTM' ).remove();
        $( '.passwordNavforAdmin' ).remove();
    }else if ( userRole == null || userRole == undefined){
        sessionStorage.clear();
        window.location = '/vscca';
    }
};

//function taskNavLoadHandler ( value ) {
//    $( '#taskNameChangeHeading' ).text( '' );
//    if ( value == 'all' ) {
//        alert( 'all' );
//        $( '#taskNameChangeHeading' ).text( 'Your Tasks' );
//    } else if ( value == 'today' ) {
//        alert( 'today' );
//        $( '#taskNameChangeHeading' ).text( "Today's Task" );
//    } else if ( value == 'week' ) {
//        alert( 'week' );
//        $( '#taskNameChangeHeading' ).text( "7 Day's Plan" );
//    } else if ( value == 'overdue' ) {
//        alert( 'overdue' );
//        $( '#taskNameChangeHeading' ).text( "Overdue" );
//    }
//};
//
//function showTaskbyTypeHandler ( value ) {
//    if ( ( window.location.href.indexOf( "myProfile" ) > -1 ) || ( window.location.href.indexOf( "password" ) > -1 ) ||  ( window.location.href.indexOf( "reports" ) > -1 ) ) {
//        window.location = 'dashboard'
//        taskNavLoadHandler( value );
//    } else if ( window.location.href.indexOf( "dashboard" ) > -1 ) {
//        taskNavLoadHandler( value );
//    }
//};

$( document ).ready( function () {
    roleBaseAccess();
    topNavUserName();
    $( ".datepicker" ).datepicker( {
        format: "dd-mm-yyyy",
    } );

    setInterval( function () {
        checkSession();
    }, 300000 );
} )// ready ends