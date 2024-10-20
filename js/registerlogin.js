/*login*/

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    
    // Retrieve user data from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user exists and password is correct
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        alert('Welcome, ' + username + '!');
        // You can redirect to another page or perform other actions here
    } else {
        alert('Invalid username or password. Please try again.');
    }
}
function confirmAction(message, redirectUrl) {
    if (confirm(message)) {
      // User clicked "OK"
      window.location.href = "../games.html";
    } else {
      // User clicked "Cancel"
      console.log("Action canceled.");
    }
  }

// Make sure this event listener is present in your script
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

/*Register functionality*/
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;   
    const email = document.getElementById('registerEmail').value;
    
    // Retrieve existing users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        alert('Username already exists. Please choose a different one.');
        return;
    }
    if (users.some(u => u.email === email)) {
        alert('Email already registered. Please use a different email.');
        return;
    }
    
    // Add new user
    users.push({ username, email, password });
    
    // Save updated users array to local storage
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Registration successful! You can now log in.');
    window.location.href = '../login.html'; // Redirect to login page
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
function clearLocalStorage() {
    if (confirm("Are you sure you want to clear all local storage? This will remove all user data.")) {
        localStorage.clear();
        alert("Local storage has been cleared.");
    }
}

