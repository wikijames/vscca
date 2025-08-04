jQuery( function () {
//    populateDataHandler();

    setTimeout( function () {
        dataTableFilterHandler();
		//alert('hi')
    }, 1000 );

} )// jquery end

function truncateText(text, maxLength = 9) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

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
				console.log('obj=>', obj);
				var div_data = '<tr>'
                    + '<td>' + obj.projectName + '</td>'
                    + '<td>' + obj.partyName + '</td>'
					+ '<td> <a onClick="redirectToTaskDetails(' + obj.taskId + ')" class="btn pointer">View/Edit</a></td>'
					//+ '<td>' + obj.weightage + '</td>'
                    + '<td>' + truncateText(obj.responsibilityName) + '</td>'
					+ '<td>' + truncateText(obj.exceutionName) + '</td>'
					+ '<td>' + truncateText(obj.consultingName) + '</td>'
					+ '<td>' + truncateText(obj.intimationName) + '</td>'
					+ '<td>' + obj.taskType+ '</td>'
					+ '<td>' + formatDateHandler( obj.dueDate ) + '</td>'
                    //+ '<td>' + obj.dueDate  + '</td>'
                    + '<td>' + isTaskDescription( obj.taskDescription ) + '</td>'
                    + '<td>' + sortStatusText(obj.status) + '</td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
                
            } );
        }
    } );
};

function sortStatusText(value){
	if( value ==  'InProcess'){
		return 'Processing';
	}
	if( value ==  'In Process'){
	 	return 'Processing';
	}
	if( value ==  'UrgentProcess'){
		return 'Urgent Process';
	}
	if( value ==  'ReadyToCheck'){
		return 'SV Review';
	}     
	if( value ==  `CAReview`){
	    return 'CA Review';
	}
	if( value ==  `ShortWork`){
	    return 'Short Work';
	}
	if( value ==  `TPPending`){
	    return 'TP Pending';
	}
	if( value ==  `WorkOnClientEnd`){
	    return 'Stuck Dept';
	}
	if( value ==  `StuckClient`){
	    return 'Stuck Client';
	}
	if( value ==  `DiscussionWithSatishJi`){
	    return 'FCA Satish';
	}
	if( value ==  `OnSubmission`){
	    return 'On Submission';
	}
	if( value ==  `ReadyToUpload`){
	    return 'On Upload'
	}
	if( value ==  `Done`){
	    return 'Completed'
	}
	if( value ==  `FutureWork`){
	    return 'Future Work'
	}
	else{
		return value;
	}
}

