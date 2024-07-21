document.addEventListener('DOMContentLoaded', async () => {
    await loadDocuments();
});

async function loadDocuments() {
    try {
        const response = await fetch('/documents');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Received documents:', result);
        const select = document.getElementById('documentSelect');
        select.innerHTML = '<option value="">Select a document to update</option>';
        if (result.documents && Array.isArray(result.documents)) {
            result.documents.forEach(doc => {
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = doc.source || doc.id;
                select.appendChild(option);
            });
        } else {
            console.error('Unexpected response format:', result);
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        alert('Failed to load documents. Please check the server logs for more information.');
    }
}

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
        await loadDocuments();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the file.');
    }
});

document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const documentId = document.getElementById('documentSelect').value;
    if (!documentId) {
        alert('Please select a document to update');
        return;
    }
    const formData = new FormData(e.target);
    try {
        const response = await fetch(`/update/${documentId}`, {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        alert(result.message);
        await loadDocuments();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while updating the file.');
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
    resultsDiv.innerHTML = '<h3>Search Results</h3>';
    if (results.length === 0) {
        resultsDiv.innerHTML += '<p>No results found.</p>';
        return;
    }
    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');
        resultItem.innerHTML = `
            <h4>Result ${index + 1}</h4>
            <p><strong>Source:</strong> ${result.metadata?.source || 'N/A'}</p>
            <p><strong>Type:</strong> ${result.metadata?.type || 'N/A'}</p>
            <p><strong>Key Info:</strong> ${result.metadata?.key_info || 'N/A'}</p>
            <p><strong>Version:</strong> ${result.metadata?.version || 'N/A'}</p>
            <p><strong>Last Updated:</strong> ${result.metadata?.last_updated || 'N/A'}</p>
        `;
        resultsDiv.appendChild(resultItem);
    });
}

document.getElementById('getInsights').addEventListener('click', async () => {
    try {
        const response = await fetch('/insights');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const result = await response.json();
        console.log('Received insights:', result);
        if (result.insight) {
            displayInsights(result.insight);
        } else {
            alert('No insights available. Please try again later.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch insights. Please check the server logs for more information.');
    }
});

function displayInsights(insight) {
    const insightsDiv = document.getElementById('insights');
    insightsDiv.innerHTML = `<h3>Latest Insight</h3><p>${insight}</p>`;
}

document.getElementById('getPatterns').addEventListener('click', async () => {
    try {
        const response = await fetch('/patterns');
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const result = await response.json();
        console.log('Received patterns:', result);
        displayPatterns(result.pattern);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to fetch patterns. Please check the server logs for more information.');
    }
});


function displayPatterns(pattern) {
    const patternsDiv = document.getElementById('patterns');
    patternsDiv.innerHTML = `<h3>Latest Pattern</h3><p>${pattern}</p>`;
}