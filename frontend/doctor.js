document.addEventListener('DOMContentLoaded', () => {
    // Element references
    const historyTableBody = document.getElementById('historyTableBody');
    const referralForm = document.getElementById('referralForm');
    const referralMessage = document.getElementById('referralMessage');
    const specialistDropdown = document.getElementById('specialist');
    const referralsTableBody = document.getElementById('referralsTableBody');
    const doctorId = localStorage.getItem('doctorId'); // Assuming doctorId is stored in localStorage

    /**
     * Fetch and display doctor-patient history
     */
    async function fetchDoctorPatientHistory() {
        try {
            const response = await fetch('/api/doctor/doctor_patient_history');
            const data = await response.json();

            if (data.success) {
                historyTableBody.innerHTML = ''; // Clear the table before adding rows
                data.data.forEach((record) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${record.doctor_id}</td>
                        <td>${record.patient_id}</td>
                        <td>${record.visit_date}</td>
                        <td>${record.diagnosis}</td>
                        <td>${record.treatment}</td>
                    `;
                    historyTableBody.appendChild(row);
                });
            } else {
                alert('Failed to fetch doctor-patient history.');
            }
        } catch (error) {
            console.error('Error fetching doctor-patient history:', error);
            alert('An error occurred while fetching data.');
        }
    }

    /**
     * Fetch and populate the specialist dropdown
     */
    async function fetchSpecialists() {
        try {
            const response = await fetch('/api/doctor/getDoctors');
            const specialists = await response.json();

            specialists.forEach((specialist) => {
                const option = document.createElement('option');
                option.value = specialist.employee_ssn; // Use relevant ID
                option.textContent = `${specialist.first_name} ${specialist.last_name} - ${specialist.specialty}`;
                specialistDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching specialists:', error);
        }
    }

    /**
     * Handle referral creation
     */
    async function createReferral(event) {
        event.preventDefault();

        const specialist = specialistDropdown.value;
        const patientId = document.getElementById('patientId').value;
        const referralReason = document.getElementById('referralReason').value;

        try {
            const response = await fetch('/api/doctor/referrals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ specialist, patientId, referralReason }),
            });

            const result = await response.json();

            if (response.ok) {
                referralMessage.textContent = 'Referral created successfully!';
                referralMessage.style.color = 'green';
                referralForm.reset();
            } else {
                referralMessage.textContent = `Error: ${result.message}`;
                referralMessage.style.color = 'red';
            }
        } catch (error) {
            console.error('Error creating referral:', error);
            referralMessage.textContent = 'An unexpected error occurred.';
            referralMessage.style.color = 'red';
        }
    }

    /**
     * Fetch and display referrals for the logged-in doctor
     */
    async function fetchReferrals() {
        try {
            const response = await fetch(`/api/doctor/getReferrals?specialist=${doctorId}`);
            const referrals = await response.json();

            referralsTableBody.innerHTML = ''; // Clear previous data
            referrals.forEach((referral) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${referral.patient_first_name} ${referral.patient_last_name}</td>
                    <td>${referral.reason_for_referral}</td>
                    <td>${referral.ref_date}</td>
                    <td>${referral.status === null ? 'Pending' : referral.status ? 'Approved' : 'Rejected'}</td>
                    <td>
                        ${referral.status === null
                            ? `<button onclick="updateReferralStatus(${referral.referral_id}, 'Approved')">Approve</button>
                               <button onclick="updateReferralStatus(${referral.referral_id}, 'Denied')">Deny</button>`
                            : ''}
                    </td>
                `;
                referralsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching referrals:', error);
        }
    }

    /**
     * Update the status of a referral
     */
    window.updateReferralStatus = async function (referralId, status) {
        try {
            const response = await fetch('/api/doctor/updateReferralStatus', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ referralId, status }),
            });
    
            if (response.ok) {
                alert(`Referral ${status} successfully!`);
                fetchReferrals(); // Refresh the table
            } else {
                const result = await response.json();
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error updating referral status:', error);
        }
    };    

    /**
     * Fetch and display upcoming appointments for the logged-in doctor
     */
    async function fetchUpcomingAppointments() {
        try {
            const response = await fetch(`/api/doctor/getAppointments?doctorId=${doctorId}`);
            const data = await response.json();
            const appointmentSection = document.getElementById('upcomingAppointments');

            appointmentSection.innerHTML = ''; // Clear previous data
            data.forEach((appointment) => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <p><strong>Date:</strong> ${appointment.app_date}</p>
                    <p><strong>Time:</strong> ${appointment.app_start_time}</p>
                    <p><strong>Patient:</strong> ${appointment.patient_name}</p>
                    <hr>
                `;
                appointmentSection.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    }

    // Event listeners and initial function calls
    referralForm.addEventListener('submit', createReferral);
    fetchSpecialists();
    fetchDoctorPatientHistory();
    fetchReferrals();
    fetchUpcomingAppointments();
});
