document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        const inputs = form.querySelectorAll("input");

        inputs.forEach(input => {
            const label = form.querySelector(`label[for='${input.id}']`);
            if (label && input.hasAttribute("required")) {
                label.innerHTML += " <span style='color:red'>*</span>";
            }

            if (input.type === "password") {
                const guideline = document.createElement("small");
                guideline.style.display = "block";
                guideline.style.color = "#555";
                guideline.innerText = "Password must be 8-15 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.";
                input.parentNode.insertBefore(guideline, input.nextSibling);

                input.addEventListener("input", function () {
                    const value = input.value;
                    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,15}$/.test(value);
                    input.setCustomValidity(isValid ? "" : "Invalid password format.");
                });
            }
        });

        form.addEventListener("submit", function (e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                alert("Please fill out all required fields correctly.");
            }
        });
    });
});
