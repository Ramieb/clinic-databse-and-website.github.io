document.addEventListener('DOMContentLoaded', () => {
    const referralRequestForm = document.getElementById('referralRequestForm');
    const upcomingAppointmentsDiv = document.getElementById('appointmentContent');
    const referralFeedbackDiv = document.getElementById('referralFeedback');
    const scheduleAppointmentSection = document.getElementById('schedule-appointment');
    const referralsTableBody = document.getElementById('patientReferralsTableBody');

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

        // Fetch patient referrals
        fetchPatientReferrals(username);
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
        const fetchUrl = `https://clinic-website.azurewebsites.net/api/appointments/${username}`;
        upcomingAppointmentsDiv.textContent = 'Loading upcoming appointments...';

        fetchWithTimeout(fetchUrl, { timeout: 7000 })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                displayAppointments(data);
            })
            .catch((error) => {
                console.error('Error fetching appointments:', error);
                if (error.message.includes('No valid referral')) {
                    upcomingAppointmentsDiv.textContent = 'You need an approved referral to schedule an appointment.';
                } else {
                    upcomingAppointmentsDiv.textContent = 'Failed to load upcoming appointments. Please try again.';
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

    // Fetch patient referrals
    async function fetchPatientReferrals(patientId) {
        try {
            const response = await fetch(`/api/patient/getReferrals?patientId=${patientId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch referrals: ${response.statusText}`);
            }

            const referrals = await response.json();
            referralsTableBody.innerHTML = ''; // Clear the table before adding new rows

            referrals.forEach((referral) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${referral.reason_for_referral}</td>
                    <td>${referral.doc_appr === null ? 'Pending' : referral.doc_appr ? 'Approved' : 'Rejected'}</td>
                    <td>${referral.response_date || 'Pending approval'}</td>
                `;
                referralsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching patient referrals:', error);
            referralFeedbackDiv.textContent = 'Failed to load referrals. Please try again.';
            referralFeedbackDiv.style.color = 'red';
        }
    }

    // Referral request form submission handler
    if (referralRequestForm) {
        referralRequestForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(referralRequestForm);
            const referralData = Object.fromEntries(formData);

            console.log('Submitting referral request data:', referralData); // Debug log

            try {
                const result = await addAppointment(referralData);

                if (result.success) {
                    referralFeedbackDiv.textContent = 'Referral request sent successfully!';
                    referralFeedbackDiv.style.color = 'green';
                    referralRequestForm.reset();
                } else {
                    referralFeedbackDiv.textContent = `Error: ${result.error || 'Unknown error'}`;
                    referralFeedbackDiv.style.color = 'red';
                }
            } catch (error) {
                referralFeedbackDiv.textContent = error.message || 'Error sending referral request.';
                referralFeedbackDiv.style.color = 'red';
            }
        });
    }
});
