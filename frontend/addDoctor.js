// Assuming your form has an ID of "add-doctor-form"
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-doctor-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Here you would typically process your form data (e.g., send it to your server)
        
        // After processing, redirect back to the doctors page
        window.location.href = 'doctors.html';
    });
});