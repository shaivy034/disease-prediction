// Doctor Appointments JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const searchDoctorsBtn = document.getElementById('search-doctors-btn');
    const specialtySearch = document.getElementById('specialty-search');
    const locationFilter = document.getElementById('location-filter');
    const availabilityFilter = document.getElementById('availability-filter');
    const resultsPlaceholder = document.querySelector('.results-placeholder');
    const resultsContent = document.querySelector('.results-content');
    const doctorCardsContainer = document.querySelector('.doctor-cards');
    const upcomingAppointmentsContainer = document.querySelector('#upcoming-appointments .appointments-cards');
    const pastAppointmentsContainer = document.querySelector('#past-appointments .appointments-cards');
    const switchToBookBtn = document.querySelector('.switch-to-book');
    
    // Modal Elements
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalDoctorName = document.getElementById('modal-doctor-name');
    const modalDoctorImg = document.getElementById('modal-doctor-img');
    const modalDoctorSpecialty = document.getElementById('modal-doctor-specialty');
    const modalDoctorLocation = document.getElementById('modal-doctor-location');
    const modalDoctorRating = document.getElementById('modal-doctor-rating');
    const appointmentDate = document.getElementById('appointment-date');
    const appointmentTime = document.getElementById('appointment-time');
    const appointmentReason = document.getElementById('appointment-reason');
    const confirmBookingBtn = document.getElementById('confirm-booking-btn');
    
    // Confirmation Modal Elements
    const confirmationModal = document.getElementById('confirmation-modal');
    const confirmationDoctor = document.getElementById('confirmation-doctor');
    const confirmationTime = document.getElementById('confirmation-time');
    const confirmationLocation = document.getElementById('confirmation-location');
    const confirmationNumber = document.getElementById('confirmation-number');
    const addToCalendarBtn = document.getElementById('add-to-calendar');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    
    // Sample data for doctors (in a real app, this would come from an API)
    const doctorsDatabase = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            location: "New York",
            rating: 4.7,
            reviews: 142,
            image: "assets/doctor1.jpg",
            availability: ["2023-06-15T10:30", "2023-06-15T14:00", "2023-06-16T09:00", "2023-06-17T11:30"],
            bio: "Board-certified cardiologist with 12 years of experience specializing in preventive cardiology and heart failure management."
        },
        {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Pediatrician",
            location: "Los Angeles",
            rating: 4.9,
            reviews: 98,
            image: "assets/doctor2.jpg",
            availability: ["2023-06-14T13:30", "2023-06-15T15:00", "2023-06-16T10:30", "2023-06-18T09:30"],
            bio: "Pediatric specialist with a focus on childhood development and adolescent medicine. Fluent in English and Mandarin."
        },
        {
            id: 3,
            name: "Dr. Emily Rodriguez",
            specialty: "Dermatologist",
            location: "Chicago",
            rating: 4.5,
            reviews: 87,
            image: "assets/doctor3.jpg",
            availability: ["2023-06-15T08:30", "2023-06-16T11:00", "2023-06-17T14:30", "2023-06-19T10:00"],
            bio: "Dermatology specialist with expertise in cosmetic dermatology and skin cancer prevention. Member of the American Academy of Dermatology."
        },
        {
            id: 4,
            name: "Dr. James Wilson",
            specialty: "Orthopedic Surgeon",
            location: "Houston",
            rating: 4.8,
            reviews: 76,
            image: "assets/doctor4.jpg",
            availability: ["2023-06-14T16:00", "2023-06-15T09:30", "2023-06-17T13:00", "2023-06-18T11:00"],
            bio: "Orthopedic surgeon specializing in sports medicine and joint replacement. Team physician for several professional sports teams."
        }
    ];
    
    // Sample data for appointments (in a real app, this would come from user data)
    let upcomingAppointments = [];
    let pastAppointments = [
        {
            id: "MED1001",
            doctorId: 1,
            doctorName: "Dr. Sarah Johnson",
            specialty: "Cardiologist",
            date: "2023-05-10T10:30",
            location: "New York Medical Center",
            reason: "Annual heart checkup",
            status: "completed"
        },
        {
            id: "MED1002",
            doctorId: 3,
            doctorName: "Dr. Emily Rodriguez",
            specialty: "Dermatologist",
            date: "2023-04-15T14:00",
            location: "Chicago Skin Clinic",
            reason: "Skin allergy consultation",
            status: "completed"
        }
    ];
    
    // Current selected doctor for booking
    let selectedDoctor = null;
    
    // Initialize the page
    function init() {
        // Set minimum date for date picker to today
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        appointmentDate.min = `${yyyy}-${mm}-${dd}`;
        
        // Load appointments if any exist
        loadAppointments();
    }
    
    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Switch to book tab from empty state
    if (switchToBookBtn) {
        switchToBookBtn.addEventListener('click', function() {
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabBtns[0].classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            tabContents[0].classList.add('active');
        });
    }
    
    // Search doctors functionality
    searchDoctorsBtn.addEventListener('click', searchDoctors);
    specialtySearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchDoctors();
        }
    });
    
    function searchDoctors() {
        const searchTerm = specialtySearch.value.trim().toLowerCase();
        const location = locationFilter.value;
        const availability = availabilityFilter.value;
        
        if (!searchTerm) {
            alert('Please enter a specialty to search for');
            return;
        }
        
        // Filter doctors based on search criteria
        let filteredDoctors = doctorsDatabase.filter(doctor => {
            const matchesSpecialty = doctor.specialty.toLowerCase().includes(searchTerm);
            const matchesLocation = !location || doctor.location.toLowerCase() === location;
            
            return matchesSpecialty && matchesLocation;
        });
        
        // Further filter by availability if selected
        if (availability) {
            filteredDoctors = filteredDoctors.filter(doctor => {
                // In a real app, we would check actual availability
                return true; // For demo purposes, we'll just return all
            });
        }
        
        displayDoctors(filteredDoctors);
    }
    
    // Display doctors in the results
    function displayDoctors(doctors) {
        if (doctors.length === 0) {
            resultsPlaceholder.innerHTML = `
                <img src="assets/search-not-found.png" alt="Not found icon">
                <h3>No doctors found</h3>
                <p>We couldn't find any doctors matching your search. Try different criteria.</p>
            `;
            resultsPlaceholder.classList.remove('hidden');
            resultsContent.classList.add('hidden');
            return;
        }
        
        doctorCardsContainer.innerHTML = '';
        
        doctors.forEach(doctor => {
            const doctorCard = document.createElement('div');
            doctorCard.className = 'doctor-card';
            doctorCard.innerHTML = `
                <div class="doctor-card-header">
                    <img src="${doctor.image}" alt="${doctor.name}" class="doctor-card-img">
                    <div class="doctor-card-info">
                        <h4>${doctor.name}</h4>
                        <span class="doctor-card-specialty">${doctor.specialty}</span>
                        <p class="doctor-card-location"><i class="fas fa-map-marker-alt"></i> ${doctor.location}</p>
                        <div class="rating">
                            ${generateRatingStars(doctor.rating)}
                            <span>${doctor.rating} (${doctor.reviews} reviews)</span>
                        </div>
                    </div>
                </div>
                <p class="doctor-card-bio">${doctor.bio}</p>
                <div class="doctor-card-availability">
                    <span class="availability-title">Next available:</span>
                    <div class="availability-badges">
                        ${generateAvailabilityBadges(doctor.availability.slice(0, 3))}
                    </div>
                </div>
                <button class="primary-btn book-btn" data-doctor-id="${doctor.id}">Book Appointment</button>
            `;
            
            doctorCardsContainer.appendChild(doctorCard);
        });
        
        // Add event listeners to book buttons
        document.querySelectorAll('.book-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const doctorId = parseInt(this.getAttribute('data-doctor-id'));
                selectedDoctor = doctorsDatabase.find(d => d.id === doctorId);
                openBookingModal(selectedDoctor);
            });
        });
        
        resultsPlaceholder.classList.add('hidden');
        resultsContent.classList.remove('hidden');
    }
    
    // Generate rating stars HTML
    function generateRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }
    
    // Generate availability badges HTML
    function generateAvailabilityBadges(availability) {
        return availability.map(time => {
            const date = new Date(time);
            const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
            const formattedTime = date.toLocaleString('en-US', options);
            return `<span class="availability-badge" data-time="${time}">${formattedTime}</span>`;
        }).join('');
    }
    
    // Open booking modal
    function openBookingModal(doctor) {
        modalDoctorName.textContent = doctor.name;
        modalDoctorImg.src = doctor.image;
        modalDoctorSpecialty.textContent = doctor.specialty;
        modalDoctorLocation.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${doctor.location}`;
        modalDoctorRating.innerHTML = `${generateRatingStars(doctor.rating)} <span>${doctor.rating} (${doctor.reviews} reviews)</span>`;
        
        // Reset form
        appointmentDate.value = '';
        appointmentTime.innerHTML = '<option value="">Select a time</option>';
        appointmentReason.value = '';
        
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Close modal
    function closeModal() {
        bookingModal.classList.remove('active');
        confirmationModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Event listeners for modals
    closeModalBtn.addEventListener('click', closeModal);
    closeConfirmationBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === bookingModal || e.target === confirmationModal) {
            closeModal();
        }
    });
    
    // When date is selected, populate available times
    appointmentDate.addEventListener('change', function() {
        if (!selectedDoctor) return;
        
        const selectedDate = this.value;
        appointmentTime.innerHTML = '<option value="">Select a time</option>';
        
        // Filter available times for selected date (in a real app, this would check real availability)
        const availableTimes = selectedDoctor.availability
            .filter(time => time.startsWith(selectedDate))
            .map(time => {
                const timePart = time.split('T')[1];
                const [hours, minutes] = timePart.split(':');
                const formattedTime = `${hours}:${minutes}`;
                return {
                    value: time,
                    display: `${hours}:${minutes}`
                };
            });
        
        if (availableTimes.length === 0) {
            appointmentTime.innerHTML = '<option value="">No available times for this date</option>';
            return;
        }
        
        availableTimes.forEach(time => {
            const option = document.createElement('option');
            option.value = time.value;
            option.textContent = time.display;
            appointmentTime.appendChild(option);
        });
    });
    
    // Confirm booking
    confirmBookingBtn.addEventListener('click', function() {
        if (!selectedDoctor) return;
        
        const date = appointmentDate.value;
        const time = appointmentTime.value;
        const reason = appointmentReason.value.trim();
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        if (!time) {
            alert('Please select a time');
            return;
        }
        
        if (!reason) {
            alert('Please enter a reason for your visit');
            return;
        }
        
        // Create new appointment (in a real app, this would save to a database)
        const appointmentDateObj = new Date(time);
        const appointmentId = 'MED' + Math.floor(1000 + Math.random() * 9000);
        
        const newAppointment = {
            id: appointmentId,
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            specialty: selectedDoctor.specialty,
            date: time,
            location: selectedDoctor.location + " Medical Center",
            reason: reason,
            status: "upcoming"
        };
        
        upcomingAppointments.push(newAppointment);
        
        // Show confirmation
        showConfirmation(newAppointment);
    });
    
    // Show confirmation modal
    function showConfirmation(appointment) {
        const appointmentDate = new Date(appointment.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = appointmentDate.toLocaleString('en-US', options);
        
        confirmationDoctor.textContent = appointment.doctorName;
        confirmationTime.textContent = formattedDate;
        confirmationLocation.textContent = appointment.location;
        confirmationNumber.textContent = appointment.id;
        
        // Close booking modal and open confirmation
        bookingModal.classList.remove('active');
        confirmationModal.classList.add('active');
        
        // Update appointments list
        loadAppointments();
    }
    
    // Add to calendar functionality
    addToCalendarBtn.addEventListener('click', function() {
        alert('Appointment added to your calendar!');
    });
    
    // Load and display appointments
    function loadAppointments() {
        // Upcoming appointments
        if (upcomingAppointments.length > 0) {
            document.querySelector('#upcoming-appointments .empty-state').classList.add('hidden');
            upcomingAppointmentsContainer.classList.remove('hidden');
            upcomingAppointmentsContainer.innerHTML = '';
            
            upcomingAppointments.forEach(appointment => {
                const appointmentCard = createAppointmentCard(appointment);
                upcomingAppointmentsContainer.appendChild(appointmentCard);
            });
        } else {
            document.querySelector('#upcoming-appointments .empty-state').classList.remove('hidden');
            upcomingAppointmentsContainer.classList.add('hidden');
        }
        
        // Past appointments
        if (pastAppointments.length > 0) {
            document.querySelector('#past-appointments .empty-state').classList.add('hidden');
            pastAppointmentsContainer.classList.remove('hidden');
            pastAppointmentsContainer.innerHTML = '';
            
            pastAppointments.forEach(appointment => {
                const appointmentCard = createAppointmentCard(appointment, true);
                pastAppointmentsContainer.appendChild(appointmentCard);
            });
        } else {
            document.querySelector('#past-appointments .empty-state').classList.remove('hidden');
            pastAppointmentsContainer.classList.add('hidden');
        }
    }
    
    // Create appointment card HTML
    function createAppointmentCard(appointment, isPast = false) {
        const appointmentDate = new Date(appointment.date);
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = appointmentDate.toLocaleString('en-US', options);
        
        const card = document.createElement('div');
        card.className = 'appointment-card';
        card.innerHTML = `
            <div class="appointment-info">
                <h4>${appointment.doctorName}</h4>
                <span class="appointment-specialty">${appointment.specialty}</span>
                <p class="appointment-time"><i class="far fa-calendar-alt"></i> ${formattedDate}</p>
                <p class="appointment-location"><i class="fas fa-map-marker-alt"></i> ${appointment.location}</p>
                ${appointment.reason ? `<p class="appointment-reason"><i class="fas fa-sticky-note"></i> ${appointment.reason}</p>` : ''}
            </div>
            <div class="appointment-actions">
                ${!isPast ? `<button class="secondary-btn cancel-btn" data-appointment-id="${appointment.id}">Cancel</button>` : ''}
                ${!isPast ? `<button class="primary-btn reschedule-btn" data-appointment-id="${appointment.id}">Reschedule</button>` : ''}
                ${isPast ? `<button class="primary-btn view-details-btn" data-appointment-id="${appointment.id}">View Details</button>` : ''}
            </div>
        `;
        
        // Add event listeners to buttons
        if (!isPast) {
            const cancelBtn = card.querySelector('.cancel-btn');
            const rescheduleBtn = card.querySelector('.reschedule-btn');
            
            cancelBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to cancel this appointment?')) {
                    cancelAppointment(appointment.id);
                }
            });
            
            rescheduleBtn.addEventListener('click', function() {
                selectedDoctor = doctorsDatabase.find(d => d.id === appointment.doctorId);
                if (selectedDoctor) {
                    openBookingModal(selectedDoctor);
                }
            });
        } else {
            const viewDetailsBtn = card.querySelector('.view-details-btn');
            viewDetailsBtn.addEventListener('click', function() {
                alert(`Appointment details:\n\nDoctor: ${appointment.doctorName}\nDate: ${formattedDate}\nLocation: ${appointment.location}\nReason: ${appointment.reason}\nStatus: Completed`);
            });
        }
        
        return card;
    }
    
    // Cancel appointment
    function cancelAppointment(appointmentId) {
        upcomingAppointments = upcomingAppointments.filter(app => app.id !== appointmentId);
        loadAppointments();
    }
    
    // Initialize the page
    init();
});