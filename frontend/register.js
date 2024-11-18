document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // fetch url for azure website: https://clinic-website.azurewebsites.net/register
    // fetch url for localhost: http://localhost:8080/register
    try {
        const response = await fetch('https://clinic-website.azurewebsites.net/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Removed role from body
        });

        if (response.ok) {
            alert('Registration successful! You can now log in.');
            window.location.href = '../index.html';
        } else {
            const errorData = await response.json();
            alert(`Registration failed: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Registration failed, please try again later.');
    }
});