// script.js

// --- CONFIGURATION ---
// PASTE THE DEPLOYED GOOGLE APPS SCRIPT WEB APP URL HERE (From Phase 3, Step 5)
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycby9LRzfLQ-2LbjKpKahfEgvYhqC6dRtag9JYuNFoP8YnlUsdpCiGb_9NCLCvrThwnuX/exec'; 
// MUST match the SECRET_API_KEY in Config.gs (From Phase 2, Step 3)
const API_SECRET_KEY = 'MySuperSecretKeyForAutoPostr2025!'; 
// Your business WhatsApp number for the 'Upgrade Now' button (STEP 7)
const WHATSAPP_NUMBER = '+2349033314886'; // e.g., '15551234567'

// --- UTILITY FUNCTIONS ---

/**
 * Sends data to the Apps Script Web App API.
 * @param {string} route - The specific backend function to call (e.g., 'register').
 * @param {Object} payload - The data object to send.
 * @returns {Promise<Object>} The JSON response from the Apps Script backend.
 */
async function callApi(route, payload) {
    const url = `${GAS_WEBAPP_URL}?key=${API_SECRET_KEY}`;
    
    // Merge the route into the payload before stringifying
    const dataToSend = { ...payload, route: route };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Required for GAS doPost
        },
        body: JSON.stringify(dataToSend)
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Call Error:', error);
        displayMessage(`Connection Error: ${error.message}. Check console for details.`, 'error');
        return { success: false, message: 'Failed to communicate with the backend server.' };
    }
}

/**
 * Displays a feedback message to the user.
 */
function displayMessage(message, type = 'success') {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
    messageArea.className = type; // 'success' or 'error'
    messageArea.classList.remove('hidden');

    setTimeout(() => {
        messageArea.classList.add('hidden');
    }, 5000); // Hide after 5 seconds
}

/**
 * Clears form inputs after successful submission.
 * @param {string} formId - The ID of the form to clear.
 */
function clearForm(formId) {
    document.getElementById(formId).reset();
}

// --- FORM HANDLERS ---

// STEP 1: Handle User Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.toLowerCase();
    const name = document.getElementById('signup-name').value;

    const payload = { email, name };
    const result = await callApi('register', payload);

    if (result.success) {
        displayMessage(`✅ ${result.message}`, 'success');
        
        // Populate the status email and hide signup form
        document.getElementById('status-email').textContent = email;
        document.getElementById('signup-section').classList.add('hidden');
        document.getElementById('connect-section').classList.remove('hidden');
        document.getElementById('schedule-section').classList.remove('hidden');
        document.getElementById('status-section').classList.remove('hidden');
        
        // Automatically populate email fields in other sections
        document.getElementById('connect-email').value = email;
        document.getElementById('schedule-email').value = email;

    } else {
        displayMessage(`❌ ${result.message}`, 'error');
    }
});

// STEP 2: Handle Token Connection
document.getElementById('connect-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('connect-email').value.toLowerCase();
    const platform = document.getElementById('platform-select').value;
    const token = document.getElementById('platform-token').value;
    const id = document.getElementById('platform-id').value; // Chat ID or Page ID

    const payload = { email, platform, token, id };
    const result = await callApi('connect', payload);

    if (result.success) {
        displayMessage(`✅ ${result.message}`, 'success');
        clearForm('connect-form');
    } else {
        displayMessage(`❌ ${result.message}`, 'error');
    }
});

// STEP 3: Handle Post Scheduling
document.getElementById('schedule-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('schedule-email').value.toLowerCase();
    const platform = document.getElementById('schedule-platform').value;
    const message = document.getElementById('schedule-message').value;
    const media = document.getElementById('schedule-media').value;
    
    // Format the schedule time to a standard Apps Script can easily parse
    const schedule = new Date(document.getElementById('schedule-time').value).toISOString();

    const payload = { email, platform, message, media, schedule };
    const result = await callApi('addPost', payload);

    if (result.success) {
        displayMessage(`✅ ${result.message}`, 'success');
        clearForm('schedule-form');
    } else {
        displayMessage(`❌ ${result.message}`, 'error');
    }
});


// STEP 7: Handle Upgrade Button (Opens WhatsApp Chat)
document.getElementById('upgrade-button').addEventListener('click', () => {
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I would like to upgrade my AutoPostr account. My email is ${document.getElementById('status-email').textContent}.`;
    window.open(whatsappLink, '_blank');
});

// --- Initial Load / Status Check ---
document.addEventListener('DOMContentLoaded', () => {
    // Prompt user for email to check status if they don't have a session/login
    const savedEmail = localStorage.getItem('userEmail');
    if (!savedEmail) {
        // If no email is saved, show only the signup section
        document.getElementById('signup-section').classList.remove('hidden');
    } else {
        // If email is found, attempt to fetch stats and show dashboard
        showDashboard(savedEmail);
    }
});

/**
 * Sets up the dashboard UI for an existing user.
 * @param {string} email - The user's email.
 */
async function showDashboard(email) {
    document.getElementById('signup-section').classList.add('hidden');
    document.getElementById('connect-section').classList.remove('hidden');
    document.getElementById('schedule-section').classList.remove('hidden');
    document.getElementById('status-section').classList.remove('hidden');
    
    document.getElementById('status-email').textContent = email;
    document.getElementById('connect-email').value = email;
    document.getElementById('schedule-email').value = email;
    
    localStorage.setItem('userEmail', email); // Save for next visit

    // Fetch user stats (plan, expiry, post history)
    const statsResult = await callApi('getStats', { email: email });
    if (statsResult.success && statsResult.user) {
        const user = statsResult.user;
        document.getElementById('status-plan').textContent = user.plan ? user.plan.toString().toUpperCase() : 'N/A';
        // Prefer paid/subscription expiry if present
        const paidExpiry = user && (user.paid_end || user.paid_until || user.subscription_end || user.subscription_expires || user.expires_on);
        const expiryVal = paidExpiry || (user && user.trial_end) || '';
        document.getElementById('status-expiry').textContent = expiryVal ? new Date(expiryVal).toLocaleDateString() : 'N/A';
        
        // Display post history (assuming statsResult.posts is an array of post objects)
        const tableBody = document.getElementById('posts-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear previous data
        
        if (statsResult.posts && statsResult.posts.length > 0) {
            statsResult.posts.forEach(post => {
                let row = tableBody.insertRow();
                row.insertCell().textContent = post.platform;
                row.insertCell().textContent = new Date(post.schedule).toLocaleString();
                row.insertCell().textContent = post.status.toUpperCase();
                row.className = post.status.toLowerCase() === 'pending' ? 'note' : '';
            });
        }
    } else if (statsResult.message.includes('not found')) {
        // If user not found (e.g., deleted local storage), show signup again
        document.getElementById('signup-section').classList.remove('hidden');
    }
}
