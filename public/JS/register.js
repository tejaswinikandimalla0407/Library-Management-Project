document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registration-form");
  const studentName = document.getElementById("student-name");
  const studentId = document.getElementById("student-id");
  const email = document.getElementById("email-id");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  const hints = {
    length: document.getElementById("length"),
    lowercase: document.getElementById("lowercase"),
    uppercase: document.getElementById("uppercase"),
    number: document.getElementById("number"),
    special: document.getElementById("special"),
  };

  // ✅ Password rule checks
  password.addEventListener("input", () => {
    const val = password.value;
    hints.length.className = val.length >= 8 && val.length <= 15 ? "valid" : "invalid";
    hints.lowercase.className = /[a-z]/.test(val) ? "valid" : "invalid";
    hints.uppercase.className = /[A-Z]/.test(val) ? "valid" : "invalid";
    hints.number.className = /\d/.test(val) ? "valid" : "invalid";
    hints.special.className = /[^A-Za-z0-9]/.test(val) ? "valid" : "invalid";
  });

  // ✅ Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
      alert("❌ Confirm Password does not match.");
      return;
    }

    // Check all password rules are valid
    const allValid = Object.values(hints).every((el) => el.classList.contains("valid"));
    if (!allValid) {
      alert("❌ Password must meet all requirements.");
      return;
    }

    // Send to backend
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName.value.trim(),
          studentId: studentId.value.trim(),
          email: email.value.trim(),
          password: password.value,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Registered successfully! Redirecting to login...");
        window.location.href = "/HTML/login.html";
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("❌ Registration failed. Try again later.");
      console.error(err);
    }
  });
});
