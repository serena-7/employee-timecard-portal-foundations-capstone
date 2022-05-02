const loginForm = document.querySelector('#login-form');

const baseURL = `http://localhost:4005/api`;

function login(body) {
    axios.post(`${baseURL}/login`, body)
        .then(res => {
            console.log('found login');
            window.localStorage.setItem("userID",res.data.user_id);
            window.location.assign("./portal.html");
        })
        .catch(err => {
            console.log(err)
            alert('login failed.')
        })
} 


function loginSubmitHandler(event) {
    event.preventDefault();

    let email = document.querySelector('#email-input');
    let password = document.querySelector('#password-input');

    let bodyObj = {
        email: email.value,
        password: password.value
    }
    login(bodyObj);

    email.value = '';
    password.value = '';
}

loginForm.addEventListener('submit', loginSubmitHandler);