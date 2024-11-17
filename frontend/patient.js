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
        upcomingAppointmentsDiv.textContent = 'Loading upcoming appointments...';

        fetch(`https://clinic-website.azurewebsites.net/api/appointments/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log('Fetched appointments:', data);
                displayAppointments(data);
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                upcomingAppointmentsDiv.textContent = 'Failed to load upcoming appointments.';
            });
    }

    // Display upcoming appointments
    function displayAppointments(appointments) {
        upcomingAppointmentsDiv.innerHTML = ''; // Clear any existing content

        if (appointments.length === 0) {
            upcomingAppointmentsDiv.textContent = 'No upcoming appointments.';
            return;
        }

        appointments.forEach((appointment) => {
            const appointmentCard = document.createElement('div');
            appointmentCard.className = 'appointment-card';
            appointmentCard.innerHTML = `
                <p><strong>Doctor:</strong> ${appointment.doctor_first_name} ${appointment.doctor_last_name}</p>
                <p><strong>Specialty:</strong> ${appointment.doctor_specialty}</p>
                <p><strong>Date:</strong> ${appointment.app_date}</p>
                <p><strong>Time:</strong> ${appointment.app_start_time} - ${appointment.app_end_time}</p>
                <p><strong>Reason:</strong> ${appointment.reason_for_visit}</p>
            `;
            upcomingAppointmentsDiv.appendChild(appointmentCard);
        });
    }

    // Add new appointment
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(appointmentForm);
            const appointmentData = Object.fromEntries(formData);
            appointmentData.username = username; // Add username to the data

            console.log('Submitting appointment data:', appointmentData); // Debug log

            fetch('https://clinic-website.azurewebsites.net/api/appointments', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        feedbackDiv.textContent = 'Appointment scheduled successfully!';
                        feedbackDiv.style.color = 'green';
                        appointmentForm.reset();
                        fetchAppointments(username); // Refresh the list
                    } else {
                        feedbackDiv.textContent = `Error: ${data.error || 'Unknown error'}`;
                        feedbackDiv.style.color = 'red';
                    }
                })
                .catch((error) => {
                    console.error('Error scheduling appointment:', error);
                    feedbackDiv.textContent = 'Error scheduling appointment.';
                    feedbackDiv.style.color = 'red';
                });
        });
    }
});
