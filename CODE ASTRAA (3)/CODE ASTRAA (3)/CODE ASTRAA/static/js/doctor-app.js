// doctor-appointment.js

document.addEventListener("DOMContentLoaded", function () {
    const doctorSelect = document.getElementById("doctor-select");
    const appointmentDate = document.getElementById("appointment-date");
    const appointmentTime = document.getElementById("appointment-time");
    const bookButton = document.getElementById("book-appointment-btn");
    const confirmationMessage = document.querySelector(".confirmation-message");

    bookButton.addEventListener("click", function () {
        const doctorId = doctorSelect.value;
        const doctorText = doctorSelect.options[doctorSelect.selectedIndex].text;
        const date = appointmentDate.value;
        const time = appointmentTime.value;

        // Clear previous messages
        confirmationMessage.classList.add("hidden");
        confirmationMessage.innerHTML = "";

        // Basic validation
        if (!doctorId || !date || !time) {
            confirmationMessage.innerHTML = "Please fill in all fields to book an appointment.";
            confirmationMessage.style.backgroundColor = "#f8d7da";
            confirmationMessage.style.color = "#721c24";
            confirmationMessage.style.borderLeft = "5px solid #f44336";
            confirmationMessage.classList.remove("hidden");
            return;
        }

        // Show confirmation message
        confirmationMessage.innerHTML = `
            Appointment successfully booked with <strong>${doctorText}</strong> on 
            <strong>${date}</strong> at <strong>${time}</strong>.
        `;
        confirmationMessage.style.backgroundColor = "#d4edda";
        confirmationMessage.style.color = "#155724";
        confirmationMessage.style.borderLeft = "5px solid #28a745";
        confirmationMessage.classList.remove("hidden");

        // Optional: Reset form fields
        doctorSelect.value = "";
        appointmentDate.value = "";
        appointmentTime.value = "";
    });
});
