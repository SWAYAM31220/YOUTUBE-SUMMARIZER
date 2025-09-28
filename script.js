// API configuration
const API_URL = 'https://your-render-api.onrender.com';

// DOM elements
const form = document.getElementById('summarize-form');
const urlInput = document.getElementById('video-url');
const summaryType = document.getElementById('summary-type');
const status = document.getElementById('status');
const output = document.getElementById('output');

// YouTube URL validation
function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return pattern.test(url);
}

// Show status message
function showStatus(message, isError = false) {
    status.textContent = message;
    status.className = `status show ${isError ? 'error' : ''}`;
}

// Show output
function showOutput(summary) {
    output.textContent = summary;
    output.className = 'output-section show';
}

// Poll job status
async function pollJobStatus(jobId) {
    try {
        const response = await fetch(`${API_URL}/status/${jobId}`);
        const data = await response.json();

        switch (data.status) {
            case 'completed':
                showStatus('Summary generated!');
                showOutput(data.summary);
                return true;
            case 'failed':
                showStatus('Failed to generate summary. Please try again.', true);
                return true;
            case 'transcribing':
                showStatus('Transcribing video...');
                break;
            case 'summarizing':
                showStatus('Generating summary...');
                break;
            default:
                showStatus('Processing...');
        }

        // Continue polling
        setTimeout(() => pollJobStatus(jobId), 2000);
        return false;

    } catch (error) {
        console.error('Error polling status:', error);
        showStatus('Error checking status. Please try again.', true);
        return true;
    }
}

// Handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const videoUrl = urlInput.value.trim();
    const type = summaryType.value;

    // Validate URL
    if (!isValidYouTubeUrl(videoUrl)) {
        showStatus('Please enter a valid YouTube URL', true);
        return;
    }

    // Clear previous output
    output.className = 'output-section';
    showStatus('Submitting request...');

    try {
        const response = await fetch(`${API_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: videoUrl,
                summary_type: type
            })
        });

        const data = await response.json();

        if (response.ok) {
            showStatus('Request accepted. Processing video...');
            pollJobStatus(data.job_id);
        } else {
            showStatus(`Error: ${data.detail || 'Failed to submit request'}`, true);
        }

    } catch (error) {
        console.error('Error submitting request:', error);
        showStatus('Error connecting to server. Please try again.', true);
    }
});