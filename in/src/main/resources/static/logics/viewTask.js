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
                    + '<td>' + sortStatusText(obj.status) + '</td>'
                    + '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View/Edit</a></td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                
            } );
        }
    } );
};

function sortStatusText(value){
	if( value ==  `ShortWork`){
        return 'Short Work';
    }
	if( value ==  `InProcess`){
        return 'In Process';
    }
	if( value ==  `WorkOnClientEnd`){
        return 'Work On Client End';
    }
	if( value ==  `Done`){
        return 'Done';
    }
	if( value ==  `ReadyToCheck`){
        return 'Ready To Check';
    }
	if( value ==  `DiscussionWithSatishJi`){
        return 'Discussion With Satish Ji';
    }
	if( value ==  `ReadyToUpload`){
        return 'Ready To Upload'
    }
	else{
		return value;
	}
}

function dataTableFilterHandler () {
    //Data table filter
    $( '#table_id' ).DataTable( {
	"createdRow": function( row, data, dataIndex){
                if( data[9] ==  'Short Work'){
                    $(row).addClass('ShortWork');
                }
				else if( data[9] ==  'In Process'){
                    $(row).addClass('InProcess');
                }
				else if( data[9] ==  'Work On Client End'){
                    $(row).addClass('WorkOnClientEnd');
                }
				else if( data[9] ==  'Done'){
                    $(row).addClass('Done');
                }
				else if( data[9] ==  'Ready To Check'){
                    $(row).addClass('ReadyToCheck');
                }
				else if( data[9] ==  'Discussion With Satish Ji'){
                    $(row).addClass('DiscussionWithSatishJi');
                }
				else if( data[9] ==  'Ready To Upload'){
                    $(row).addClass('ReadyToUpload');
                }else{
					$(row).addClass('whiteRow');
				}
            },
			"order": [[ 7, "asc" ]],
			"bPaginate": false,
        dom: 'Bfrtip',
		buttons: [
			'excel'
			],
    	colReorder: true,
        initComplete: function () {
            this.api().columns([1,2,3,4,5,6,7,9]).every( function () {
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
//		exportOptions: { 
//		            format: {
//		                header: function ( data, column, row )
//		                    {
//		                        return data.substring(data.indexOf("value")+9,data.indexOf("</option"));
//		                    }
//		             }
//		        },
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
	
    if ( value.trim() ) {
        return 'Yes';
    } else {
        return 'No'
    }
};

function redirectToTaskDetails ( id ) {
	window.location.pathname = 'vscca/createTaskForm';
    sessionStorage.setItem( 'taskId', id );
}
