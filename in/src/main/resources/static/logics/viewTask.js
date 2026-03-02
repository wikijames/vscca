var selectedTaskIds = [];
var isTaskTableInitialized = false;

function addSelectedTaskId ( id ) {
	if ( selectedTaskIds.indexOf( id ) === -1 ) {
		selectedTaskIds.push( id );
	}
}

function removeSelectedTaskId ( id ) {
	selectedTaskIds = selectedTaskIds.filter( function ( existingId ) {
		return existingId !== id;
	} );
}

function updateStatusUpdateButtonState () {
	var hasSelection = selectedTaskIds.length > 0;
	var $controls = jQuery( '#statusInlineControls' );
	var $statusSelect = jQuery( '#headerStatusSelect' );
	var hasStatus = hasSelection && $statusSelect.length && !!$statusSelect.val();
	if ( hasSelection ) {
		$controls.removeClass( 'd-none' );
	} else {
		$controls.addClass( 'd-none' );
		if ( $statusSelect.length ) {
			$statusSelect.val( '' );
		}
	}
	jQuery( '#statusUpdateBtn' ).prop( 'disabled', !hasStatus );
}

function clearSelection () {
	selectedTaskIds = [];
	jQuery( '#table_id tbody .row-select' ).prop( 'checked', false ).closest( 'tr' ).removeClass( 'selected' );
	jQuery( '#selectAllRows' ).prop( 'checked', false );
	updateStatusUpdateButtonState();
}

function syncSelectAllCheckbox () {
	var $rows = jQuery( '#table_id tbody .row-select:visible' );
	if ( !$rows.length ) {
		jQuery( '#selectAllRows' ).prop( 'checked', false );
		return;
	}
	var allChecked = $rows.filter( ':checked' ).length === $rows.length;
	jQuery( '#selectAllRows' ).prop( 'checked', allChecked );
}

function showStatusToast ( message, type ) {
	if ( typeof jQuery.notify === 'function' ) {
		jQuery.notify( {
			message: message
		}, {
			type: type || 'success',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay: 3000
		} );
	} else if ( typeof jQuery.fn.notify === 'function' ) {
		jQuery( 'body' ).notify( {
			message: message
		}, {
			type: type || 'success',
			placement: {
				from: 'top',
				align: 'center'
			},
			delay: 3000
		} );
	} else {
		alert( message );
	}
}

function bulkUpdateTaskStatus ( taskIds, newStatus ) {
	if ( jQuery( '#loading' ).length ) {
		jQuery( '#loading' ).show();
	}
	jQuery.ajax( {
		type: 'POST',
		url: updateTaskStatusURL,
		contentType: 'application/json',
		headers: {
			'Authorization': accessToken
		},
		data: JSON.stringify( { taskIds: taskIds, status: newStatus } ),
		success: function ( response ) {
			if ( jQuery( '#loading' ).length ) {
				jQuery( '#loading' ).hide();
			}
			checkSession( response.success );
			if ( response.success === 200 ) {
				showStatusToast( 'Status updated successfully.', 'success' );
				jQuery( '#statusUpdateModal' ).modal( 'hide' );
				clearSelection();
				// Reload current task view (dashboard/yourTask/today/week/overdue)
				if ( typeof showTaskbyTypeHandler === 'function' ) {
					showTaskbyTypeHandler();
				}
			} else {
				showStatusToast( response.message || 'Failed to update status.', 'danger' );
			}
		},
		error: function () {
			if ( jQuery( '#loading' ).length ) {
				jQuery( '#loading' ).hide();
			}
			showStatusToast( 'Failed to update status.', 'danger' );
		}
	} );
}

