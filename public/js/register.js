window.onload = function(){
    // if user tried to do duplicate username
    const urlInputs = new URLSearchParams(window.location.search)
    if (urlInputs.get('user') === 'duplicate'){
        console.log('Duplicate user, showing error')
        const usernameDiv = document.getElementById('entire-username-div')
        usernameDiv.classList.add('invalid')
        usernameDiv.innerHTML = `<input type="text" name="username" value="" aria-label="Username Entry" id = "username-entry">
              <output class="invalid">That username is already being used. Please try again.</output>`
    }
}