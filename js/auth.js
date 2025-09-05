// Authentication functionality for food ordering app
console.log('Auth module loaded');

// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const successModal = document.getElementById('successModal');

// form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

function showSuccessModal() {
    successModal.style.display = 'flex';
}

function closeModal() {
    successModal.style.display = 'none';
    // Redirect to dashboard after closing modal
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

// Make closeModal global so HTML onclick can access it
window.closeModal = closeModal;

// Login form submission handler
function handleLogin(event) {
    event.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    // Reset previous errors
    hideError(emailError);
    hideError(passwordError);
    
    let isValid = true;
    
    // Validate email
    if (!email) {
        showError(emailError, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError(emailError, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError(passwordError, 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showError(passwordError, 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // If validation passes, simulate login
    if (isValid) {
        // Get the submit button
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnSpinner = submitBtn.querySelector('.btn-spinner');
        
        // Show loading state
        submitBtn.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'block';
        
        // Simulate API call delay
        setTimeout(() => {
            // Reset button state
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'block';
            if (btnSpinner) btnSpinner.style.display = 'none';
            
            // Check credentials (demo - in real app this would be API call)
            if (email === 'login@gmail.com' && password === 'Password') {
                // Save login state
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', email);
                
                // Show success modal
                showSuccessModal();
            } else {
                // Show error for invalid credentials
                showError(passwordError, 'Invalid email or password');
            }
        }, 1500); // 1.5 second delay to show loading
    }
}

// Event listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

// Real-time validation
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        if (email && !validateEmail(email)) {
            showError(emailError, 'Please enter a valid email address');
        } else {
            hideError(emailError);
        }
    });
}

if (passwordInput) {
    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value.trim();
        if (password && !validatePassword(password)) {
            showError(passwordError, 'Password must be at least 6 characters');
        } else {
            hideError(passwordError);
        }
    });
}

// Check if user is already logged in
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // If on login page and already logged in, redirect to dashboard
    if (isLoggedIn === 'true' && currentPage.includes('index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    // If on dashboard and not logged in, redirect to login
    if (isLoggedIn !== 'true' && currentPage.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// Check auth status when page loads
document.addEventListener('DOMContentLoaded', checkAuthStatus);