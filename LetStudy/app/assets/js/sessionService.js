// sessionService.js

const API_URL = 'https://letstudy.infinityfreeapp.com/session.php';

/**
 * Fetches a session variable from the PHP backend.
 * @param {string} varName - The key of the session variable.
 */
 
async function getSessionValue(varName) {
    const formData = new FormData();
    formData.append('key', varName);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            console.warn(`Session Notice: ${data.error}`);
            return null;
        }

        return data.value;
    } catch (error) {
        console.error('Session Fetch Failure:', error);
        throw error;
    }
}