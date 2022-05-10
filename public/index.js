const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');

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
            alert(err.response.data)
        })
} 

function register(body) {
    axios.post(`/register`, body)
        .then(res => {
            console.log('user registered');
            //store needed info for future pages
            window.localStorage.setItem("userID",res.data.user_id);
            window.localStorage.setItem("firstName",res.data.first_name);
            window.localStorage.setItem("lastName",res.data.last_name);
            //go to next page
            window.location.assign("./portal.html")
        })
        .catch(err => {
            console.log(err);
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

function registerSubmitHandler(event) {
    event.preventDefault();
    //collect data from inputs
    let first = document.querySelector('#first-input');
    let last = document.querySelector('#last-input');
    let email = document.querySelector('#new-email-input');
    let password = document.querySelector('#new-pass-input');
    let confirmPass = document.querySelector('#confirm-pass-input');
    //if passwords match create object
    if(password.value === confirmPass.value){
        let bodyObj = {
            firstName: first.value,
            lastName: last.value,
            email: email.value,
            password: password.value
        }
        //check if user already exists
        axios.post('/checkuser', bodyObj)
            .then(res => {
                if(res.data === "does not exists"){
                    //register user and clear input fields if response from server is does not exist
                    register(bodyObj)
                    first.value = '';
                    last.value = '';
                    email.value = '';
                    password.value = '';
                    confirmPass.value = '';
                } else {
                    alert('email already exists');
                }
            })
            .catch(err => console.log(err));
    } else {
        alert('Passwords do not match')
    }

}

//submit events
loginForm.addEventListener('submit', loginSubmitHandler);
registerForm.addEventListener('submit',registerSubmitHandler);