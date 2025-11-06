document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const GAS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycby9LRzfLQ-2LbjKpKahfEgvYhqC6dRtag9JYuNFoP8YnlUsdpCiGb_9NCLCvrThwnuX/exec';
    const API_SECRET_KEY = 'MySuperSecretKeyForAutoPostr2025!';

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
            return { success: false, message: 'Failed to communicate with the backend server.' };
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const email = document.getElementById('email').value.toLowerCase();

            const result = await callApi('getStats', { email: email });

            if (result.success && result.user) {
                localStorage.setItem('userEmail', email);
                window.location.href = 'dashboard.html';
            } else {
                alert('Login failed. Please check your email or sign up.');
            }
        });
    }
});
