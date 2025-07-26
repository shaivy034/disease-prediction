document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                nav.style.display = 'none';
            }
        });
    });
    
    // Symptom checker functionality
    const symptomInput = document.getElementById('symptom-input');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingSection = document.getElementById('loading');
    const resultsSection = document.getElementById('results');
    const conditionsList = document.getElementById('conditions-list');
    const recommendationText = document.getElementById('recommendation-text');
    
    analyzeBtn.addEventListener('click', function() {
        const symptoms = symptomInput.value.trim();
        
        if (symptoms === '') {
            alert('Please describe your symptoms.');
            return;
        }
        
        // Show loading state
        loadingSection.style.display = 'flex';
        resultsSection.style.display = 'none';
        
        // Simulate API call with timeout
        setTimeout(function() {
            // Hide loading and show results
            loadingSection.style.display = 'none';
            resultsSection.style.display = 'block';
            
            // Generate mock results based on input
            generateMockResults(symptoms);
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });
    
    function generateMockResults(symptoms) {
        // Clear previous results
        conditionsList.innerHTML = '';
        
        // This is mock data - in a real app, you would call an API
        const mockConditions = [
            { name: 'Common Cold', probability: 65 },
            { name: 'Seasonal Allergies', probability: 25 },
            { name: 'Influenza (Flu)', probability: 10 }
        ];
        
        // Add conditions to the list
        mockConditions.forEach(condition => {
            const conditionItem = document.createElement('div');
            conditionItem.className = 'condition-item';
            
            conditionItem.innerHTML = `
                <div class="condition-name">${condition.name}</div>
                <div class="condition-probability">${condition.probability}%</div>
            `;
            
            conditionsList.appendChild(conditionItem);
        });
        
        // Generate mock recommendation
        let recommendation = '';
        
        if (symptoms.toLowerCase().includes('fever') || symptoms.toLowerCase().includes('headache')) {
            recommendation = `Based on your symptoms, it's likely you have a viral infection. 
                            Get plenty of rest, drink fluids, and consider taking acetaminophen 
                            or ibuprofen for fever or pain. If symptoms worsen or persist for 
                            more than 3 days, consult a healthcare professional.`;
        } else if (symptoms.toLowerCase().includes('cough') || symptoms.toLowerCase().includes('sore throat')) {
            recommendation = `Your symptoms suggest a respiratory infection. Stay hydrated, 
                            use throat lozenges for sore throat, and consider a humidifier. 
                            If you develop difficulty breathing or high fever, seek medical attention.`;
        } else {
            recommendation = `Monitor your symptoms and get plenty of rest. If symptoms persist 
                            for more than a few days or worsen, consider consulting a healthcare 
                            professional for further evaluation.`;
        }
        
        recommendationText.textContent = recommendation;
    }
    
    // AI Chat functionality
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    function sendMessage() {
        const message = userInput.value.trim();
        
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input
        userInput.value = '';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-message ai-message';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="avatar">
                <img src="assets/doctor-ai.png" alt="AI Doctor">
            </div>
            <div class="message-content">
                <p>...</p>
            </div>
        `;
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // Simulate AI response after delay
        setTimeout(function() {
            // Remove typing indicator
            const indicator = document.getElementById('typing-indicator');
            if (indicator) chatBox.removeChild(indicator);
            
            // Generate and add AI response
            const response = generateAIResponse(message);
            addMessageToChat(response, 'ai');
        }, 1500);
    }
    
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        if (sender === 'ai') {
            messageDiv.innerHTML = `
                <div class="avatar">
                    <img src="assets/doctor-ai.png" alt="AI Doctor">
                </div>
                <div class="message-content">
                    <p>${message}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${message}</p>
                </div>
                <div class="avatar">
                    <img src="https://via.placeholder.com/40" alt="User">
                </div>
            `;
        }
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
    
    function generateAIResponse(message) {
        // This is a simplified mock response - in a real app, you would call an AI API
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('headache')) {
            return `Headaches can have many causes. Common ones include tension, dehydration, or lack of sleep. 
                   Try drinking water, resting, and taking a pain reliever if needed. If headaches are severe 
                   or persistent, consult a doctor.`;
        } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
            return `A fever is often a sign your body is fighting an infection. Stay hydrated, rest, 
                   and monitor your temperature. If fever is above 103°F (39.4°C) or lasts more than 
                   3 days, seek medical advice.`;
        } else if (lowerMessage.includes('stomach') || lowerMessage.includes('nausea')) {
            return `Stomach issues can result from food, viruses, or other causes. Drink clear fluids, 
                   eat bland foods, and rest. If symptoms include severe pain, vomiting, or last more 
                   than 2 days, see a doctor.`;
        } else if (lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
            return `Cold and flu symptoms typically include cough, sore throat, and congestion. Rest, 
                   fluids, and over-the-counter meds can help. If you have difficulty breathing or high 
                   fever, seek medical care.`;
        } else if (lowerMessage.includes('allergy') || lowerMessage.includes('allergies')) {
            return `Allergy symptoms often include sneezing, itchy eyes, and runny nose. Antihistamines 
                   can help. If symptoms are severe or include difficulty breathing, seek immediate care.`;
        } else if (lowerMessage.includes('thank')) {
            return `You're welcome! Is there anything else I can help you with today?`;
        } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return `Hello! I'm here to help with your health questions. What symptoms are you experiencing?`;
        } else {
            return `I understand you're asking about "${message}". While I can provide general health information, 
                   it's important to consult with a healthcare professional for personalized advice. Could you 
                   tell me more about your specific symptoms?`;
        }
    }
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', { name, email, message });
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
    
    // Responsive adjustments
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
});