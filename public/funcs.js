function getCurrDate() {
    let dateField = document.querySelector('#date-input')
    let currentDateInfo = document.querySelector('#current-date-info')
    dateField.value = convertDate(null,true);
    currentDateInfo.innerText = convertDate(null, false);
}

function loadPortal() {
    let nameInfo = document.querySelector('#name-info');
    let firstName = window.localStorage.getItem('firstName');
    let lastName = window.localStorage.getItem('lastName');
    nameInfo.innerHTML = firstName + ' ' + lastName;
    getCurrDate();
}

function convertDate(dateText, toDateFormat){
    let date;
    if(dateText){
        date = new Date(dateText);
    } else {
        date = new Date();
    }
    if(toDateFormat){
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0');
    } else {
        return (date.getMonth() + 1).toString().padStart(2,'0') + ' / ' + (date.getDate()).toString().padStart(2,'0') + ' / ' + date.getFullYear();
    }
}