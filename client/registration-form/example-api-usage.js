// example-api-usage.js
// Example of how to call the authentication API from your frontend

/**
 * Register a new user
 * IMPORTANT: Send the password in PLAIN TEXT - it will be encrypted by HTTPS
 * and hashed on the backend
 */
async function registerUser(username, email, password) {
    try {
        const response = await fetch('http://localhost/server/authentication.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'register',
                username: username,
                email: email,
                password: password  // Send plain text - HTTPS encrypts, backend hashes
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Registration successful:', data);
            // Store user data in localStorage or sessionStorage
            localStorage.setItem('user', JSON.stringify(data.data));
            // Redirect to dashboard or login page
            window.location.href = '/client/dashboard.html';
        } else {
            console.error('Registration failed:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
    }
}

/**
 * Login user
 */
async function loginUser(username, password) {
    try {
        const response = await fetch('http://localhost/server/authentication.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                username: username,
                password: password  // Send plain text - HTTPS encrypts, backend verifies
            })
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('Login successful:', data);
            // Store user data
            localStorage.setItem('user', JSON.stringify(data.data));
            // Redirect to dashboard
            window.location.href = '/client/dashboard.html';
        } else {
            console.error('Login failed:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
    }
}

// Example usage in your registration form:
// document.getElementById('registerForm').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('username').value;
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     await registerUser(username, email, password);
// });
