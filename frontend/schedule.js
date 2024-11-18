// Fetch doctors for the dropdown// Fetch doctors for the dropdown
function fetchDoctors() {
    fetch('http://127.0.0.1:8080/api/doctor/getDoctors') // Correct route to fetch doctors
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById('doctorDropdown');
            data.forEach(doctor => {
                const option = document.createElement('option');
                option.value = doctor.employee_ssn; // Assuming employee_ssn is the unique identifier
                option.textContent = `${doctor.first_name} ${doctor.last_name}`; // Displaying full name
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
    const doctorSelect = document.getElementById('doctorDropdown');
    const doctorId = doctorSelect.value;
    const appointmentDate = document.getElementById('appointment-date').value;

    if (!doctorId || !appointmentDate) {
        alert("Please select both a doctor and a date.");
        return;
    }

    // Use the getAppointments route to fetch appointments
    fetch(`http://127.0.0.1:8080/api/doctor/getAppointments?employee_ssn=${doctorId}&appointmentDate=${appointmentDate}`)
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
            <td>${appointment.patient_first_name} ${appointment.patient_last_name}</td>
            <td>${appointment.reason_for_visit}</td>
        `;
        appointmentRows.appendChild(row);
    });

    const scheduleTitle = document.getElementById('schedule-title');
    scheduleTitle.textContent = `Schedule for Doctor: ${doctorName}`;
}
