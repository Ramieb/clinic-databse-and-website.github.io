document.addEventListener('DOMContentLoaded', () => {
    const historyTableBody = document.getElementById('historyTableBody');

    async function fetchDoctorPatientHistory() {
        try {
            const response = await fetch('http://localhost:8080/api/doctor/doctor_patient_history');
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
            const response = await fetch('/api/referrals', {
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
});
