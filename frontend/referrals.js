document.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem('username');

    if (!username) {
        console.error('Username not found in sessionStorage. Redirecting to login page.');
        window.location.href = '/login.html'; // Redirect to login page if username is missing
        return;
    }

    console.log("Username retrieved from sessionStorage:", username);

    // Fetch referrals for the patient
    fetch(`/api/referrals/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch referrals: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const pendingContainer = document.getElementById('pendingReferrals');
            const processedContainer = document.getElementById('processedReferrals');

            // Clear existing content
            pendingContainer.innerHTML = '';
            processedContainer.innerHTML = '';

            // Populate referral data
            data.forEach(referral => {
                const div = document.createElement('div');
                div.textContent = `
                    Doctor: ${referral.doctor_first_name} ${referral.doctor_last_name}
                    Reason: ${referral.reason_for_referral}
                    Status: ${referral.doc_appr ? 'Approved' : referral.doc_appr === false ? 'Rejected' : 'Pending'}
                `;
                referral.doc_appr === null ? pendingContainer.appendChild(div) : processedContainer.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching referrals:', error));
});
