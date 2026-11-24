(function () {
    const uploadButton = document.getElementById('uploadTasks');
    if (!uploadButton) {
        return;
    }

    uploadButton.addEventListener('click', validateUploadFile);

    function validateUploadFile() {
        const fileInput = document.getElementById('file');
        if (!fileInput.value) {
            alert('Select a task workbook to upload.');
            return false;
        }
        if (!/\.xlsx$/i.test(fileInput.value)) {
            alert('Select an XLSX task workbook.');
            return false;
        }
        return uploadBulkTask();
    }

    function uploadBulkTask() {
        if (uploadButton.disabled || !confirm('Are you sure?')) {
            return false;
        }

        const form = document.getElementById('fileinfo');
        function showUploadFailure(status) {
            if (status === 401) {
                sessionStorage.clear();
                alert('Your session is no longer authorized. Sign in again before uploading.');
            } else if (status === 400) {
                alert('Upload a readable XLSX task workbook containing Sheet1.');
            } else {
                alert('Unable to import tasks. Check the workbook and try again.');
            }
        }

        const data = new FormData(form);
        uploadButton.disabled = true;
        $.ajax({
            url: postUploadBulkTaskURL,
            type: 'POST',
            data,
            headers: { Authorization: accessToken },
            cache: false,
            contentType: false,
            processData: false,
            success: function (response) {
                const status = Number(response && response.success);
                if (status !== 200 || response.message !== 'success') {
                    showUploadFailure(status);
                    return;
                }

                form.reset();
                alert('Tasks uploaded successfully.');
                window.location = 'dashboard';
            },
            error: function (request) {
                showUploadFailure(request.status);
            },
            complete: function () {
                uploadButton.disabled = false;
            }
        });

        return false;
    }
})();
