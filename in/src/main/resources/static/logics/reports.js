jQuery( function () {

// this is the id of the form
	$("#populateDaybook").click(function(e) {
	    e.preventDefault(); // avoid to execute the actual submit of the form.
//		var taskId = $("#save").attr('title');
		var startDate = $('#startDate').val()
		var endDate = $('#endDate').val();
			$( '#table_id tbody' ).empty();
			if(startDate == '' || endDate == ''){
				alert('Please select date to generate daybook');
			}else{
			var settings = {
		    "url": postTaskDetailsDayBookURL,
			  "method": "POST",
			  "timeout": 0,
			"headers": {
		    	"Content-Type": "application/json",
				"Authorization": accessToken
		  	},
		  "data": JSON.stringify({
			"startDate" : formatDateHandlerInput(startDate),
			"endDate" : formatDateHandlerInput(endDate),
		  }),
		};
			$.ajax(settings).done(function (response) {
				if(response.success == 200 ){
					    setTimeout( function () {
					        dataTableFilterHandler();
					    }, 1000 );
					$.each( response.body, function ( i, obj ) {
						console.log('data restul', response.body);
		                var div_data = '<tr>'
		                    + '<td>' + obj.projectName + '</td>'
							+ '<td>' + obj.partyName + '</td>'
							+ '<td>' + obj.taskType + '</td>'
							+ '<td>' + obj.billingClient + '</td>'		                    
							+ '<td>' + obj.responsibilityName + '</td>'
							+ '<td>' + obj.exceutionName + '</td>'
							+ '<td>' + obj.consultingName + '</td>'
							+ '<td>' + obj.intimationName + '</td>'
							+ '<td>' + formatDateHandler( obj.createdAt ) + '</td>'		                    
							+ '<td>' + formatDateHandler( obj.dueDate ) + '</td>'
							+ '<td>' + formatDateHandler( obj.endDate ) + '</td>'
		                    + '<td>' + obj.remarks + '</td>'
							+ '</tr>';
		                $( div_data ).appendTo( '#populateGrid' );
		                
		            });
					alert('Daybook loaded');
				}else if(reponse.success === 401 ){
					checkSession();
				}else{
					alert('something went wrong.'+ data);
				}
			});
			
			}
		});

} )// jquery end


function dataTableFilterHandler () {
    //Data table filter
    $( '#table_id' ).DataTable( {
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

function formatDateHandlerInput ( value ) {
    //console.log( 'duedate', value );
    var date = new Date( value );
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    var result = year + "-" + day + "-" + month;
    //console.log( 'v result', result );
    return result;
};
