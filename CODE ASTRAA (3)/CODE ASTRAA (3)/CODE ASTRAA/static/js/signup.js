document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });
    
    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPassword.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
    
    // Form submission
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        const termsChecked = document.getElementById('terms').checked;
    
        // Validation: Check if passwords match
        if (password !== confirmPass) {
            alert('Passwords do not match!');
            return;
        }
    
        // Validation: Check if terms are accepted
        if (!termsChecked) {
            alert('You must agree to the Terms of Service and Privacy Policy');
            return;
        }
    
        // Confirmation dialog
        const userConfirmed = confirm("Do you want to proceed with creating the account?");
        if (!userConfirmed) {
            return;
        }
    
        // Send data to the server if confirmed
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                fullName: fullName,
                email: email,
                password: password,
                confirmPassword: confirmPass,
                terms: termsChecked ? 'on' : ''
            })
        })
        .then(response => {
            if (response.ok) {
                alert('Account created successfully! Redirecting to dashboard...');
                window.location.href = 'login.html';
            } else {
                alert('Signup failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again later.');
        });
    
        // Debug log
        console.log('Signup attempt:', { fullName, email, password });
    });
    
    
    // Responsive adjustments
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
});