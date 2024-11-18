document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addDoctorForm');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent the form from submitting traditionally

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            // Send data to the backend using Fetch API (POST request)
            const response = await fetch('/api/doctor/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),  // Send the form data as JSON
            });

            const result = await response.json();

            if (response.ok) {
                alert('Doctor added successfully!');
                // Optionally, redirect or reset the form
                window.location.href = 'admin_Doctors.html';  // Redirect to the doctors list page
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            alert('Failed to add doctor');
        }
    });
});