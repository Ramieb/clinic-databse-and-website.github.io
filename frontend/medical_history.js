document.addEventListener('DOMContentLoaded', () => {
    // Extract username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
        // Use the username for any necessary actions in the medical history page
        console.log(`Username: ${username}`);
    } else {
        console.error("Username is missing from the URL.");
    }

    // Your existing collapsible and logout functionality
    const coll = document.querySelectorAll('.collapsible');
    coll.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    // Logout link functionality
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '../index.html';
        });
    }
});
