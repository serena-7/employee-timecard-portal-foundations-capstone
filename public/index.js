const loginForm = document.querySelector('#login-form');

function login(body) {
    axios.post(`/login`, body)
        .then(res => {
            console.log('found login');
            window.localStorage.setItem("userID",res.data.user_id);
            window.localStorage.setItem("firstName",res.data.first_name);
            window.localStorage.setItem("lastName",res.data.last_name)
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