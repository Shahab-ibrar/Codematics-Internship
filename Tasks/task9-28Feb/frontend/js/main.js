// Dark mode handling
document.addEventListener('DOMContentLoaded', () => {
    // Route Guard (Protecting dashboard pages)
    const isLoginPage = window.location.pathname.endsWith('login.html');
    const token = localStorage.getItem('token');
    
    if (!token && !isLoginPage) {
        // Not logged in and trying to access a protected page
        window.location.href = 'login.html';
        return; // Stop execution
    }

    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    // Load saved theme
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            if (html.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Set User Name in Header
    const userNameDisplay = document.getElementById('headerUserName');
    if (userNameDisplay && token) {
        userNameDisplay.textContent = localStorage.getItem('username') || 'Admin';
    }

    // Setup Logout Button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });
    }
});

// Utility to show toasts
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 flex items-center px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-transform duration-300 transform translate-y-full glass-card`;
    
    if(type === 'success') {
        toast.innerHTML = `<i class="fa-solid fa-check-circle mr-2 text-green-400"></i> <span class="text-slate-800 dark:text-white">${message}</span>`;
    } else {
        toast.innerHTML = `<i class="fa-solid fa-exclamation-circle mr-2 text-red-500"></i> <span class="text-slate-800 dark:text-white">${message}</span>`;
    }

    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.remove('translate-y-full'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-full');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.showToast = showToast;
