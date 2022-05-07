const loginForm = document.querySelector('#login-form');

function login(body) {
    axios.post(`/login`, body)
        .then(res => {
            console.log('found login');
            //store needed info for future pages
            window.localStorage.setItem("userID",res.data.user_id);
            window.localStorage.setItem("firstName",res.data.first_name);
            window.localStorage.setItem("lastName",res.data.last_name)
            //go to next page
            window.location.assign("./portal.html");
        })
        .catch(err => {
            console.log(err)
            alert('login failed.')
        })
} 


function loginSubmitHandler(event) {
    event.preventDefault();
    //collect data from inputs and create object
    let email = document.querySelector('#email-input');
    let password = document.querySelector('#password-input');

    let bodyObj = {
        email: email.value,
        password: password.value
    }
    //submit object to login
    login(bodyObj);
    //clear input values
    email.value = '';
    password.value = '';
}

//submit login event
loginForm.addEventListener('submit', loginSubmitHandler);