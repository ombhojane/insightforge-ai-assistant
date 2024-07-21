document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the file.');
    }
});

document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/search', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            displayResults(result.results);
        } else {
            throw new Error(result.message || 'An error occurred while searching.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <h3>Result ${index + 1}</h3>
            <p>ID: ${result.id || 'N/A'}</p>
            <p>Distance: ${result.distance || 'N/A'}</p>
            <p>Source: ${result.metadata?.source || 'N/A'}</p>
            <p>Type: ${result.metadata?.type || 'N/A'}</p>
            <p>Key Info: ${result.metadata?.key_info || 'N/A'}</p>
        `;
        resultsDiv.appendChild(resultItem);
    });
}