// addData.js
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    try {
        const response = await fetch('/api/add-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description }),
        });

        if (response.ok) {
            fetchData(); // Refresh the data displayed
            document.getElementById('addForm').reset(); // Clear form
        } else {
            console.error('Error adding data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
