document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("admin-login-form");
  const errorModal = document.getElementById("error-modal");
  const successModal = document.getElementById("success-modal");
  const closeModalBtn = document.getElementById("close-modal");
  const usernameInput = document.getElementById("admin-username");
  const passwordInput = document.getElementById("admin-password");
  const errorMessage = document.getElementById("error-message");

  // Admin authentication is now handled server-side for security

  // Form submission handler
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Clear any previous error states
    usernameInput.style.borderColor = "";
    passwordInput.style.borderColor = "";

    // Validate inputs
    if (!username || !password) {
      showErrorModal("Please enter both username and password.");
      if (!username) usernameInput.style.borderColor = "#f56565";
      if (!password) passwordInput.style.borderColor = "#f56565";
      return;
    }

    // Show loading state
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '⏳ Authenticating...';
    submitButton.disabled = true;

    try {
      // Send credentials to server for validation
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        // Successful login
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminUsername", username);
        localStorage.setItem("adminRole", data.admin.role);
        localStorage.setItem("loginTimestamp", new Date().toISOString());
        
        showSuccessModal();
        
        // Redirect after showing success modal
        setTimeout(() => {
          window.location.href = "/HTML/management.html";
        }, 2000);
        
      } else {
        // Failed login
        showErrorModal(data.message || "Invalid credentials or unauthorized user.");
        
        // Highlight input fields with error
        usernameInput.style.borderColor = "#f56565";
        passwordInput.style.borderColor = "#f56565";
        
        // Clear password field for security
        passwordInput.value = "";
        
        // Add shake animation to form
        loginForm.classList.add("shake");
        setTimeout(() => loginForm.classList.remove("shake"), 500);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      showErrorModal("Network error. Please check your connection and try again.");
      
      // Highlight input fields with error
      usernameInput.style.borderColor = "#f56565";
      passwordInput.style.borderColor = "#f56565";
    } finally {
      // Reset button state
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  });

  // Modal functions
  function showErrorModal(message) {
    errorMessage.textContent = message;
    errorModal.classList.add("show");
    
    // Focus trap on modal
    closeModalBtn.focus();
  }

  function showSuccessModal() {
    successModal.classList.add("show");
  }

  function hideErrorModal() {
    errorModal.classList.remove("show");
    usernameInput.focus(); // Return focus to username field
  }

  // Close modal event listeners
  closeModalBtn.addEventListener("click", hideErrorModal);
  
  // Close modal on backdrop click
  errorModal.addEventListener("click", (e) => {
    if (e.target === errorModal) {
      hideErrorModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && errorModal.classList.contains("show")) {
      hideErrorModal();
    }
  });

  // Input field animations
  [usernameInput, passwordInput].forEach(input => {
    input.addEventListener("focus", () => {
      input.style.borderColor = "";
    });
    
    input.addEventListener("input", () => {
      if (input.style.borderColor) {
        input.style.borderColor = "";
      }
    });
  });

  // Auto-focus username field on page load
  setTimeout(() => {
    usernameInput.focus();
  }, 500);

  // Clear any existing admin sessions when loading the login page
  // This ensures users must always enter credentials
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminUsername");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("loginTimestamp");
  
  console.log("Admin login page loaded - ready for authentication");
});

// Add CSS for shake animation
const style = document.createElement('style');
style.textContent = `
  .shake {
    animation: shake 0.5s ease-in-out;
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
