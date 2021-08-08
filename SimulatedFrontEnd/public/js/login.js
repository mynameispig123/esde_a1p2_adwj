if (sessionStorage.length != 0) {
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
            Authorization: "Bearer " + token
        },
    })
        .then(function (response) {
            if (response.data.userRole == 1) {
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

let $loginFormContainer = $('#loginFormContainer');
if ($loginFormContainer.length != 0) {
    console.log('Login form detected. Binding event handling logic to form elements.');
    //If the jQuery object which represents the form element exists,
    //the following code will create a method to submit registration details
    //to server-side api when the #submitButton element fires the click event.
    $('#submitButton').on('click', function (event) {
        event.preventDefault();
        const baseUrl = 'https://52.54.247.200:5000';
        let email = $('#emailInput').val();
        let password = $('#passwordInput').val();
        let webFormData = new FormData();
	    
        //console.log("Login.js > email: " + email );
    	//console.log("Login.js > password: " + password);
        //regex check for the email to ensure that there is no chance for a attack through the email field
        let email_regex = new RegExp('^[a-zA-Z0-9.]+(?:\\+[a-zA-Z0-9.]+)*@[a-zA-Z0-9.]+.[a-zA-Z0-9]{2,}$');

        if (email_regex.test(email)) {
            //webFormData.append('email', email);
            //webFormData.append('password', password);
            const bodyData = {
                "email": email,
                "password": password
            };
            
            axios({
                method: 'post',
                url: baseUrl + '/api/user/login',
                //data: webFormData,
                headers: { 
                    'Content-Type': 'application/json'
                },
                data : bodyData
            })
                .then(function (response) {
                    //Inspect the object structure of the response object.
                    //console.log('Inspecting the respsone object returned from the login web api');
                    //console.dir(response);
                    userData = response.data;
                    if (userData.role_name == "user") {
                        
                        sessionStorage.setItem('token', userData.token);
                        sessionStorage.setItem('user_id', userData.user_id);
                        sessionStorage.setItem('role_name', userData.role_name);

                        //localStorage.setItem('token', userData.token);
                        //localStorage.setItem('user_id', userData.user_id);
                        //localStorage.setItem('role_name', userData.role_name);
                        
                        window.location.replace('user/manage_submission.html');
                        return;
                    }
                    if (response.data.role_name == "admin") {
                        sessionStorage.setItem('token', userData.token);
                        sessionStorage.setItem('user_id', userData.user_id);
                        sessionStorage.setItem('role_name', userData.role_name);

                        //localStorage.setItem('token', userData.token);
                        //localStorage.setItem('user_id', userData.user_id);
                        //localStorage.setItem('role_name', userData.role_name);
                        
                        window.location.replace('admin/manage_users.html');
                        return;
                    }
                })
                .catch(function (response) {
                    //Handle error
                    console.dir(response);
                    new Noty({
                        type: 'error',
                        layout: 'topCenter',
                        theme: 'sunset',
                        timeout: '6000',
                        text: 'Unable to login. Check your email and password',
                    }).show();

                });
        } else {
            new Noty({
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                timeout: '6000',
                text: 'Unable to login. Check your email and password',
            }).show();
        }

    });

} //End of checking for $loginFormContainer jQuery object
