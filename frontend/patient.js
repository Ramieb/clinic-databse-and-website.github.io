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

    // Add timeout functionality to fetch
    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 7000 } = options; // 7-second timeout
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await fetch(resource, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        return response;
    }

    // Fetch upcoming appointments
    function fetchAppointments(username) {
        const fetchUrl = `https://clinic-website.azurewebsites.net/api/appointments/${username}`; // Updated to full URL
        upcomingAppointmentsDiv.textContent = 'Loading upcoming appointments...';

        fetchWithTimeout(fetchUrl, { timeout: 7000 })
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
                if (error.name === 'AbortError') {
                    console.error('Request was aborted: Timeout reached');
                    upcomingAppointmentsDiv.textContent = 'Request timed out. Please try again later.';
                } else {
                    console.error('Error fetching appointments:', error);
                    upcomingAppointmentsDiv.textContent = 'Failed to load upcoming appointments.';
                }
            });
    }

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
                <p>Doctor: ${appointment.doctor_first_name} ${appointment.doctor_last_name}</p>
                <p>Specialty: ${appointment.doctor_specialty}</p>
                <p>Date: ${appointment.app_date}</p>
                <p>Time: ${appointment.app_start_time}</p>
                <p>Reason: ${appointment.reason_for_visit}</p>
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

            const postUrl = `https://clinic-website.azurewebsites.net/api/appointments`; // Updated to full URL

            fetchWithTimeout(postUrl, {
                method: 'POST',
                body: JSON.stringify(appointmentData),
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 7000, // 7-second timeout
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
                    if (error.name === 'AbortError') {
                        console.error('Request was aborted: Timeout reached');
                        feedbackDiv.textContent = 'Request timed out. Please try again.';
                        feedbackDiv.style.color = 'red';
                    } else {
                        console.error('Error scheduling appointment:', error);
                        feedbackDiv.textContent = 'Error scheduling appointment.';
                        feedbackDiv.style.color = 'red';
                    }
                });
        });
    }
});
