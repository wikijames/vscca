var selectedTaskIds = [];
var isTaskTableInitialized = false;
var taskListRequest;
var bulkStatusUpdatePending = false;

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
	jQuery( '#statusUpdateBtn' ).prop( 'disabled', !hasStatus || bulkStatusUpdatePending );
}

function clearSelection () {
	selectedTaskIds = [];
	jQuery( '#table_id tbody .row-select' ).prop( 'checked', false ).closest( 'tr' ).removeClass( 'selected' );
	syncSelectAllCheckbox();
	updateStatusUpdateButtonState();
}

function setTaskCheckboxSelection ( checkbox, checked ) {
	const taskId = checkbox.val();
	if ( checked ) {
		addSelectedTaskId( taskId );
	} else {
		removeSelectedTaskId( taskId );
	}
	checkbox.prop( 'checked', checked ).closest( 'tr' ).toggleClass( 'selected', checked );
}

function syncSelectAllCheckbox () {
	const rows = jQuery( '#table_id tbody .row-select:visible' );
	const checkedCount = rows.filter( ':checked' ).length;
	jQuery( '#selectAllRows' ).prop( {
		checked: rows.length > 0 && checkedCount === rows.length,
		indeterminate: checkedCount > 0 && checkedCount < rows.length
	} );
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
	if ( bulkStatusUpdatePending || !taskIds.length || !newStatus ) {
		return;
	}

	bulkStatusUpdatePending = true;
	const loading = jQuery( '#loading' );
	const modalInputs = jQuery( '#confirmStatusUpdateBtn, #statusSelect' );
	loading.show();
	modalInputs.prop( 'disabled', true );
	updateStatusUpdateButtonState();

	jQuery.ajax( {
		type: 'POST',
		url: updateTaskStatusURL,
		dataType: 'json',
		contentType: 'application/json',
		headers: {
			'Authorization': accessToken
		},
		data: JSON.stringify( { taskIds: taskIds, status: newStatus } ),
		success: function ( response ) {
			if ( response ) {
				checkSession( response.success );
			}
			if ( !response || response.success !== 200 ) {
				showStatusToast( 'Failed to update status.', 'danger' );
				return;
			}

			showStatusToast( 'Status updated successfully.', 'success' );
			jQuery( '#statusUpdateModal' ).modal( 'hide' );
			clearSelection();
			if ( typeof showTaskbyTypeHandler === 'function' ) {
				showTaskbyTypeHandler();
			}
		},
		error: function () {
			showStatusToast( 'Failed to update status.', 'danger' );
		},
		complete: function () {
			bulkStatusUpdatePending = false;
			loading.hide();
			modalInputs.prop( 'disabled', false );
			updateStatusUpdateButtonState();
		}
	} );
}

