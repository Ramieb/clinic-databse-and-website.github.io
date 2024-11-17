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

    // Fetch data on page load
    fetchDoctorPatientHistory();
});
