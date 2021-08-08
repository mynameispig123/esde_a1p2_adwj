if (sessionStorage.length !== 0) {
    console.log("There is a user currently logged in");
    console.log("Redirecting them to where they need to go...");

    let token = sessionStorage.getItem('token');
    let loggedInUserID = sessionStorage.getItem('user_id');
    let baseUrl = 'https://52.54.247.200:5000'
    // ------------------------------------------------------
    // Backend call to check token validity & authorisation
    // ------------------------------------------------------
    axios({
        method: 'post',
        url: baseUrl + '/api/user/authentication-check',
        //data: webFormData,
        headers: {
            authorization: "Bearer " + token,
            'user': loggedInUserID
        }
    })
        .then(function (response) {
            if (response.data.userRole == "admin") {
                console.log("Redirecting to admin profile page");
                window.location.href = "/admin/profile.html";
            } else {
                console.log("Redirecting to user profile page");
                window.location.href = "/user/profile.html";
            }
        })
        .catch(function (response) {
            console.log("Error!!");
            console.log(response);

            if (response.response.status == 403) {
                sessionStorage.clear();
                window.location.href = "/login.html";
            } else {
                sessionStorage.clear();
                window.location.href = "/home.html";
            }
        });
}

let $registerFormContainer = $('#registerFormContainer');
if ($registerFormContainer.length != 0) {
    console.log('Registration form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function (event) {
        event.preventDefault();
        const baseUrl = 'https://52.54.247.200:5000';
        let fullName = $('#fullNameInput').val();
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();

        let fullName_regEx = new RegExp("^[a-zA-Z0-9\s,']+$");
        let email_regEx = new RegExp("^[a-zA-Z0-9\.]+(?:[a-zA-Z0-9\.]+)*@[a-zA-Z0-9\.]+\.[a-zA-Z0-9]{2,}$");
        let pwd_regEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$");

        // console.log(fullName_regEx.test(fullName));
        // console.log(email);
        // console.log(email_regEx.test(email));
        // console.log(pwd_regEx.test(password));

        if (fullName_regEx.test(fullName) && pwd_regEx.test(password) && email_regEx.test(email)) {
            console.log("test success");
            let webFormData = new FormData();
            webFormData.append('fullName', fullName);
            webFormData.append('email', email);
            webFormData.append('password', password);
            axios({
                method: 'post',
                url: baseUrl + '/api/user/register',
                data: webFormData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(function (response) {
                    //Handle success
                    console.dir(response);
                    new Noty({
                        type: 'success',
                        timeout: '6000',
                        layout: 'topCenter',
                        theme: 'bootstrap-v4',
                        text: 'You have registered. Please <a href="login.html" class=" class="btn btn-default btn-sm" >Login</a>',
                    }).show();
                })
                .catch(function (response) {
                    //Handle error
                    console.dir(response);
                    new Noty({
                        timeout: '6000',
                        type: 'error',
                        layout: 'topCenter',
                        theme: 'sunset',
                        text: 'Unable to register.',
                    }).show();
                });
        } else {
            console.log("test failed");
            new Noty({
                timeout: '6000',
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Unable to register',
            }).show();
        }

    });

} //End of checking for $registerFormContainer jQuery object
