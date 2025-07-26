document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });
    
    // Responsive adjustments
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
    
    // Symptom analysis functionality
    const analyzeBtn = document.getElementById('analyze-btn');
    const symptomsInput = document.getElementById('symptoms');
    const durationInput = document.getElementById('duration');
    const severityInput = document.getElementById('severity');
    const resultsPlaceholder = document.querySelector('.results-placeholder');
    const resultsContent = document.querySelector('.results-content');
    const conditionsList = document.querySelector('.conditions-list');
    const recommendationsContent = document.querySelector('.recommendations-content');
    
    // Voice Recognition Functionality
    const voiceBtn = document.getElementById('voice-btn');
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        voiceBtn.addEventListener('click', function() {
            if (voiceBtn.classList.contains('listening')) {
                recognition.stop();
                voiceBtn.classList.remove('listening');
                symptomsInput.placeholder = "Enter your symptoms or click the mic to speak";
                return;
            }

            recognition.start();
            voiceBtn.classList.add('listening');
            symptomsInput.placeholder = "Listening... Speak now";
        });

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            symptomsInput.value = transcript;
            voiceBtn.classList.remove('listening');
            symptomsInput.placeholder = "Enter your symptoms or click the mic to speak";
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            voiceBtn.classList.remove('listening');
            symptomsInput.placeholder = "Error: Please try again or type manually";
            setTimeout(() => {
                symptomsInput.placeholder = "Enter your symptoms or click the mic to speak";
            }, 3000);
        };
    } else {
        // Browser doesn't support speech recognition
        voiceBtn.style.display = 'none';
        console.warn("Speech recognition not supported in this browser");
    }
    
    analyzeBtn.addEventListener('click', function () {
        const symptoms = symptomsInput.value.trim();
        const duration = durationInput.value.trim();
        const severity = severityInput.value.trim();
    
        if (!symptoms || !duration || !severity) {
            alert('Please fill in all the details: symptoms, duration, and severity before analyzing.');
            return;
        }
    
        fetch('/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ symptoms, duration, severity }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                conditionsList.innerHTML = '';
                data.diseases.forEach(disease => {
                    const item = document.createElement('div');
                    item.classList.add('condition-item');
                    item.innerHTML = `<span class="condition-name">${disease}</span>`;
                    conditionsList.appendChild(item);
                });
    
                recommendationsContent.innerHTML = `<p>${data.recommendation}</p>`;
                resultsContent.classList.remove('hidden');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    
    function generateMockResults(symptoms, duration, severity) {
        // Clear previous results
        conditionsList.innerHTML = '';
        
        // Generate mock conditions based on inputs
        const mockConditions = [
            { name: 'Common Cold', probability: 65 },
            { name: 'Seasonal Allergies', probability: 20 },
            { name: 'Sinus Infection', probability: 10 },
            { name: 'Influenza (Flu)', probability: 5 }
        ];
        
        // Add conditions to the list
        mockConditions.forEach(condition => {
            const conditionItem = document.createElement('div');
            conditionItem.className = 'condition-item';
            conditionItem.innerHTML = `
                <span class="condition-name">${condition.name}</span>
                <span class="condition-probability">${condition.probability}%</span>
            `;
            conditionsList.appendChild(conditionItem);
        });
        
        // Generate recommendations
        let recommendations = '';
        
        if (severity === 'mild') {
            recommendations = `
                <p>Based on your symptoms, we recommend:</p>
                <ul>
                    <li>Rest and drink plenty of fluids</li>
                    <li>Over-the-counter pain relievers if needed</li>
                    <li>Monitor symptoms for any changes</li>
                </ul>
                <p>If symptoms persist beyond ${getDurationText(duration)} or worsen, consider consulting a healthcare provider.</p>
            `;
        } else if (severity === 'moderate') {
            recommendations = `
                <p>Based on your symptoms, we recommend:</p>
                <ul>
                    <li>Rest and stay hydrated</li>
                    <li>Consider over-the-counter medications for symptom relief</li>
                    <li>Monitor your temperature regularly</li>
                </ul>
                <p>If symptoms don't improve within 2-3 days, we recommend scheduling an appointment with a healthcare provider.</p>
            `;
        } else {
            recommendations = `
                <p>Based on your symptoms, we recommend:</p>
                <ul>
                    <li>Seek medical attention as soon as possible</li>
                    <li>Rest and avoid strenuous activities</li>
                    <li>Stay hydrated and monitor for any worsening symptoms</li>
                </ul>
                <p>For severe symptoms, please consider visiting urgent care or an emergency room.</p>
            `;
        }
        
        recommendationsContent.innerHTML = recommendations;
    }
    
    function getDurationText(duration) {
        switch(duration) {
            case 'less-than-day': return '24 hours';
            case '1-3-days': return '3 days';
            case '3-7-days': return 'a week';
            case '1-2-weeks': return '2 weeks';
            default: return 'this period';
        }
    }
});