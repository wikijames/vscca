function buildGridColumnSearch ( values ) {
    if ( values.length === 0 ) {
        return '';
    }

    const escapedValues = values.map( value => $.fn.dataTable.util.escapeRegex( value ) );
    return '^(' + escapedValues.join( '|' ) + ')$';
}

function addGridColumnFilter ( column ) {
    const wrapper = $( '<div>', { class: 'cb-dropdown-wrap' } ).appendTo( column.header() );
    const menu = $( '<ul>', { class: 'cb-dropdown' } ).appendTo( wrapper );
    menu.on( 'change', ':checkbox', function () {
        const values = menu.find( ':checked' ).map( function () {
            return this.value;
        } ).get();

        $( this ).closest( 'li' ).toggleClass( 'active', this.checked );
        wrapper.toggleClass( 'active', values.length > 0 );
        column.search( buildGridColumnSearch( values ), true, false ).draw();
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

function addGridColumnFilters ( table, columnIndexes ) {
    table.columns( columnIndexes ).every( function () {
        addGridColumnFilter( this );
    } );
}

function formatGridExportHeader ( data, columnIndex, node ) {
    return $( node ).clone()
        .find( '.cb-dropdown-wrap' )
        .remove()
        .end()
        .text()
        .trim();
}
