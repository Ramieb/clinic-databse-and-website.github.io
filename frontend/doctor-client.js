// Function to fetch all doctors and display them
async function fetchDoctors() {
    try {
        const response = await fetch('/api/getDoctors');
        const doctors = await response.json();

        // Display the data in the console (or update the DOM)
        console.log(doctors);

        // Example of dynamically adding doctors to a table in doctor.html
        const doctorsTable = document.getElementById('doctors-table');
        doctorsTable.innerHTML = ''; // Clear existing rows
        doctors.forEach((doctor) => {
            const row = `<tr>
                <td>${doctor.employee_ssn}</td>
                <td>${doctor.first_name} ${doctor.last_name}</td>
                <td>${doctor.specialty}</td>
                <td>${doctor.salary}</td>
                <td>${doctor.office_id}</td>
            </tr>`;
            doctorsTable.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        alert('Failed to fetch doctors. Please try again.');
    }
}

// Function to fetch appointments for a specific doctor
async function fetchAppointments(employeeSSN) {
    try {
        const response = await fetch(`/api/getAppointments?employee_ssn=${employeeSSN}`);
        const appointments = await response.json();

        console.log(appointments);

        const appointmentsList = document.getElementById('appointments-list');
        appointmentsList.innerHTML = ''; // Clear existing data
        appointments.forEach((appointment) => {
            const item = `<li>
                <strong>Date:</strong> ${appointment.app_date}, 
                <strong>Time:</strong> ${appointment.app_start_time} - ${appointment.app_end_time}, 
                <strong>Reason:</strong> ${appointment.reason_for_visit}, 
                <strong>Patient:</strong> ${appointment.patient_first_name} ${appointment.patient_last_name}
            </li>`;
            appointmentsList.innerHTML += item;
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
        alert('Failed to fetch appointments. Please try again.');
    }
}

// Function to create a referral
async function createReferral(specialist, patientId, referralReason) {
    try {
        const response = await fetch('/api/referrals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ specialist, patientId, referralReason }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Referral created successfully!');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error creating referral:', error);
        alert('Failed to create referral. Please try again.');
    }
}

// Event listener for fetching doctors
document.getElementById('fetch-doctors-btn').addEventListener('click', fetchDoctors);

// Event listener for fetching appointments (example with input field for doctor SSN)
document.getElementById('fetch-appointments-btn').addEventListener('click', () => {
    const doctorSSN = document.getElementById('doctor-ssn-input').value;
    if (doctorSSN) {
        fetchAppointments(doctorSSN);
    } else {
        alert('Please enter a doctor SSN.');
    }
});

// Event listener for creating a referral
document.getElementById('create-referral-btn').addEventListener('click', () => {
    const specialist = document.getElementById('specialist-input').value;
    const patientId = document.getElementById('patient-id-input').value;
    const referralReason = document.getElementById('referral-reason-input').value;

    if (specialist && patientId && referralReason) {
        createReferral(specialist, patientId, referralReason);
    } else {
        alert('Please fill in all the fields.');
    }
});
