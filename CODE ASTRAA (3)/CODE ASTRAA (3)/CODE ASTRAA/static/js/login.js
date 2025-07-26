document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');

    mobileMenuBtn.addEventListener('click', function () {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });

    // Password toggle
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');

    togglePassword.addEventListener('click', function () {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });

    // Form submission
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);

        try {
            const response = await fetch('/', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                alert('Login successful! Redirecting...');
                window.location.href = data.redirect || '/index';
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try ,,,,again');
        }
    });

    // Responsive adjustments
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
});
