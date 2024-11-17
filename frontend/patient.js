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
                    console.error('Error in response:', response);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse the JSON response
            })
            .then((appointments) => {
                displayAppointments(appointments); // Send the fetched data to the display function
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                upcomingAppointmentsDiv.textContent = 'Error loading appointments.';
            });
    }

    // Display upcoming appointments
    function displayAppointments(appointments) {
        upcomingAppointmentsDiv.innerHTML = ''; // Clear previous content

        if (appointments.length === 0) {
            upcomingAppointmentsDiv.textContent = 'No upcoming appointments.';
            return;
        }

        appointments.forEach((appointment) => {
            const appointmentDiv = document.createElement('div');
            appointmentDiv.className = 'appointment';
            appointmentDiv.innerHTML = `
                <p>Doctor: ${appointment.doctor_first_name} ${appointment.doctor_last_name} (${appointment.doctor_specialty})</p>
                <p>Date: ${appointment.app_date}</p>
                <p>Time: ${appointment.app_start_time}</p>
                <p>Reason: ${appointment.reason_for_visit}</p>
            `;
            upcomingAppointmentsDiv.appendChild(appointmentDiv);
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
                        feedbackDiv.textContent = "Appointment scheduled successfully!";
                        feedbackDiv.style.color = "green";
                        appointmentForm.reset();
                        fetchAppointments(username); // Refresh the list
                    } else {
                        feedbackDiv.textContent = `Error: ${data.error || 'Unknown error'}`;
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
});
