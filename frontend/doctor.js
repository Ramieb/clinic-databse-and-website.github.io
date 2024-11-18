document.addEventListener('DOMContentLoaded', () => {
    const historyTableBody = document.getElementById('historyTableBody');

    async function fetchDoctorPatientHistory() {
        try {
            const response = await fetch('api/doctor/doctor_patient_history');
            const data = await response.json();

            if (data.success) {
                historyTableBody.innerHTML = ''; // Clear the table before adding rows

                data.data.forEach((record) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                         <td>${record.patient_id}</td>
                        <td>${record.patient_first_name} ${record.patient_last_name}</td>
                        <td>${record.app_date}</td>
                        <td>${record.reason_for_visit}</td>
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
const referralForm = document.getElementById('referralForm');
    const referralMessage = document.getElementById('referralMessage');
    const specialistDropdown = document.getElementById('specialist');

    // Fetch available specialists and populate the dropdown
    async function fetchSpecialists() {
        try {
            const response = await fetch('/api/doctor/getDoctors'); // Assuming this endpoint lists doctors
            const specialists = await response.json();

            specialists.forEach((specialist) => {
                const option = document.createElement('option');
                option.value = specialist.employee_ssn; // or relevant ID
                option.textContent = `${specialist.first_name} ${specialist.last_name} - ${specialist.specialty}`;
                specialistDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching specialists:', error);
        }
    }

    fetchSpecialists();

    // Handle referral creation
    referralForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const specialist = specialistDropdown.value;
        const patientId = document.getElementById('patientId').value;
        const referralReason = document.getElementById('referralReason').value;

        try {
            const response = await fetch('/api/doctor/referrals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    specialist,
                    patientId,
                    referralReason,
                }),
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
    });
    // Fetch data on page load
    fetchDoctorPatientHistory();
    async function fetchReferrals() {
        try {
            const doctorId = '<doctor_id>'; // Replace with dynamic doctor ID
const response = await fetch(`/api/doctor/doctor_patient_history?employee_ssn=${doctorId}`);
<doctor_id>');
            const referrals = await response.json();
    
            const referralsTableBody = document.getElementById('referralsTableBody');
            referralsTableBody.innerHTML = ''; // Clear previous data
    
            referrals.forEach((referral) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${referral.patient_first_name} ${referral.patient_last_name}</td>
                    <td>${referral.reason_for_referral}</td>
                    <td>${referral.ref_date}</td>
                    <td>${referral.status}</td>
                    <td>
                        <button onclick="updateReferralStatus(${referral.referral_id}, 'Approved')">Approve</button>
                        <button onclick="updateReferralStatus(${referral.referral_id}, 'Denied')">Deny</button>
                    </td>
                `;
                referralsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching referrals:', error);
        }
    }
    
    async function updateReferralStatus(referralId, status) {
        try {
            const response = await fetch('/api/doctor/updateReferralStatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
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
    }
    
    // Fetch referrals on page load
    fetchReferrals();    
});