jQuery( function () {
//    populateDataHandler();

	// Initialize Status Update button state
	updateStatusUpdateButtonState();

	// Row checkbox change handler (delegated)
	jQuery( '#table_id' ).on( 'change', '.row-select', function () {
		var $this = jQuery( this );
		var taskId = $this.val();
		if ( $this.is( ':checked' ) ) {
			addSelectedTaskId( taskId );
			$this.closest( 'tr' ).addClass( 'selected' );
		} else {
			removeSelectedTaskId( taskId );
			$this.closest( 'tr' ).removeClass( 'selected' );
		}
		updateStatusUpdateButtonState();
		syncSelectAllCheckbox();
	} );

	// Header select-all checkbox handler
	jQuery( '#table_id' ).on( 'change', '#selectAllRows', function () {
		var checked = jQuery( this ).is( ':checked' );
		jQuery( '#table_id tbody .row-select:visible' ).each( function () {
			var $cb = jQuery( this );
			var taskId = $cb.val();
			$cb.prop( 'checked', checked );
			if ( checked ) {
				addSelectedTaskId( taskId );
				$cb.closest( 'tr' ).addClass( 'selected' );
			} else {
				removeSelectedTaskId( taskId );
				$cb.closest( 'tr' ).removeClass( 'selected' );
			}
		} );
		updateStatusUpdateButtonState();
	} );

	// Enable/disable Change button when header status dropdown changes
	jQuery( '#headerStatusSelect' ).on( 'change', function () {
		updateStatusUpdateButtonState();
	} );

	// Open modal on Status Update button click
	jQuery( '#statusUpdateBtn' ).on( 'click', function () {
		if ( !selectedTaskIds.length ) {
			return;
		}
		var selectedStatus = jQuery( '#headerStatusSelect' ).val();
		if ( !selectedStatus ) {
			showStatusToast( 'Please select a status first.', 'warning' );
			return;
		}
		// Fill hidden status field and summary text in the confirmation modal
		jQuery( '#statusSelect' ).val( selectedStatus );
		jQuery( '#confirmStatusUpdateBtn' ).prop( 'disabled', false );
		var count = selectedTaskIds.length;
		var statusText = jQuery( '#headerStatusSelect option:selected' ).text();
		jQuery( '#statusUpdateCount' ).text( count );
		jQuery( '#statusUpdateStatusText' ).text( statusText );
		jQuery( '#statusUpdateModal' ).modal( 'show' );
	} );

	// Confirm status update
	jQuery( '#confirmStatusUpdateBtn' ).on( 'click', function () {
		var newStatus = jQuery( '#statusSelect' ).val();
		if ( !newStatus || !selectedTaskIds.length ) {
			return;
		}
		bulkUpdateTaskStatus( selectedTaskIds.slice(), newStatus );
	} );

} )// jquery end

