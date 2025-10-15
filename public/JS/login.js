document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const studentId = document.getElementById("studentId").value;
  const password = document.getElementById("password").value;

  // Show loading state
  const submitButton = document.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Logging in...';
  submitButton.disabled = true;

  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Store complete user data in localStorage
        localStorage.setItem("isStudentLoggedIn", "true");
        localStorage.setItem("studentData", JSON.stringify(data.user));
        localStorage.setItem("currentStudentId", data.user.studentId);
        localStorage.setItem("loginTimestamp", new Date().toISOString());
        
        // Check if there's a return URL stored
        const returnUrl = localStorage.getItem('returnUrl');
        if (returnUrl) {
          localStorage.removeItem('returnUrl'); // Clean up
          alert("✅ " + data.message + "! Redirecting back to your previous page...");
          window.location.href = returnUrl;
        } else {
          alert("✅ " + data.message + "! Redirecting to dashboard...");
          window.location.href = "/HTML/dashboard.html"; // Redirect to dashboard
        }
      } else {
        alert("❌ " + data.message);
      }
    })
    .catch((error) => {
      console.error('Login error:', error);
      alert("❌ Server error. Please try again later.");
    })
    .finally(() => {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});
