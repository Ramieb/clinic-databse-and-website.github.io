// Function to fetch the list of doctors from the backend and populate the dropdown
async function fetchDoctors() {
    try {
        const response = await fetch('/api/doctor/getDoctors');
        const doctors = await response.json();

        const dropdown = document.getElementById('doctorDropdown');
        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.employee_ssn;  // Use the employee_ssn as the value for the doctor
            option.textContent = `${doctor.first_name} ${doctor.last_name}`; // Display doctor name
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// Function to fetch appointments for the selected doctor on the selected date
async function fetchAppointments() {
    const doctorSelect = document.getElementById('doctorDropdown');
    const doctorId = doctorSelect.value;
    const appointmentDate = document.getElementById('appointment-date').value;

    // Check if both a doctor and a date are selected
    if (!doctorId || !appointmentDate) {
        alert('Please select both a doctor and a date.');
        return;
    }

    try {
        const response = await fetch(`/api/admin/getAppointments?employee_ssn=${doctorId}&appointmentDate=${appointmentDate}`);
        const appointments = await response.json();
        const doctorName = doctorSelect.options[doctorSelect.selectedIndex].text;
        populateAppointmentsTable(appointments, doctorName);
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

// Function to populate the appointments table with the fetched appointments
function populateAppointmentsTable(appointments, doctorName) {
    const appointmentRows = document.getElementById('appointment-rows');
    appointmentRows.innerHTML = ''; // Clear any previous rows

    // If no appointments found for the selected doctor and date, show a message
    if (appointments.length === 0) {
        appointmentRows.innerHTML = '<tr><td colspan="3">No appointments found.</td></tr>';
        return;
    }

    // Loop through the appointments and create table rows
    appointments.forEach(appointment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${appointment.app_start_time}</td>
            <td>${appointment.patient_first_name} ${appointment.patient_last_name}</td>
            <td>${appointment.reason_for_visit}</td>
        `;
        appointmentRows.appendChild(row);
    });

    // Update the schedule title to reflect the selected doctor
    const scheduleTitle = document.getElementById('schedule-title');
    scheduleTitle.textContent = `Schedule for Doctor: ${doctorName}`;
}

// Call the function to populate the doctor dropdown when the page loads
document.addEventListener('DOMContentLoaded', fetchDoctors);