jQuery( function () {
//    populateDataHandler();

	// Initialize Status Update button state
	updateStatusUpdateButtonState();

	jQuery( '#table_id' ).on( 'click', '.task-details', function () {
		redirectToTaskDetails( this.dataset.taskId );
	} );

	jQuery( '#table_id' ).on( 'change', '.row-select', function () {
		setTaskCheckboxSelection( jQuery( this ), this.checked );
		updateStatusUpdateButtonState();
		syncSelectAllCheckbox();
	} );

	jQuery( '#table_id' ).on( 'change', '#selectAllRows', function () {
		const checked = this.checked;
		jQuery( '#table_id tbody .row-select:visible' ).each( function () {
			setTaskCheckboxSelection( jQuery( this ), checked );
		} );
		updateStatusUpdateButtonState();
		syncSelectAllCheckbox();
	} );

	jQuery( '#table_id' ).on( 'draw.dt', syncSelectAllCheckbox );

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

function truncateText( text, maxLength ) {
	var limit = typeof maxLength === 'number' ? maxLength : 9;
	if ( !text ) {
		return '';
	}
	return text.length > limit ? text.substring( 0, limit ) + '...' : text;
}

function renderTaskRow ( task ) {
	const row = document.createElement( 'tr' );
	const checkbox = document.createElement( 'input' );
	checkbox.type = 'checkbox';
	checkbox.className = 'row-select';
	checkbox.value = String( task.taskId );
	row.insertCell().append( checkbox );
	row.insertCell().textContent = String( task.projectName );
	row.insertCell().textContent = String( task.partyName );

	const details = document.createElement( 'button' );
	details.type = 'button';
	details.className = 'btn pointer task-details';
	details.dataset.taskId = String( task.taskId );
	details.textContent = 'View/Edit';
	row.insertCell().append( details );

	row.insertCell().textContent = truncateText( task.responsibilityName );
	row.insertCell().textContent = truncateText( task.exceutionName );
	row.insertCell().textContent = truncateText( task.consultingName );
	row.insertCell().textContent = truncateText( task.intimationName );
	row.insertCell().textContent = String( task.taskType );

	const dueDate = task.dueDate ? new Date( task.dueDate ) : null;
	const dueDateCell = row.insertCell();
	dueDateCell.textContent = formatDateToUi( dueDate );
	const dueDateSortOrder = dueDateCell.textContent
		? dueDate.getFullYear() * 10000 + ( dueDate.getMonth() + 1 ) * 100 + dueDate.getDate()
		: Number.MAX_SAFE_INTEGER;
	dueDateCell.dataset.order = String( dueDateSortOrder );

	row.insertCell().textContent = isTaskDescription( task.taskDescription );
	const statusCell = row.insertCell();
	statusCell.dataset.order = String( getStatusSortOrder( task.status ) );
	statusCell.textContent = sortStatusText( task.status );
	return row;
}

function requestTaskList ( url ) {
	return $.ajax( {
		type: 'GET',
		url: url,
		dataType: 'json',
		headers: {
			'Content-Type': 'application/json',
			Authorization: accessToken
		}
	} );
}

function populateData ( url ) {
	if ( taskListRequest ) {
		taskListRequest.abort();
	}

	var status = $( '#taskGridStatus' );
	status.text( 'Loading tasks...' );
	$( '#recordCount' ).text( '' );
	clearSelection();

	if ( $.fn.dataTable && $.fn.dataTable.isDataTable( '#table_id' ) ) {
		$( '#table_id' ).DataTable().clear().destroy();
		$( '#table_id thead th .cb-dropdown-wrap' ).remove();
	}
	isTaskTableInitialized = false;
	$( '#populateGrid' ).empty();

	taskListRequest = requestTaskList( url )
		.done( function ( data ) {
			if ( data ) {
				checkSession( data.success );
			}
			if ( !data || data.success !== 200 || !Array.isArray( data.body ) ) {
				status.text( 'Could not load tasks. Refresh the page to try again.' );
				return;
			}

			$.each( data.body, function ( i, task ) {
				$( renderTaskRow( task ) ).appendTo( '#populateGrid' );
			} );
			$( '#recordCount' ).text( data.body.length );
			dataTableFilterHandler();
			isTaskTableInitialized = true;
			status.text( '' );
		} )
		.fail( function ( xhr, textStatus ) {
			if ( textStatus !== 'abort' ) {
				status.text( 'Could not load tasks. Refresh the page to try again.' );
			}
		} );
}

function sortStatusText(value){
	// Delegate status code -> display label to shared helper,
	// keeping behaviour consistent with statusOptions.html.
	return getStatusLabel( value );
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
    $( '#table_id' ).DataTable( {
        language: { emptyTable: 'No tasks found.' },
	columnDefs: [
		{
			targets: 0,
			orderable: false,
			searchable: false
		}
	],
	"createdRow": function( row, data, dataIndex){
				// Use the actual cell text for status and map it
				// via shared status utils to the correct row class,
				// so colours stay in sync everywhere.
				var statusText = $('td:eq(11)', row).text().trim();
				var rowClass = getRowClassFromStatusLabel( statusText );
				if ( rowClass ) {
					$( row ).addClass( rowClass );
				} else {
					$( row ).addClass( 'whiteRow' );
				}
			},
			// Default sort: custom status order (column 11)
			// using the data-order attribute set in populateData.
			"order": [[ 11, "asc" ]],
			paging: false,
			stateSave: true,
        layout: { topStart: 'buttons', topEnd: 'search', bottomEnd: null },
		buttons: [
		  {
		    extend: 'excelHtml5',
		    exportOptions: {
		      columns: ':not(:first-child)',
		      format: {
		        header: function (data, columnIdx, node) {
		          // Remove the dropdown wrapper and extract only the header text
		          return $( node ).clone()
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
                addTaskColumnFilter( this );
            } );
        },

    } );
};

function buildTaskColumnSearch ( values ) {
    if ( values.length === 0 ) {
        return '';
    }

    const escapedValues = values.map( value => $.fn.dataTable.util.escapeRegex( value ) );
    return '^(' + escapedValues.join( '|' ) + ')$';
}

function addTaskColumnFilter ( column ) {
    const menu = cbDropdown( $( column.header() ) );
    menu.on( 'change', ':checkbox', function () {
        const values = menu.find( ':checked' ).map( function () {
            return this.value;
        } ).get();

        $( this ).closest( 'li' ).toggleClass( 'active', this.checked );
        menu.parent().toggleClass( 'active', values.length > 0 );
        column.search( buildTaskColumnSearch( values ), true, false ).draw();
    } );

    column.cache( 'search' ).unique().sort().each( function ( value ) {
        const label = $( '<label>' );
        label.append(
            $( '<span>', { text: value } ),
            $( '<input>', { type: 'checkbox', value: value } )
        );
        menu.append( $( '<li>' ).append( label ) );
    } );
}

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

function isTaskDescription ( value ) {	
    if (value && value.trim() ) {
        return 'Yes';
    } else {
        return 'No'
    }
};

function redirectToTaskDetails ( id ) {
	sessionStorage.setItem( 'taskId', id );
	window.location.pathname = 'vscca/createTaskForm';
}
