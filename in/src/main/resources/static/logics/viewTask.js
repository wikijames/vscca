jQuery( function () {
    populateDataHandler();
    setTimeout( function () {
        if(roles.toLowerCase() == 'admin'){
            dataTableFilterHandler();
        }else if(roles.toLowerCase() == 'supervisor'){
            dataTableFilterHandler();
        }else if(roles.toLowerCase() == 'teammember'){

        }
    }, 1000 );


    // $('#table_id').DataTable( {
    //     dom: 'Bfrtip',
    //     buttons: [
    //         'copy', 'csv', 'excel', 'pdf', 'print'
    //     ]
    // } );

} )// jquery end


function dataTableFilterHandler () {
    //Data table filter
    $( '#table_id' ).DataTable( {
        // dom: 'Bfrtip',
        // buttons: [
        //     'copy', 'csv', 'excel', 'pdf', 'print'
        // ],
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
        }
    } );
};

function formatDateHandler ( value ) {
    console.log( 'duedate', value );
    var date = new Date( value );
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var result = day + "-" + month + "-" + year;
    console.log( 'v result', result );
    return result;
};
function isTaskDescription ( value ) {
    if ( value != null || value != '' || value != undefined ) {
        return 'Yes';
    } else {
        return 'No'
    }
};
function viewTaskTypeHandler () {
    var value = $( '#viewType' ).val();
    $( '#taskNameChangeHeading' ).text( 'Your task' );
    if ( value == 'responsibility' ) {
        $( '#taskNameChangeHeading' ).text( 'Your task' );
        return populateData( getResponsibilityURL );
    }
    else if ( value == 'exceution' ) {
        $( '#taskNameChangeHeading' ).text( "Today's Task" );
        return populateData( getExceutionURL );
    }
    else if ( value == 'intimation' ) {
        $( '#taskNameChangeHeading' ).text( "7 Days's Plan" );
        return populateData( getIntimationURL );
    }
    else if ( value == 'consulting' ) {
        $( '#taskNameChangeHeading' ).text( "Overdue Task" );
        return populateData( getConsultingURL );
    }
}

function viewType () {
    var value = $( '#viewType' ).val();
    if ( value == 'responsibility' ) {
        return populateData( getResponsibilityURL );
    }
    else if ( value == 'exceution' ) {
        return populateData( getExceutionURL );
    }
    else if ( value == 'intimation' ) {
        return populateData( getIntimationURL );
    }
    else if ( value == 'consulting' ) {
        return populateData( getConsultingURL );
    }
}

function populateData ( url ) {
    //$('#table_id').dataTable().destroy();
    $( '#table_id tbody' ).empty();
    var count = 0;
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
                count++;
                var div_data = '<tr>'
                    + '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
                    + '<td>' + obj.weightage + '</td>'
                    + '<td>' + obj.responsibility + '</td>'
                    + '<td>' + formatDateHandler( obj.dueDate ) + '</td>'
                    + '<td>' + isTaskDescription( obj.taskDescription ) + '</td>'
                    + '<td>' + obj.status + '</td>'
                    + '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View</a></td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                console.log(count, 'data div', data.body )
            } );
        }
    } );
};

function populateDataHandler () {
    //data table - view all task
    $('#taskNameChangeHeading').text('All Task');
    $( '#table_id tbody' ).empty();
    var count;
    $.ajax( {
        type: "GET",
        url: getResponsibilityURL,
        dataType: "json",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": accessToken
        },
        success: function ( data ) {
            checkSession( data.success );
            $.each( data.body, function ( i, obj ) {
                count = i++;
                var div_data = '<tr>'
                    + '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
                    + '<td>' + obj.weightage + '</td>'
                    + '<td>' + obj.responsibility + '</td>'
                    + '<td>' + formatDateHandler( obj.dueDate ) + '</td>'
                    + '<td>' + isTaskDescription( obj.taskDescription ) + '</td>'
                    + '<td>' + obj.status + '</td>'
                    + '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View</a></td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                console.log(count, 'data div', data.body )
            } );
        }
    } );
};

function cbDropdown ( column ) {
    return $( '<ul>', {
        'class': 'cb-dropdown'
    } ).appendTo( $( '<div>', {
        'class': 'cb-dropdown-wrap'
    } ).appendTo( column ) );
};


function redirectToTaskDetails ( id ) {
    window.location = 'createTaskForm';
    sessionStorage.setItem( 'taskId', id );
}

