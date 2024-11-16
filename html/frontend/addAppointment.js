document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addAppointmentForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Form not found!');
    }
});

async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // The form element
    const submitButton = form.querySelector('button[type="submit"]');

    // Get form data
    const appointmentDate = document.getElementById('appointment-date').value.trim();
    const startTime = document.getElementById('app-start-time').value.trim();
    const doctorId = document.getElementById('doctor').value.trim();

    // Client-side validation
    if (!appointmentDate || !startTime || !doctorId) {
        alert('Please fill in all fields.');
        return;
    }

    const appointmentData = {
        appointment_date: appointmentDate,
        app_start_time: startTime,
        doctor_id: doctorId
    };

    try {
        // Disable the submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const response = await fetch('/appointmentActions/add', {  // Adjust endpoint as per your backend API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
            alert('Appointment added successfully');
            console.log('Appointment added successfully');
            form.reset(); // Reset the form
            showSuccessMessage(); // Display success message
        } else {
            const errorData = await response.json();
            console.error('Error adding appointment:', errorData.message || response.statusText);
            alert(`Failed to add appointment: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add appointment');
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

// Function to display a success message
function showSuccessMessage() {
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Appointment added successfully';
    successMessage.style.color = 'green';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.marginTop = '20px';

    const form = document.getElementById('addAppointmentForm');
    form.parentElement.appendChild(successMessage);

    // Remove the message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}
