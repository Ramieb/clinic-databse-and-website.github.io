document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('addPatientForm'); // Change form ID to match patient form
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Form not found!');
    }
});

async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    const form = event.target; // The form element
    const submitButton = form.querySelector('button[type="submit"]');

    const firstName = document.getElementById('patient-first-name').value.trim();
    const lastName = document.getElementById('patient-last-name').value.trim();
    const phoneNumber = document.getElementById('patient-phone-number').value.trim();
    const address = document.getElementById('patient-address').value.trim();
    const dob = document.getElementById('patient-dob').value.trim();
   
    // Client-side Validation
    if (!firstName || !lastName || !phoneNumber || !address || !dob ) {
        alert('Please fill in all fields.');
        return;
    }

    if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumber)) {
        alert('Phone number must be in the format ###-###-####');
        return;
    }


    const patientData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        ssn: ssn,
        address: address,
        dob: dob,
        emergency_contact: emergencyContact
    };

    try {
        // Disable submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        const response = await fetch('/patientActions/add', {  // Adjust endpoint to handle patient data
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(patientData)
        });

        if (response.ok) {
            alert('Patient added successfully');
            console.log('Patient added successfully');
            form.reset(); // Reset the form
            showSuccessMessage(); // Display success message
        } else {
            const errorData = await response.json();
            console.error('Error adding patient:', errorData.message || response.statusText);
            alert(`Failed to add patient: ${errorData.message || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add patient');
    } finally {
        // Re-enable the submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}

// Function to display a success message
function showSuccessMessage() {
    const successMessage = document.createElement('p');
    successMessage.textContent = 'Patient added successfully';
    successMessage.style.color = 'green';
    successMessage.style.fontWeight = 'bold';
    successMessage.style.marginTop = '20px';

    const form = document.getElementById('addPatientForm');
    form.parentElement.appendChild(successMessage);

    // Remove the message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}
