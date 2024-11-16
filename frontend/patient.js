document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.getElementById('appointmentForm');
    const upcomingAppointmentsDiv = document.getElementById('appointmentContent');
    const feedbackDiv = document.getElementById('appointmentFeedback');

    const username = new URLSearchParams(window.location.search).get('username');

    if (username) {
        // Fetch upcoming appointments
        fetchAppointments(username);
    } else {
        upcomingAppointmentsDiv.textContent = "Username is missing from the URL.";
        return;
    }

    // Fetch upcoming appointments
    function fetchAppointments(username) {
        fetch(`/api/appointments/${username}`)
            .then((response) => response.json())
            .then((data) => {
                displayAppointments(data);
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                upcomingAppointmentsDiv.textContent = 'Error loading appointments.';
            });
    }

    // Display appointments dynamically
    function displayAppointments(appointments) {
        upcomingAppointmentsDiv.innerHTML = '';
        if (appointments.length === 0) {
            upcomingAppointmentsDiv.textContent = 'No upcoming appointments.';
            return;
        }
        appointments.forEach((appointment) => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment';
            appointmentDiv.innerHTML = `
                <p>Doctor: ${appointment.doctor}</p>
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

            fetch('/api/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        feedbackDiv.textContent = "Appointment scheduled successfully!";
                        feedbackDiv.style.color = "green";
                        appointmentForm.reset();
                        fetchAppointments(username); // Refresh the list
                    } else {
                        feedbackDiv.textContent = `Error: ${data.message}`;
                        feedbackDiv.style.color = "red";
                    }
                })
                .catch((error) => {
                    console.error('Error scheduling appointment:', error);
                    feedbackDiv.textContent = 'Error scheduling appointment.';
                    feedbackDiv.style.color = "red";
                });
        });
    }

    // Delete an appointment
    function deleteAppointment(appointmentId) {
        fetch(`/api/appointments/${appointmentId}`, {
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    fetchAppointments(username); // Refresh the list
                } else {
                    console.error('Error deleting appointment:', data.message);
                }
            })
            .catch((error) => {
                console.error('Error deleting appointment:', error);
            });
    }
});
