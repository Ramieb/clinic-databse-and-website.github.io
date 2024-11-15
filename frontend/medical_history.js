document.addEventListener('DOMContentLoaded', () => {
    // Extract username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    console.log(`Extracted Username: ${username}`); // Log to see the actual value

    if (username) {
        console.log(`Username: ${username}`);
        fetchMedicalHistoryData(username); // Call function to fetch medical data
    } else {
        console.error("Username is missing from the URL.");
    }

    // Collapsible sections functionality
    const coll = document.querySelectorAll('.collapsible');
    coll.forEach(button => {
        button.addEventListener('click', function () {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Logout functionality
    const logoutLink = document.getElementById('logoutLink');
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = '../index.html';
        });
    }
});

// Function to fetch medical history data
function fetchMedicalHistoryData(username) {
    fetch(`/med-history/${username}`)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.json();
        })
        .then(data => {
            displayMedicalData(data); // Call function to handle displaying data
        })
        .catch(error => {
            console.error("Error fetching medical history data:", error);
        });
}

// Function to display the fetched data
function displayMedicalData(data) {
    // Populate data sections
    if (data.medications) {
        document.getElementById('medications').innerHTML = data.medications.join(', ');
    }
    // Continue for allergies, illnesses, surgeries, etc.
}
