///////////THIS IS FOR BILLING PAGE//////////////////////////////
function paybill(patient_id, charge_date) {
    // You can add functionality to edit an appointment here
    alert('Editing payment for Patient ID: ' + patient_id + " for charge on " + charge_date);
    // For example, you might redirect to an edit page or open a modal to edit the details
    // window.location.href = `/edit-appointment/${patientId}`;
}

async function submitPatientID(){
    const patientID = document.getElementById("lookup_id").value;

    if (!patientID) {
        alert('Please enter patient ID before entering');
        return;
    }

    // Prepare data to send to the backend
    const formData = {
        patient_id: patientID,
    };

    try {
        // Send the data to the backend to get available appointments
        const response = await fetch('/api/receptionist/billing_id_lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);

        const resultsContainer = document.getElementById('billing_output');
        resultsContainer.innerHTML = ''; // Clear the previous content

        // If no data is returned, show a message
        if (data.length === 0) {
            resultsContainer.innerHTML = `<h2>No outstanding bills found for patient ID: ${patientID}</h2>`;
        } else {
            // Handle the response (loop through the data)
            resultsContainer.innerHTML = `
                <h2>All Outstanding Bills</h2>
                <ul>
                    ${data.map(bill => `
                        <li>
                            Patient ID: ${bill.patient_id} ${bill.first_name} ${bill.last_name}, 
                            Charge For: ${bill.charge_for}, 
                            Total Charged: ${bill.total_charged}, 
                            Total Paid: ${bill.total_paid}, 
                            Charge Date: ${bill.charge_date}

                            <button class="payment_button" onclick="payBill('${bill.patient_id}', '${bill.charge_date}')">Make a Payment</button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('billing_output').innerHTML = `<h2>Error checking bills. Please try again later.</h2>`;
    }
}

async function submitPatientAlt(){
    const patient_last_name = document.getElementById("last_name_bill").value;
    const patientDOB = document.getElementById("dob_bill").value;

    if (!patient_last_name || !patientDOB) {
        alert('Please enter both last name and DOB');
        return;
    }

    // Prepare data to send to the backend
    const formData = {
        patient_lastName: patient_last_name,
        patientDateOfBirth: patientDOB
    };

    try {
        // Send the data to the backend to get available appointments
        const response = await fetch('/api/receptionist/billing_alt_lookup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log(data);

        const resultsContainer = document.getElementById('billing_output');
        resultsContainer.innerHTML = ''; // Clear the previous content

        // If no data is returned, show a message
        if (data.length === 0) {
            resultsContainer.innerHTML = `<h2>No outstanding bills found for patient: ${patient_last_name} with DOB: ${patientDOB}</h2>`;
        } else {
            // Handle the response (loop through the data)
            resultsContainer.innerHTML = `
                <h2>All Outstanding Bills</h2>
                <ul>
                    ${data.map(bill => `
                        <li>
                            Patient ID: ${bill.patient_id} ${bill.first_name} ${bill.last_name}, 
                            Charge For: ${bill.charge_for}, 
                            Total Charged: ${bill.total_charged}, 
                            Total Paid: ${bill.total_paid}, 
                            Charge Date: ${bill.charge_date}

                            <button class="payment_button" onclick="payBill('${bill.patient_id}', '${bill.charge_date}')">Make a Payment</button>
                        </li>
                    `).join('')}
                </ul>
            `;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('billing_output').innerHTML = `<h2>Error checking bills. Please try again later.</h2>`;
    }

}
document.getElementById('find_patient_id').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitPatientID();  // Call the submitForm function
});
document.getElementById('find_patient_alt').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the default action (form submission)
    
    submitPatientAlt();  // Call the submitForm function
});
///////////////////////