function dataTableFilterHandler () {
//	var buttonCommon = {
//        exportOptions: { 
//		            format: {
//		                header: function ( data, column, row )
//		                    {
//		                        return data.substring(data.indexOf("value")+9,data.indexOf("</option"));
//		                    }
//		             }
//		        },
//    };

//var buttonCommon = {
//	exportOptions : {
//		format : {
//			header : function (data, column, row, node) {
//				return data.replace(/X/g, '');
//			}
//		}
//	}
//};
//		

    //Data table filter
    $.fn.dataTable.moment( 'D-M-YYYY');
    $( '#table_id' ).DataTable( {
	"createdRow": function( row, data, dataIndex){
				if( data[10] ==  'Processing'){
				    $(row).addClass('InProcess');
				}
				else if( data[10] ==  'Processing'){
				    $(row).addClass('In Process');
				}        
				else if( data[10] ==  'Urgent Process'){
				    $(row).addClass('UrgentProcess');
				}
				else if( data[10] ==  'SV Review'){
				    $(row).addClass('ReadyToCheck');
				}
				else if( data[10] ==  'CA Review'){
				    $(row).addClass('CAReview');
				}
				else if( data[10] ==  'Short Work'){
				    $(row).addClass('ShortWork');
				}
				else if( data[10] ==  'TP Pending'){
				    $(row).addClass('TPPending');
				}				
				else if( data[10] ==  'Stuck Dept'){
				    $(row).addClass('WorkOnClientEnd');
				}
				else if( data[10] ==  'Stuck Client'){
				    $(row).addClass('StuckClient');
				}
				else if( data[10] ==  'FCA Satish'){
				    $(row).addClass('DiscussionWithSatishJi');
				}
				else if( data[10] ==  'On Submission'){
				    $(row).addClass('OnSubmission');
				}				
				else if( data[10] ==  'On Upload'){
				    $(row).addClass('ReadyToUpload');
				}
				else if( data[10] ==  'Completed'){
				    $(row).addClass('Done');
				}
				else if( data[10] ==  'Future Work'){
				    $(row).addClass('FutureWork');
				}
				else{
					$(row).addClass('whiteRow');
				}
            },
			"order": [[ 7, "asc" ]],
			"bPaginate": false,
			stateSave: true,
        dom: 'Bfrtip',
		buttons: [
			'excel'
			],

//columns: [
//            { data: 'Project Name' },
//            { data: 'Party Name' },
//            { data: 'Weightage' },
//            { data: 'Responsibility' },
//            { data: 'Execution' },
//            { data: 'Intimation' }
//        ],
//        dom: 'Bfrtip',
//        buttons: [
//            $.extend( true, {}, buttonCommon, {
//                extend: 'copyHtml5'
//            } ),
//            $.extend( true, {}, buttonCommon, {
//                extend: 'Excel'
//            } ),
//            $.extend( true, {}, buttonCommon, {
//                extend: 'pdfHtml5'
//            } )
//        ],
    	colReorder: true,
        initComplete: function () {
            this.api().columns([1,3,4,5,6,7,8,10]).every( function () {
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

////$(document).ready(function() {
//    var buttonCommon = {
//        exportOptions: {
//            format: {
//                body: function ( data, row, column, node ) {
//                    // Strip $ from salary column to make it numeric
//                    return column === 5 ?
//                        data.replace( /[$,]/g, '' ) :
//                        data;
//                }
//            }
//        }
//    };
// 
//    $('#example').DataTable( {
//        ajax: '../../../../examples/ajax/data/objects.txt',
//        columns: [
//            { data: 'name' },
//            { data: 'position' },
//            { data: 'office' },
//            { data: 'extn' },
//            { data: 'start_date' },
//            { data: 'salary' }
//        ],
//        dom: 'Bfrtip',
//        buttons: [
//            $.extend( true, {}, buttonCommon, {
//                extend: 'copyHtml5'
//            } ),
//            $.extend( true, {}, buttonCommon, {
//                extend: 'excelHtml5'
//            } ),
//            $.extend( true, {}, buttonCommon, {
//                extend: 'pdfHtml5'
//            } )
//        ]
//    } );
//} );

function resetTableHandler(){
	var url = window.location.pathname
	console.log(url);
	localStorage.removeItem("DataTables_table_id_"+url);
	window.location.pathname = url;
}

function cbDropdown ( column ) {
    return $( '<ul>', {
        'class': 'cb-dropdown'
    } ).appendTo( $( '<div>', {
        'class': 'cb-dropdown-wrap'
    } ).appendTo( column ) );
};

function addLeadingZeroOnDate(value){
	const result = ('0' + value).slice(-2);
	return result;
}

function formatDateHandler ( value ) {
    var date = new Date( value );
    var month = addLeadingZeroOnDate(date.getMonth() + 1);
    var day = addLeadingZeroOnDate(date.getDate());
    var year = date.getFullYear();
    var result = day + "-" + month + "-" + year;
    return result;
};

function isTaskDescription ( value ) {	
    if (value && value.trim() ) {
        return 'Yes';
    } else {
        return 'No'
    }
};

function redirectToTaskDetails ( id ) {
	window.location.pathname = 'vscca/createTaskForm';
    sessionStorage.setItem( 'taskId', id );
}
