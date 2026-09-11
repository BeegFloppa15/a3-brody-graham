window.onload = function(){
    const loginButton = document.getElementById("login")
    //loginButton.onsubmit = attemptLogin
}

function attemptLogin(event){
    event.preventDefault()

    const username = document.getElementById("username-entry").value
    const password = document.getElementById("password-entry").value

    console.log(`Attempting to login user ${username} with ${password}`)
}