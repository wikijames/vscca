$( function () {
    $( '#populateDaybook' ).on( 'click', loadDaybook );
} );

function daybookRequestDate ( value ) {
    const parts = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec( value.trim() );
    if ( !parts ) {
        return '';
    }

    const iso = parts[3] + '-' + addLeadingZero( parts[2] ) + '-' + addLeadingZero( parts[1] );
    const date = new Date( iso + 'T00:00:00Z' );
    return !isNaN( date.getTime() ) && date.toISOString().slice( 0, 10 ) === iso ? iso : '';
}

function loadDaybook () {
    const button = $( '#populateDaybook' );
    if ( button.prop( 'disabled' ) ) {
        return;
    }

    const status = $( '#daybookStatus' );
    const startDate = daybookRequestDate( $( '#startDate' ).val() );
    const endDate = daybookRequestDate( $( '#endDate' ).val() );
    if ( !startDate || !endDate || startDate > endDate ) {
        status.text( 'Enter a valid date range in DD-MM-YYYY format.' );
        return;
    }

    const showError = () => status.text( 'Could not load the daybook. Try again.' );
    button.prop( 'disabled', true );
    status.text( 'Loading daybook...' );
    $.ajax( {
        url: postTaskDetailsDayBookURL,
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        headers: { Authorization: accessToken },
        data: JSON.stringify( { startDate, endDate } ),
        success: function ( response ) {
            if ( !response || response.success !== 200 || !Array.isArray( response.body ) ) {
                showError();
                return;
            }

            renderDaybook( response.body );
            status.text( 'Daybook loaded.' );
        },
        error: showError,
        complete: function () {
            button.prop( 'disabled', false );
        }
    } );
}

function renderDaybook ( tasks ) {
    const table = $( '#table_id' );
    if ( $.fn.dataTable.isDataTable( table[0] ) ) {
        table.DataTable().clear().destroy();
    }

    const body = $( '#populateGrid' ).empty();
    tasks.forEach( task => {
        const row = document.createElement( 'tr' );
        [
            task.projectName, task.partyName, task.taskType, task.billingClient,
            task.responsibilityName, task.exceutionName, task.consultingName, task.intimationName,
            formatDateToUi( task.createdAt ), formatDateToUi( task.dueDate ), formatDateToUi( task.endDate ),
            task.remarks
        ].forEach( value => {
            row.insertCell().textContent = value == null ? '' : String( value );
        } );
        body.append( row );
    } );

    table.DataTable( {
        language: { emptyTable: 'No daybook entries found.' },
        layout: { topStart: 'buttons', topEnd: null, bottomEnd: null },
        buttons: ['excelHtml5'],
        searching: false,
        paging: false
    } );
}
