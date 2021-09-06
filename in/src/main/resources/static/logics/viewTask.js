jQuery( function () {
//    populateDataHandler();

    setTimeout( function () {
        dataTableFilterHandler();
		//alert('hi')
    }, 1000 );

} )// jquery end

function populateData ( url ) {
    //$('#table_id').dataTable().destroy();
    $( '#table_id tbody' ).empty();
    $.ajax( {
        type: "GET",
        url: url,
        dataType: "json",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        success: function ( data ) {
            checkSession( data.success );
			$.each( data.body, function ( i, obj ) {
                var div_data = '<tr>'
                    + '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
                    + '<td>' + obj.weightage + '</td>'
                    + '<td>' + obj.responsibilityName + '</td>'
					+ '<td>' + obj.exceutionName + '</td>'
					+ '<td>' + obj.intimationName + '</td>'
					+ '<td>' + obj.consultingName + '</td>'
                    + '<td>' + formatDateHandler( obj.dueDate ) + '</td>'
                    + '<td>' + isTaskDescription( obj.taskDescription ) + '</td>'
                    + '<td>' + obj.status + '</td>'
                    + '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View/Edit</a></td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                
            } );
        }
    } );
};

//function taskNavLoadHandler ( value ) {
//	 if ( userRole == 'Admin' && value == 'dashboard') {
//	    alert( 'admin' );
//	    $( '#taskNameChangeHeading' ).text( 'All Tasks' );
//		return populateData( getTaskDetailsByUserURL );
//	}else if ( value == 'all' ) {
//        alert( 'all' );
//        $( '#taskNameChangeHeading' ).text( 'Your Tasks' );
//		return populateData( getTaskDetailsByUserURL );
//    } else if ( value == 'today' ) {
//        alert( 'today' );
//        $( '#taskNameChangeHeading' ).text( "Today's Task" );
//		return populateData(getTaskDetailsByUserTodayURL);
//    } else if ( value == 'week' ) {
//        alert( 'week' );
//        $( '#taskNameChangeHeading' ).text( "7 Day's Plan" );
//		return populateData(getTaskDetailsByUserWeekURL);
//    } else if ( value == 'overdue' ) {
//        alert( 'overdue' );
//        $( '#taskNameChangeHeading' ).text( "Overdue" );
//		return populateData(getTaskDetailsByUserByDueDateURL);
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

function dataTableFilterHandler () {
    //Data table filter
    $( '#table_id' ).DataTable( {
//        dom: 'Bfrtip',
//        buttons: [
//             {
//            extend: 'excelHtml5',
//            autoFilter: true
//       		 }
//        ],
        initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var ddmenu = cbDropdown( $( column.header() ) )
                    .on( 'change', ':checkbox', function () {
                        var active;
                        var vals = $( ':checked', ddmenu ).map( function ( index, element ) {
                            active = true;
                            return $.fn.dataTable.util.escapeRegex( $( element ).val() );
                        } ).toArray().join( '|' );

                        column
                            .search( vals.length > 0 ? '^(' + vals + ')$' : '', true, false )
                            .draw();

                        // Highlight the current item if selected.
                        if ( this.checked ) {
                            $( this ).closest( 'li' ).addClass( 'active' );
                        } else {
                            $( this ).closest( 'li' ).removeClass( 'active' );
                        }

                        // Highlight the current filter if selected.
                        var active2 = ddmenu.parent().is( '.active' );
                        if ( active && !active2 ) {
                            ddmenu.parent().addClass( 'active' );
                        } else if ( !active && active2 ) {
                            ddmenu.parent().removeClass( 'active' );
                        }
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    var // wrapped
                        $label = $( '<label>' ),
                        $text = $( '<span>', {
                            text: d
                        } ),
                        $cb = $( '<input>', {
                            type: 'checkbox',
                            value: d
                        } );

                    $text.appendTo( $label );
                    $cb.appendTo( $label );

                    ddmenu.append( $( '<li>' ).append( $label ) );
                } );
            } );
        },
    } );
};

function cbDropdown ( column ) {
    return $( '<ul>', {
        'class': 'cb-dropdown'
    } ).appendTo( $( '<div>', {
        'class': 'cb-dropdown-wrap'
    } ).appendTo( column ) );
};

function formatDateHandler ( value ) {
    //console.log( 'duedate', value );
    var date = new Date( value );
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var result = day + "-" + month + "-" + year;
    //console.log( 'v result', result );
    return result;
};

function isTaskDescription ( value ) {
    if ( value != null || value != '' || value != undefined ) {
        return 'Yes';
    } else {
        return 'No'
    }
};

function redirectToTaskDetails ( id ) {
    window.location = 'createTaskForm';
    sessionStorage.setItem( 'taskId', id );
}
