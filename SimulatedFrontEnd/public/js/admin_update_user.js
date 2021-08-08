let $updateUserFormContainer = $('#updateUserFormContainer');
if ($updateUserFormContainer.length != 0) {
    console.log('Update User form is detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit user role data
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function(event) {
        event.preventDefault();
        const baseUrl = 'https://52.54.247.200:5000';
        //Collect role id value from the input element, roleIdInput
        let roleId = $('#roleIdInput').val();
        //Obtain user id & token from local storage
        let userId = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token');
        //There is a hidden textbox input, userRecordIdInput
        let recordId = $('#userRecordIdInput').val();
        let webFormData = new FormData();
        //const searchParams = new URLSearchParams(window.location.search);
        //let qid = searchParams.get('id');

        //console.log("qid: " + qid);
        
        webFormData.append('roleId', roleId);
        webFormData.append('recordId', recordId);
        webFormData.append('queryId', qid);
        
        console.log("roleId: " + roleId);
        console.log("recordId: " + recordId);
        

        axios({
                method: 'put',
                url: baseUrl + '/api/user/',
                data: webFormData,
                headers: { 
                    'Content-Type': 'multipart/form-data', 
                    'user': userId,
                    authorization: 'Bearer ' + token,
                }
            })
            .then(function(response) {
                new Noty({
                    type: 'success',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '5000',
                    text: 'User role has changed.',
                }).show();
            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    layout: 'topCenter',
                    theme: 'sunset',
                    timeout: '6000',
                    text: 'Unable to update.',
                }).show();

            });
    });
    $('#backButton').on("click", function(e) {
        e.preventDefault();
        window.history.back();
    });

    function getOneUser() {

        const baseUrl = 'https://52.54.247.200:5000';
        var query = window.location.search.substring(1);
        let arrayData = query.split("=");
        let recordIdToSearchUserRecord = arrayData[1];
        let userId = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token');

        axios({
                headers: {
                    'user': userId,
                    authorization: 'Bearer ' + token
                },
                method: 'get',
                url: baseUrl + '/api/user/' + recordIdToSearchUserRecord,
            })
            .then(function(response) {
                //Using the following to inspect the response.data data structure
                //before deciding the code which dynamically populate the elements with data.
                console.dir(response.data);
                const record = response.data.userdata;
                $('#fullNameOutput').text(record.fullname);
                $('#emailOutput').text(record.email);
                $('#userRecordIdInput').val(record.user_id);
                $('#roleIdInput').val(record.role_id);

            })
            .catch(function(response) {
                //Handle error
                console.dir(response);
                new Noty({
                    type: 'error',
                    timeout: '6000',
                    layout: 'topCenter',
                    theme: 'sunset',
                    text: 'Unable retrieve user data',
                }).show();
            });

    } //End of getOneUser
    //Call getOneUser function to do a GET HTTP request on an API to retrieve one user record
    getOneUser();
} //End of checking for $updateUserFormContainer jQuery object
