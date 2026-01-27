const form = document.getElementById('form');
const fullnameInput = document.getElementById('fullname');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

const fullnameError = document.getElementById('fullname-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const submitButton = document.getElementById('submit');
const formMsg = document.getElementById('formMsg');

const lengthCheck = document.getElementById('length-check');
const uppercaseCheck = document.getElementById('uppercase-check');
const lowercaseCheck = document.getElementById('lowercase-check');
const numberCheck = document.getElementById('number-check');
const specialCheck = document.getElementById('special-check');
const reqList = document.querySelectorAll('.req');

// Helper to update requirement UI (text and checkbox)
function updateRequirement(element, isValid) {
    const checkbox = element.previousElementSibling;
    if (isValid) {
        element.className = "req ok";
        if (checkbox) checkbox.className = "checkbox valid";
    } else {
        element.className = "req not-ok"; 
        if (checkbox) checkbox.className = "checkbox invalid";
    }
}




// Full Name Validation Process:
// 1. Check if empty
// 2. Check length >= 3
// 3. Check for at least 2 words
// 4. Check for no numbers
function checkFullName() {
    const value = fullnameInput.value.trim();
    if (value === "") {
        fullnameError.textContent = "Full Name is required";
        fullnameInput.className = "invalid";
        return false;
    }
    
    if (value.length < 3) {
        fullnameError.textContent = "Name must be at least 3 characters";
        fullnameInput.className = "invalid";
        return false;
    }

    const parts = value.split(' ').filter(part => part !== '');
    if (parts.length < 2) {
        fullnameError.textContent = "Please enter both first and last name";
        fullnameInput.className = "invalid";
        return false;
    }

    // Check for no numbers using helper function negated
    // If hasNumber returns true, then validation fails
    if (hasNumber(value)) {
        fullnameError.textContent = "Name cannot contain numbers";
        fullnameInput.className = "invalid";
        return false;
    }

    fullnameError.textContent = "";
    fullnameInput.className = "valid";
    return true;
}


// Email Validation Process:
// 1. Check if email is empty
// 2. Check if email is valid

function checkEmail(){
    const emailValue = emailInput.value.trim();
    if(emailValue === ""){
        emailError.textContent = "Email is required";
        emailInput.className = "invalid";
        return false;
    }

    if(emailValue.indexOf(`@`) === -1 || emailValue.indexOf(`.`) === -1){
        emailError.textContent = `Enter a valid email address`;
        emailInput.className = "invalid";
        return false;
    }

    emailError.textContent = ``;
    emailInput.className = "valid";
    return true;
}

// Password Validation Process:
// 1. Check if password is empty
// 2. Check if password is valid
// 3. Check if password is strong

// Uppercase helper function
function hasUppercase(text){
    if(text.toLowerCase() !== text){
        return true;
    }
    else{
        return false;
    }
}

// Lowercase helper function
function hasLowercase(text){
    if(text.toUpperCase() !== text){
        return true;
    }
        else{
        return false;
    }
}

function hasNumber(text){
    let i = 0;
    while(i < text.length){
        let ch = text[i]
        if(ch >= "0" && ch <= "9"){
            return true
        }
        i++
    }
    return false
}


// Number helper function
// Check for number
// We use a for...of loop here instead of a while loop because:
// 1. It offers cleaner syntax by abstracting away index management.
// 2. It reduces the risk of infinite loops (no manual increment needed).
// 3. It directly provides the value ('char') which improves readability.


// function hasNumber(text){
//     for(let char of text){
//         if (char >= '0' && char <= '9'){
//             return true;
//         }
//     }
//     return false;
// }

// Special Character helper function
function hasSpecial(text){
    const specialChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?";
    for(let char of text){
        if (specialChars.includes(char)){
            return true;
        }
    }
    return false;
}

// Check Password Value
function checkPassword(){
    let passwordValue = passwordInput.value;

    // Check for length
    updateRequirement(lengthCheck, passwordValue.length >= 8);

    // Check for uppercase
    updateRequirement(uppercaseCheck, hasUppercase(passwordValue));

    // Check for lowercase
    updateRequirement(lowercaseCheck, hasLowercase(passwordValue));

    // Check for number
    const isNumberValid = hasNumber(passwordValue);
    updateRequirement(numberCheck, isNumberValid);

    // Check for special character
    const isSpecialValid = hasSpecial(passwordValue);
    updateRequirement(specialCheck, isSpecialValid);

    // Calculate overall validity
    const isValid = (passwordValue.length >= 8) && 
           hasUppercase(passwordValue) && 
           hasLowercase(passwordValue) && 
           isNumberValid &&
           isSpecialValid;

    // Update Input UI
    if(isValid) {
        passwordInput.className = "valid";
        passwordError.textContent = ""; 
    } else {
        passwordInput.className = "invalid";
        // Optional: We could add a generic error message here, similar to other fields
        // passwordError.textContent = "Password does not meet all requirements";
    }

    return isValid;
}

// Confirm Password Validation Process:
// 1. Check if matches password
function checkConfirmPassword() {
    const password = passwordInput.value;
    const confirm = confirmPasswordInput.value;

    if (confirm === "") {
        confirmPasswordError.textContent = "Please confirm your password";
        confirmPasswordInput.className = "invalid";
        return false;
    }

    if (password !== confirm) {
        confirmPasswordError.textContent = "Passwords do not match";
        confirmPasswordInput.className = "invalid";
        return false;
    }

    confirmPasswordError.textContent = "";
    confirmPasswordInput.className = "valid";
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Event Listeners for Real-time Validation
    if(fullnameInput) fullnameInput.addEventListener('input', checkFullName);
    if(emailInput) emailInput.addEventListener('input', checkEmail);
    if(passwordInput) passwordInput.addEventListener('input', () => {
        checkPassword();
        if(confirmPasswordInput.value !== "") checkConfirmPassword(); // Re-check confirm if password changes
    });
    if(confirmPasswordInput) confirmPasswordInput.addEventListener('input', checkConfirmPassword);

    // Form Submission
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isFullnameValid = checkFullName();
            const isEmailValid = checkEmail();
            const isPasswordValid = checkPassword();
            const isConfirmValid = checkConfirmPassword();

            if(isFullnameValid && isEmailValid && isPasswordValid && isConfirmValid) {
                // simple success message or submit logic
                formMsg.textContent = "Form submitted successfully!";
                formMsg.style.color = "green";
                // form.submit(); // Uncomment if real submission is needed
            } else {
                formMsg.textContent = "Please fill in all required fields";
                formMsg.style.color = "red";
            }
        });
    }

    // Toggle Password Logic (Handles multiple toggles)
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Find the input within the same parent wrapper
            const wrapper = button.parentElement;
            const input = wrapper.querySelector('input');
            const eyeIcon = button.querySelector('svg');

            if (input) {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);

                if (type === 'text') {
                    eyeIcon.innerHTML = `
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    `;
                } else {
                    eyeIcon.innerHTML = `
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    `;
                }
            }
        });
    });
});
