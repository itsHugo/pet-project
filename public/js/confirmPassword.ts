window.onload = init;

function init() {
    let passwordInput = <HTMLInputElement>document.getElementById("Password");
    let confirmPasswordInput = <HTMLInputElement>document.getElementById("ConfirmPassword");
    let registerBtn = <HTMLButtonElement>document.getElementById("registerBtn");

    passwordInput.addEventListener("keyup", checkPassword);
    confirmPasswordInput.addEventListener("keyup", checkPassword);
    registerBtn.disabled = true;
    
}

function checkPassword() {
    let passwordInput = <HTMLInputElement>document.getElementById("Password");
    let confirmPasswordInput = <HTMLInputElement>document.getElementById("ConfirmPassword");
    let registerBtn = <HTMLButtonElement>document.getElementById("registerBtn");

    if(passwordInput.value != confirmPasswordInput.value){
        confirmPasswordInput.style.borderColor = "#E34234";
        passwordInput.style.borderColor = "#E34234";
        registerBtn.disabled = true;
    } else {
        confirmPasswordInput.style.borderColor = "";
        passwordInput.style.borderColor = "";
        registerBtn.disabled = false;
    }
}