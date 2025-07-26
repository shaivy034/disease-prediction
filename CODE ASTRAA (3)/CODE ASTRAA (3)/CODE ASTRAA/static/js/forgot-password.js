document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (consistent with other pages)
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });
    
    // Form submission
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('resetEmail').value;
        
        // Here you would typically send the email to your backend
        console.log('Password reset requested for:', email);
        
        // Show success message
        alert(`Password reset link has been sent to ${email}. Please check your inbox.`);
        
        // Optional: Redirect after submission
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    });
    
    // Responsive adjustments
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
});