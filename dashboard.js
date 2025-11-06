// dashboard.js

// --- CONFIGURATION ---
const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycby9LRzfLQ-2LbjKpKahfEgvYhqC6dRtag9JYuNFoP8YnlUsdpCiGb_9NCLCvrThwnuX/exec'; 
const API_SECRET_KEY = 'MySuperSecretKeyForAutoPostr2025!'; 
const WHATSAPP_NUMBER = '+2349033314886';

// --- UTILITY FUNCTIONS ---

async function callApi(route, payload) {
    const url = `${GAS_WEBAPP_URL}?key=${API_SECRET_KEY}`;
    const dataToSend = { ...payload, route: route };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8',
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

function displayMessage(message, type = 'success') {
    const messageArea = document.getElementById('message-area');
    messageArea.textContent = message;
    messageArea.className = type;
    messageArea.classList.remove('hidden');
    setTimeout(() => {
        messageArea.classList.add('hidden');
    }, 5000);
}

function clearForm(formId) {
    document.getElementById(formId).reset();
}

// --- FORM HANDLERS ---

document.getElementById('connect-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('connect-email').value.toLowerCase();
    const platform = document.getElementById('platform-select').value;
    const token = document.getElementById('platform-token').value;
    const id = document.getElementById('platform-id').value;
    const payload = { email, platform, token, id };
    const result = await callApi('connect', payload);
    if (result.success) {
        displayMessage(`✅ ${result.message}`, 'success');
        clearForm('connect-form');
    } else {
        displayMessage(`❌ ${result.message}`, 'error');
    }
});

document.getElementById('schedule-form').addEventListener('submit', async (e) => {
    alert('Submitting post. Please wait for confirmation.');
    e.preventDefault();
    const email = document.getElementById('schedule-email').value.toLowerCase();
    const platform = document.getElementById('schedule-platform').value;
    const message = document.getElementById('schedule-message').value;
    const media = document.getElementById('schedule-media').value;
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

document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
});

// --- Initial Load / Status Check ---
document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('userEmail');
    if (!savedEmail) {
        window.location.href = 'login.html';
    } else {
        showDashboard(savedEmail);
    }
});

async function showDashboard(email) {
    document.getElementById('status-email').textContent = email;
    document.getElementById('connect-email').value = email;
    document.getElementById('schedule-email').value = email;

    const statsResult = await callApi('getStats', { email: email });
    if (statsResult.success && statsResult.user) {
        const user = statsResult.user;
        document.getElementById('status-plan').textContent = user.plan ? user.plan.toUpperCase() : 'N/A';
        document.getElementById('status-expiry').textContent = user.trial_end ? new Date(user.trial_end).toLocaleDateString() : 'N/A';
        
        const tableBody = document.getElementById('posts-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';
        
        if (statsResult.posts && statsResult.posts.length > 0) {
            statsResult.posts.forEach(post => {
                let row = tableBody.insertRow();
                row.insertCell().textContent = post.platform;
                row.insertCell().textContent = new Date(post.schedule).toLocaleString();
                row.insertCell().textContent = post.status ? post.status.toUpperCase() : 'N/A';
                row.className = post.status && post.status.toLowerCase() === 'pending' ? 'note' : '';
            });
        }
    } else if (statsResult.message.includes('not found')) {
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    }
}
