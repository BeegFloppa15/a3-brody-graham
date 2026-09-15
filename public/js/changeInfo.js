let usernameEntry
let firstnameEntry
let lastnameEntry
let passwordEntry

window.onload = async function(){
    console.log('Requesting User Data')
    let dataResponse = await fetch('/getPlayerProfile')
    let userData = await dataResponse.json()
    console.log(userData)

    usernameEntry = document.getElementById('username-entry')
    firstnameEntry = document.getElementById('firstname-entry')
    lastnameEntry = document.getElementById('lastname-entry')
    passwordEntry = document.getElementById('password-entry')

    usernameEntry.value = userData.username
    firstnameEntry.value = userData.firstname
    lastnameEntry.value = userData.lastname
}

