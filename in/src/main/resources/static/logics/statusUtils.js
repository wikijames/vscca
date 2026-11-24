// Shared configuration and helpers for task statuses.

// Map of status code to its metadata.
// Keep this in sync with templates/fragments/statusOptions.html
// and CSS row classes in static/css/custom.css.
var statusConfig = {
    UrgentProcess: {
        code: 'UrgentProcess',
        label: 'Urgent Process',
        sortOrder: 1,
        rowClass: 'UrgentProcess'
    },
    InProcess: {
        code: 'InProcess',
        label: 'Processing',
        sortOrder: 2,
        rowClass: 'InProcess'
    },
    CAReview: {
        code: 'CAReview',
        label: 'CA Review',
        sortOrder: 3,
        rowClass: 'CAReview'
    },
    ReadyToCheck: {
        code: 'ReadyToCheck',
        label: 'SV Review',
        sortOrder: 4,
        rowClass: 'ReadyToCheck'
    },
    ReadyToUpload: {
        code: 'ReadyToUpload',
        label: 'On Upload',
        sortOrder: 5,
        rowClass: 'ReadyToUpload'
    },
    OnSubmission: {
        code: 'OnSubmission',
        label: 'On Submission',
        sortOrder: 6,
        rowClass: 'OnSubmission'
    },
    DiscussionWithSatishJi: {
        code: 'DiscussionWithSatishJi',
        label: 'FCA Satish',
        sortOrder: 7,
        rowClass: 'DiscussionWithSatishJi'
    },
    StuckClient: {
        code: 'StuckClient',
        label: 'Stuck Client',
        sortOrder: 8,
        rowClass: 'StuckClient'
    },
    WorkOnClientEnd: {
        code: 'WorkOnClientEnd',
        label: 'Stuck Dept',
        sortOrder: 9,
        rowClass: 'WorkOnClientEnd'
    },
    TPPending: {
        code: 'TPPending',
        label: 'TP Pending',
        sortOrder: 10,
        rowClass: 'TPPending'
    },
    ShortWork: {
        code: 'ShortWork',
        label: 'Short Work',
        sortOrder: 11,
        rowClass: 'ShortWork'
    },
    FollowUp: {
        code: 'FollowUp',
        label: 'Follow Up',
        sortOrder: 12,
        rowClass: 'FollowUp'
    },
    Done: {
        code: 'Done',
        label: 'Completed',
        sortOrder: 13,
        rowClass: 'Done'
    },
    FutureWork: {
        code: 'FutureWork',
        label: 'Future Work',
        sortOrder: 14,
        rowClass: 'FutureWork'
    }
};

// Normalise possible legacy/raw status strings to a known code.
function normaliseStatusCode(raw) {
    if (!raw) {
        return '';
    }
    // Handle legacy value "In Process".
    if (raw === 'In Process') {
        return 'InProcess';
    }
    return raw;
}

function getStatusSortOrder(code) {
    var normalised = normaliseStatusCode(code);
    if (statusConfig[normalised]) {
        return statusConfig[normalised].sortOrder;
    }
    // Unknown statuses go to the bottom
    return 999;
}

function getStatusLabel(code) {
    var normalised = normaliseStatusCode(code);
    if (statusConfig[normalised]) {
        return statusConfig[normalised].label;
    }
    return code;
}

// Given a human-readable label (from the Status column),
// return the CSS row class name if known, else null.
function getRowClassFromStatusLabel(label) {
    if (!label) {
        return null;
    }
    for (var key in statusConfig) {
        if (statusConfig.hasOwnProperty(key) && statusConfig[key].label === label) {
            return statusConfig[key].rowClass;
        }
    }
    return null;
}
