
//////////////THIS IS FOR REGISTER PAGE////////////////////
// Add event listener to the register form
document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();  // Prevent the default form submission (page reload)

    // Gather form data
    const first_name = document.getElementById('first_name').value;
    const last_name = document.getElementById('last_name').value;
    const dob = document.getElementById('dob').value;
    const street_address = document.getElementById('street_address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip_code = document.getElementById('zip_code').value;
    const country = document.getElementById('country').value;
    const phone_number = document.getElementById('phone_number').value;
    const role = document.getElementById('role').value;

    // Validate the form data (basic validation)
    if (!first_name || !last_name || !dob || !phone_number || !role) {
        alert('Please fill out all required fields.');
        return;
    }

    // Combine the address information into a single string
    const fullAddress = `${street_address}, ${city}, ${state} ${zip_code}, ${country}`;
    // Create the form data object
    const formData = {
        first_name,
        last_name,
        dob,
        address: fullAddress,
        phone_number,
        role
    };

    try {
        // Send the form data to the backend
        const response = await fetch('/api/receptionist/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)  // Send the form data as JSON
        });

        const result = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            // Optionally, clear the form or redirect to another page
            document.getElementById('registerForm').reset();
        } else {
            alert(result.message || 'Registration failed.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again later.');
    }
});
///////////////////








///possible update to appointment filtering
/* <label for="choose_doc">Filter by Doctor:</label>
                <select id="choose_doc" name="choose_doc">
                    <option value="" disabled selected>Select Doctor</option>
                <button id="search_doc" onclick="populateDoctors(${appt.employee_ssn})">Search</button> */