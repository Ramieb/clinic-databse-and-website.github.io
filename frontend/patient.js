document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const upcomingAppointmentsDiv = document.getElementById('appointmentContent');
    const feedbackDiv = document.getElementById('appointmentFeedback');
    const scheduleAppointmentSection = document.getElementById('schedule-appointment');

    // Extract username from the URL or session storage
    let username = new URLSearchParams(window.location.search).get('username');
    if (username) {
        sessionStorage.setItem('username', username); // Save username in session storage
    } else {
        username = sessionStorage.getItem('username'); // Retrieve username from session storage
    }

    if (username) {
        // Update navbar links with the username
        updateNavLinks(username);

        // Fetch upcoming appointments
        fetchAppointments(username);
    } else {
        // Redirect to login page if username is missing
        alert('Username is missing. Redirecting to login page.');
        window.location.href = '/index.html';
        return;
    }

    // Function to update navigation links with the username
    function updateNavLinks(username) {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const url = new URL(link.href, window.location.origin); // Parse the link's href
            url.searchParams.set('username', username); // Add or update the username parameter
            link.href = url.toString(); // Update the link's href
        });
    }

    if (scheduleAppointmentSection) {
        scheduleAppointmentSection.style.display = 'block';
    }

    // Fetch upcoming appointments
    function fetchAppointments(username) {
        fetch(`https://clinic-website.azurewebsites.net/api/appointments/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    upcomingAppointmentsDiv.textContent = 'No upcoming appointments.';
                } else {
                    displayAppointments(data);
                }
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                upcomingAppointmentsDiv.textContent = 'Error loading appointments.';
            });
    }

    // Display appointments dynamically
    function displayAppointments(appointments) {
        upcomingAppointmentsDiv.innerHTML = '';
        appointments.forEach((appointment) => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment';
            appointmentDiv.innerHTML = `
                <p>Doctor: ${appointment.doctor_first_name} ${appointment.doctor_last_name} (${appointment.doctor_specialty})</p>
                <p>Date: ${appointment.app_date}</p>
                <p>Time: ${appointment.app_start_time}</p>
                <p>Reason: ${appointment.reason_for_visit}</p>
                <button class="delete-btn" data-id="${appointment.id}">Delete</button>
            `;
            upcomingAppointmentsDiv.appendChild(appointmentDiv);
        });

        // Add delete functionality
        document.querySelectorAll('.delete-btn').forEach((button) => {
            button.addEventListener('click', (event) => {
                const appointmentId = event.target.getAttribute('data-id');
                deleteAppointment(appointmentId);
            });
        });
    }

    // Add new appointment
if (appointmentForm) {
    appointmentForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(appointmentForm);
        const appointmentData = Object.fromEntries(formData);
        appointmentData.username = username; // Add username to the data

        // Log data for debugging
        console.log('Submitting appointment data:', appointmentData);

        // Fetch request to schedule appointment
        fetch('https://clinic-website.azurewebsites.net/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData),
        })
            .then((response) => {
                if (!response.ok) {
                    // Handle non-2xx status codes
                    return response.json().then((data) => {
                        throw new Error(data.error || 'Unknown server error');
                    });
                }
                return response.json(); // Parse JSON if successful
            })
            .then((data) => {
                console.log('Server response:', data); // Log server response for debugging
                if (data.success) {
                    feedbackDiv.textContent = 'Appointment scheduled successfully!';
                    feedbackDiv.style.color = 'green';
                    appointmentForm.reset();
                    fetchAppointments(username); // Refresh the list of appointments
                } else {
                    feedbackDiv.textContent = `Error: ${data.error || 'Unknown error'}`;
                    feedbackDiv.style.color = 'red';
                }
            })
            .catch((error) => {
                console.error('Error scheduling appointment:', error);
                feedbackDiv.textContent = `Error scheduling appointment: ${error.message}`;
                feedbackDiv.style.color = 'red';
            });
    });
}

    // Delete an appointment
    function deleteAppointment(appointmentId) {
        fetch(`https://clinic-website.azurewebsites.net/api/appointments/${appointmentId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    fetchAppointments(username); // Refresh the list
                } else {
                    console.error('Error deleting appointment:', data.error);
                }
            })
            .catch((error) => {
                console.error('Error deleting appointment:', error);
            });
    }
});
