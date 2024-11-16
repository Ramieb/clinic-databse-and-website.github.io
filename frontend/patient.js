document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    console.log(`Extracted Username: ${username}`); // Should log the actual username

    if (username) {
        document.getElementById('appointmentContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('billingContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('paymentContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('referralContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('medicationContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('allergyContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('illnessContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('surgeryContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('immunizationContent').innerHTML = "Data will populate automatically via database triggers.";
        document.getElementById('medicalHistoryContent').innerHTML = "Data will populate automatically via database triggers.";
    } else {
        console.error("No username provided in URL");
        document.getElementById('appointmentContent').innerHTML = 'Username is missing from the URL.';
    }

    // Logout functionality
    const logoutLink = document.querySelector('.nav-link[href="../index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '../index.html';
        });
    } else {
        console.error("Logout link not found.");
    }
});
