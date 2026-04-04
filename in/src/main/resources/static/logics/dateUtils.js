// Shared date formatting helpers for task views.

// Pad a number with a leading zero to 2 digits.
function addLeadingZero(value) {
    return ('0' + value).slice(-2);
}

// Convert a JS Date or date string understood by new Date()
// to a UI string in format DD-MM-YYYY.
function formatDateToUi(value) {
    if (!value) {
        return '';
    }
    var date = new Date(value);
    if (isNaN(date.getTime())) {
        return '';
    }
    var month = addLeadingZero(date.getMonth() + 1);
    var day = addLeadingZero(date.getDate());
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
}

// Convert a date string used in the UI (DD-MM-YYYY) back to
// a Date instance. Returns null if parsing fails.
function parseUiDate(value) {
    if (!value) {
        return null;
    }
    var parts = value.split('-');
    if (parts.length !== 3) {
        return null;
    }
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
        return null;
    }
    return date;
}
