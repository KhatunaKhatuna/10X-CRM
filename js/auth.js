/**
 * Authentication Logic (Sign Up & Log In)
 */

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  // const loginForm = document.getElementById('login-form'); // We'll use this later

  if (signupForm) {
    signupForm.addEventListener('submit', handleSignUp);

    // Clear errors dynamically as the user types(bonus)
    const inputs = signupForm.querySelectorAll('.form-group__input');
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        this.classList.remove('input-error');
      
        const errorSpan = signupForm.querySelector(`#${this.id}-error`);
        if (errorSpan) {
          errorSpan.textContent = '';
        }
      });
    });
  }
});

function handleSignUp(event) {
  event.preventDefault(); 

  // 1. Get form values
  const form = event.target;
  
  const fullName = form.fullName.value;
  const email = form.email.value;
  const company = form.company.value;
  const password = form.password.value;
  const confirmPassword = form.confirmPassword.value;

  // 2. Clear previous errors
  clearErrors(form);

  let isValid = true;
  const users = getUsers();

  // 3. Validation Rules
  // Full Name: Required, min 3 characters (after trim)
  if (fullName.trim().length < 3) {
    showError(form, 'fullName', 'Full name must be at least 3 characters');
    isValid = false;
  }

  // Email: Required, must have @ and . 
  const emailLower = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailLower || !emailRegex.test(emailLower)) {
    showError(form, 'email', 'Please enter a valid email address');
    isValid = false;
  } else {
    // Check if email already exists
    const emailExists = users.some(user => user.email === emailLower);
    if (emailExists) {
      showError(form, 'email', 'An account with this email already exists');
      isValid = false;
    }
  }

  // Password: Min 8 chars, 1 letter, 1 number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (password.length < 8 || !hasLetter || !hasNumber) {
    showError(form, 'password', 'Password must be at least 8 characters and contain a letter and a number');
    isValid = false;
  }

  // Confirm Password: Must match Password
  if (confirmPassword !== password || confirmPassword === '') {
    showError(form, 'confirmPassword', 'Passwords do not match');
    isValid = false;
  }

  // 4. If valid, create user and save
  if (isValid) {
    const newUser = {
      id: Date.now(),
      fullName: fullName.trim(),
      email: emailLower,
      password: password,
      company: company.trim(),
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    users.push(newUser);
    saveUsers(users);

    // Show success toast
    showToast('Account created successfully! Please log in.', 'success');

    // Redirect to login page
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  }
}

// Helper to show error messages
function showError(form, inputId, message) {
  const input = form.querySelector(`#${inputId}`);
  const errorSpan = form.querySelector(`#${inputId}-error`);
  
  if (input && errorSpan) {
    input.classList.add('input-error');
    errorSpan.textContent = message;
  }
}

// Helper to clear all errors before checking again
function clearErrors(form) {
  const inputs = form.querySelectorAll('.form-group__input');
  const errorSpans = form.querySelectorAll('.form-group__error-message');
  
  inputs.forEach(input => input.classList.remove('input-error'));
  errorSpans.forEach(span => span.textContent = '');
}
