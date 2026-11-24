$( function () {
    $( '#table_id' ).on( 'click', '.billing-client-details', function () {
        sessionStorage.setItem( 'billingId', this.dataset.billingId );
        window.location = 'addBillingClient';
    } );
    loadBillingClientGrid();
} );

function loadBillingClientGrid () {
    const status = $( '#billingGridStatus' );
    const showLoadError = () => status.text( 'Could not load billing clients. Refresh the page to try again.' );
    status.text( 'Loading billing clients...' );

    $.ajax( {
        type: 'GET',
        url: getBillingClientsURL,
        dataType: 'json',
        headers: { Authorization: accessToken },
        success: function ( response ) {
            if ( response ) {
                checkSession( response.success );
            }
            if ( !response || response.success !== 200 || !Array.isArray( response.body ) ) {
                showLoadError();
                return;
            }

            const body = $( '#populateGrid' );
            response.body.forEach( client => body.append( renderBillingClientRow( client ) ) );
            initializeBillingClientGrid();
            status.text( '' );
        },
        error: showLoadError
    } );
}

function renderBillingClientRow ( client ) {
    const row = document.createElement( 'tr' );
    const parts = typeof client.client === 'string' ? client.client.split( '-' ) : [];
    const [partyName = '', ledgerNumber = '', pageNumber = ''] = parts;
    row.insertCell().textContent = partyName;
    row.insertCell().textContent = ledgerNumber;
    row.insertCell().textContent = pageNumber;
    row.insertCell().textContent = Number( client.isActive ) === 1 ? 'Active' : 'Deactive';

    const details = document.createElement( 'button' );
    details.type = 'button';
    details.className = 'btn pointer billing-client-details';
    details.dataset.billingId = String( client.id );
    details.textContent = 'View/Edit';
    row.insertCell().append( details );
    return row;
}

function initializeBillingClientGrid () {
    $( '#table_id' ).DataTable( {
        language: { emptyTable: 'No billing clients found.' },
        layout: { topStart: 'buttons', topEnd: 'search', bottomEnd: null },
        paging: false,
        buttons: [ {
            extend: 'excelHtml5',
            exportOptions: { format: { header: formatGridExportHeader } }
        } ],
        initComplete: function () {
            addGridColumnFilters( this.api(), [0, 1, 2, 3] );
        }
    } );
}