function truncateText(text, maxLength = 9) {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Returns a numeric sort order for each status so that
// DataTables can apply a custom default ordering.
function getStatusSortOrder ( value ) {
	// Normalise to underlying status code where possible
	// (handles both "InProcess" and "In Process").
	if ( value === 'In Process' ) {
		value = 'InProcess';
	}
	switch ( value ) {
		case 'UrgentProcess':
			return 1;
		case 'InProcess':
			return 2;
		case 'CAReview':
			return 3;
		case 'ReadyToCheck':
			return 4;
		case 'ReadyToUpload':
			return 5;
		case 'OnSubmission':
			return 6;
		case 'DiscussionWithSatishJi':
			return 7;
		case 'StuckClient':
			return 8;
		case 'WorkOnClientEnd':
			return 9;
		case 'TPPending':
			return 10;
		case 'ShortWork':
			return 11;
		case 'FollowUp':
			return 12;
		case 'Done':
			return 13;
		case 'FutureWork':
			return 14;
		default:
			// Unknown statuses go to the bottom
			return 999;
	}
}

function populateData ( url ) {
    // Ensure DataTable is clean before reloading data so that
    // row callbacks (createdRow) run again and status colours apply correctly.
	clearSelection();

	// If DataTable is already initialized, destroy it and
	// clear existing rows before repopulating.
	if ( $.fn.dataTable && $.fn.dataTable.isDataTable( '#table_id' ) ) {
		$( '#table_id' ).DataTable().clear().destroy();
		// Remove any existing header filter dropdown wrappers
		// that were added in initComplete, so they don't stack up
		// when the table is reinitialized.
		$( '#table_id thead th .cb-dropdown-wrap' ).remove();
		isTaskTableInitialized = false;
	}

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
            let totalRows= 0;
			$.each( data.body, function ( i, obj ) {
				/*console.log('obj=>', obj);*/
				var statusSortOrder = getStatusSortOrder( obj.status );
				var div_data = '<tr>'
                    + '<td><input type="checkbox" class="row-select" value="' + obj.taskId + '"></td>'
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
					+ '<td data-order="' + statusSortOrder + '">' + sortStatusText(obj.status) + '</td>'
                    + '</tr>';
                $( div_data ).appendTo( '#populateGrid' );
				totalRows++;
            } );
			$('#recordCount').text(totalRows);
			// Reinitialize DataTable on every reload so that
			// createdRow is triggered for new rows and status
			// background colours are applied consistently.
			dataTableFilterHandler();
			isTaskTableInitialized = true;
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
	if( value ==  `FollowUp`){
	    return 'Follow Up'
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
	columnDefs: [
		{
			targets: 0,
			orderable: false,
			searchable: false
		}
	],
	"createdRow": function( row, data, dataIndex){
				// Use the actual cell text for status so that
				// row colours still work even when a numeric
				// data-order attribute is used for sorting.
				var statusText = $('td:eq(11)', row).text().trim();
				if( statusText === 'Processing'){
				    $(row).addClass('InProcess');
				}
				else if( statusText === 'Urgent Process'){
				    $(row).addClass('UrgentProcess');
				}
				else if( statusText === 'SV Review'){
				    $(row).addClass('ReadyToCheck');
				}
				else if( statusText === 'CA Review'){
				    $(row).addClass('CAReview');
				}
				else if( statusText === 'Short Work'){
				    $(row).addClass('ShortWork');
				}
				else if( statusText === 'TP Pending'){
				    $(row).addClass('TPPending');
				}				
				else if( statusText === 'Stuck Dept'){
				    $(row).addClass('WorkOnClientEnd');
				}
				else if( statusText === 'Stuck Client'){
				    $(row).addClass('StuckClient');
				}
				else if( statusText === 'FCA Satish'){
				    $(row).addClass('DiscussionWithSatishJi');
				}
				else if( statusText === 'On Submission'){
				    $(row).addClass('OnSubmission');
				}	
				else if( statusText === 'On Upload'){
				    $(row).addClass('ReadyToUpload');
				}
				else if (statusText === 'Follow Up') {
					$(row).addClass('FollowUp');
				}
				else if (statusText === 'Completed') {
					$(row).addClass('Done');
				}
				else if (statusText === 'Future Work') {
				    $(row).addClass('FutureWork');
				}
				else{
					$(row).addClass('whiteRow');
				}
			},
			// Default sort: custom status order (column 11)
			// using the data-order attribute set in populateData.
			"order": [[ 11, "asc" ]],
			"bPaginate": false,
			stateSave: true,
        dom: 'Bfrtip',
		buttons: [
		  {
		    extend: 'excelHtml5',
		    exportOptions: {
		      columns: ':not(:first-child)',
		      format: {
		        header: function (data, columnIdx, node) {
		          // Remove the dropdown wrapper and extract only the header text
		          return $('<div></div>')
		            .append(node.innerHTML)
		            .find('.cb-dropdown-wrap') // your dropdown container class
		            .remove()
		            .end()
		            .text()
		            .trim();
		        }
		      }
		    }
		  }
		],
    	colReorder: true,
        initComplete: function () {
			this.api().columns([2,4,5,6,7,8,9,11]).every( function () {
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
