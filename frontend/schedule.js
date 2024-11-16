// Fetch doctors for the dropdown
function fetchDoctors() {
    fetch('http://127.0.0.1:8080/api/doctors')
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('doctorDropdown');
            data.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.D_ID; // Assuming D_ID is the doctor's unique identifier
                option.textContent = doctor.doctor_name; // Assuming doctor_name is the name field
                dropdown.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error fetching doctors:', err);
        });
}

// Call the function to populate the dropdown on page load
document.addEventListener('DOMContentLoaded', fetchDoctors);

// Fetch appointments for the selected doctor and date
function fetchAppointments() {
    const doctorSelect = document.getElementById('doctorDropdown'); // Corrected ID to match HTML
    const doctorId = doctorSelect.value;
    const appointmentDate = document.getElementById('appointment-date').value;

    if (!doctorId || !appointmentDate) {
        alert("Please select both a doctor and a date.");
        return;
    }

    fetch(`http://127.0.0.1:8080/api/appointments?doctorId=${doctorId}&appointmentDate=${appointmentDate}`) // Updated URL for fetching appointments
        .then(response => response.json())
        .then(data => {
            const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
            populateAppointmentsTable(data, doctorName);
        })
        .catch(error => {
            console.error('Error fetching appointments:', error);
        });
}

// Populate the appointments table with fetched data
function populateAppointmentsTable(appointments, doctorName) {
    const appointmentRows = document.getElementById('appointment-rows');
    appointmentRows.innerHTML = ''; // Clear any previous rows

    if (appointments.length === 0) {
        appointmentRows.innerHTML = '<tr><td colspan="3">No appointments found.</td></tr>';
        return;
    }

    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.app_start_time}</td>
            <td>${appointment.patient_name}</td>
            <td>${appointment.status}</td>
        `;
        appointmentRows.appendChild(row);
    });

    const scheduleTitle = document.getElementById('schedule-title');
    scheduleTitle.textContent = `Schedule for Doctor: ${doctorName}`;
}