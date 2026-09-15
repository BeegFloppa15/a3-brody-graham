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

    // if user tried to do duplicate username
    const urlInputs = new URLSearchParams(window.location.search)
    if (urlInputs.get('user') === 'duplicate'){
        console.log('Duplicate user, showing error')
        firstnameEntry.classList.add('Invalid')
        const usernameDiv = document.getElementById('entire-username-div')
        usernameDiv.classList.add('invalid')
        usernameDiv.innerHTML = `<input type="text" name="username" value="" aria-label="Username Modify" id = "username-entry">
              <output class="invalid">That username is already being used. Please try again.</output>`
    }
    usernameEntry.value = userData.username
    if (userData.firstname !== undefined)
        firstnameEntry.value = userData.firstname
    if (userData.lastname !== undefined)
        lastnameEntry.value = userData.lastname
    
}