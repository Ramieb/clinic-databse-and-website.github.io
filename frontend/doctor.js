document.addEventListener('DOMContentLoaded', () => {
    const doctorId = sessionStorage.getItem('doctorId') || '1';

    // Load initial doctor data
    fetchDoctorData(doctorId);
    fetchPatients();

    // Event listeners for toggle buttons
    const appointmentsButton = document.querySelector('button[data-section="appointments-section"]');
    appointmentsButton.addEventListener('click', () => toggleSection('appointments-section', doctorId));

    // Event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', () => {
        window.location.href = '../index.html';
    });
});

function toggleSection(sectionId, doctorId) {
    const section = document.getElementById(sectionId);

    // Toggle visibility
    if (section.style.display === 'none' || section.style.display === '') {
        section.style.display = 'block'; // Show the section
        fetchAppointments(doctorId);     // Fetch and display appointments
    } else {
        section.style.display = 'none';  // Hide the section
    }
}

async function fetchAppointments(doctorId) {
    try {
        const response = await fetch(`/doctorActions/appointments/${doctorId}`);
        const appointments = await response.json();
        const tableBody = document.getElementById('appointments-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear any existing rows

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.patient_id}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>${appointment.reason}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading appointments:", error);
    }
}


async function fetchDoctorData(doctorId) {
    try {
        const response = await fetch(`/doctorActions/doctors`);
        const doctors = await response.json();
        const tableBody = document.getElementById('doctors-table').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear existing rows
        
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.dataset.doctorId = doctor.id; // Store doctor ID for front-end-only deletion
            
            row.innerHTML = `
                <td>${doctor.firstName}</td>
                <td>${doctor.lastName}</td>
                <td>${doctor.specialty}</td>
                <td>${doctor.salary}</td>
                <td>${doctor.officeId}</td>
                <td>
                    <button onclick="showAppointments(${doctor.id})" class="appointments-btn">Appointments</button>
                    <button onclick="editDoctor(${doctor.id})" class="edit-btn">Edit</button>
                    <button onclick="deleteDoctor(${doctor.id})" class="delete-btn">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading doctors:", error);
    }
}

function showAppointments(doctorId) {
    // Hide the section first if it's open
    const appointmentsSection = document.getElementById('appointments-section');
    if (appointmentsSection.style.display === 'block') {
        appointmentsSection.style.display = 'none';
    }
    
    // Now toggle and fetch appointments for the new doctor
    toggleSection('appointments-section', doctorId);
}