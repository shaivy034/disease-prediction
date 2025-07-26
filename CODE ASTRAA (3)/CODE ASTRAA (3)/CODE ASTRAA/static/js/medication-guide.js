// Medication Guide JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const searchBtn = document.getElementById('search-btn');
    const voiceBtn = document.getElementById('voice-btn');
    const medicationSearch = document.getElementById('medication-search');
    const medicationType = document.getElementById('medication-type');
    const resultsPlaceholder = document.querySelector('.results-placeholder');
    const resultsContent = document.querySelector('.results-content');
    
    // Sample medication data (in a real app, this would come from an API)
    const medicationDatabase = {
        'ibuprofen': {
            name: 'Ibuprofen',
            type: 'pain-reliever',
            overview: 'Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, fever, and inflammation. It works by reducing hormones that cause inflammation and pain in the body.',
            sideEffects: [
                'Stomach pain, heartburn',
                'Nausea, vomiting',
                'Gas, bloating',
                'Dizziness, headache',
                'Mild itching or rash'
            ],
            interactions: [
                'Aspirin (may increase risk of side effects)',
                'Blood pressure medications (may reduce effectiveness)',
                'Diuretics (may reduce effectiveness)',
                'Lithium (may increase lithium levels)',
                'Warfarin (may increase bleeding risk)'
            ],
            dosage: {
                adults: '200-400mg every 4-6 hours as needed (max 1200mg/day)',
                children: 'Consult pediatrician for appropriate dosage',
                notes: 'Take with food or milk to avoid stomach upset. Do not use for more than 10 days without consulting a doctor.'
            }
        },
        'amoxicillin': {
            name: 'Amoxicillin',
            type: 'antibiotic',
            overview: 'Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infection caused by bacteria, such as tonsillitis, bronchitis, pneumonia, and infections of the ear, nose, throat, skin, or urinary tract.',
            sideEffects: [
                'Diarrhea',
                'Stomach pain',
                'Headache',
                'Mild skin rash',
                'Vaginal itching or discharge'
            ],
            interactions: [
                'Probenecid (may increase amoxicillin levels)',
                'Allopurinol (may increase risk of skin rash)',
                'Blood thinners (may increase bleeding risk)',
                'Oral contraceptives (may reduce effectiveness)',
                'Other antibiotics (may reduce effectiveness)'
            ],
            dosage: {
                adults: '250-500mg every 8 hours or 500-875mg every 12 hours',
                children: '20-90mg/kg/day divided every 8-12 hours',
                notes: 'Take exactly as prescribed. Complete the full course even if symptoms improve. May take with or without food.'
            }
        },
        'loratadine': {
            name: 'Loratadine',
            type: 'antihistamine',
            overview: 'Loratadine is an antihistamine that reduces the effects of natural chemical histamine in the body. It is used to treat sneezing, runny nose, watery eyes, hives, skin rash, itching, and other cold or allergy symptoms.',
            sideEffects: [
                'Headache',
                'Drowsiness (uncommon)',
                'Dry mouth',
                'Nervousness',
                'Stomach pain'
            ],
            interactions: [
                'Ketoconazole (may increase loratadine levels)',
                'Erythromycin (may increase loratadine levels)',
                'Cimetidine (may increase loratadine levels)',
                'Alcohol (may increase drowsiness)',
                'Sedatives (may increase drowsiness)'
            ],
            dosage: {
                adults: '10mg once daily',
                children: '5mg once daily (ages 2-6)',
                notes: 'May take with or without food. Avoid taking with fruit juices which may decrease absorption.'
            }
        }
    };

    // Voice recognition setup
    let recognition;
    try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            medicationSearch.value = transcript;
            searchMedication();
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
            voiceBtn.classList.remove('listening');
        };

        recognition.onend = function() {
            voiceBtn.classList.remove('listening');
        };
    } catch(e) {
        console.log('Speech recognition not supported');
        voiceBtn.style.display = 'none';
    }

    // Event Listeners
    searchBtn.addEventListener('click', searchMedication);
    medicationSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchMedication();
        }
    });

    if (recognition) {
        voiceBtn.addEventListener('click', toggleVoiceRecognition);
    }

    // Functions
    function searchMedication() {
        const searchTerm = medicationSearch.value.trim().toLowerCase();
        const typeFilter = medicationType.value;
        
        if (!searchTerm) {
            alert('Please enter a medication name');
            return;
        }

        // In a real app, this would be an API call
        // Here we're just using our sample database
        const medication = medicationDatabase[searchTerm];
        
        if (medication && (!typeFilter || medication.type === typeFilter)) {
            displayMedication(medication);
        } else {
            // Show not found message
            resultsPlaceholder.innerHTML = `
                <img src="assets/search-not-found.png" alt="Not found icon">
                <h3>Medication not found</h3>
                <p>We couldn't find information for "${searchTerm}". Please check the spelling or try a different name.</p>
            `;
            resultsPlaceholder.classList.remove('hidden');
            resultsContent.classList.add('hidden');
        }
    }

    function displayMedication(medication) {
        // Update header
        document.getElementById('medication-name').textContent = medication.name;
        document.getElementById('medication-type-label').textContent = getTypeLabel(medication.type);
        
        // Update overview
        document.getElementById('overview-text').textContent = medication.overview;
        
        // Update side effects
        const sideEffectsContent = document.getElementById('side-effects-content');
        sideEffectsContent.innerHTML = `
            <p><strong>Common side effects may include:</strong></p>
            <ul>
                ${medication.sideEffects.map(effect => `<li>${effect}</li>`).join('')}
            </ul>
            <p class="warning-text"><i class="fas fa-exclamation-circle"></i> Seek medical help if you experience severe side effects like difficulty breathing, swelling, or severe skin reactions.</p>
        `;
        
        // Update interactions
        const interactionsContent = document.getElementById('interactions-content');
        interactionsContent.innerHTML = `
            <p><strong>May interact with:</strong></p>
            <ul>
                ${medication.interactions.map(interaction => `<li>${interaction}</li>`).join('')}
            </ul>
            <p class="warning-text"><i class="fas fa-exclamation-circle"></i> Always inform your doctor about all medications and supplements you're taking.</p>
        `;
        
        // Update dosage
        const dosageContent = document.getElementById('dosage-content');
        dosageContent.innerHTML = `
            <div class="dosage-group">
                <h5>Adults:</h5>
                <p>${medication.dosage.adults}</p>
            </div>
            <div class="dosage-group">
                <h5>Children:</h5>
                <p>${medication.dosage.children}</p>
            </div>
            <div class="dosage-notes">
                <h5>Notes:</h5>
                <p>${medication.dosage.notes}</p>
            </div>
        `;
        
        // Show results
        resultsPlaceholder.classList.add('hidden');
        resultsContent.classList.remove('hidden');
    }

    function getTypeLabel(type) {
        const labels = {
            'antibiotic': 'Antibiotic',
            'pain-reliever': 'Pain Reliever',
            'antihistamine': 'Antihistamine',
            'antidepressant': 'Antidepressant',
            'blood-pressure': 'Blood Pressure',
            'diabetes': 'Diabetes',
            'other': 'Other'
        };
        return labels[type] || 'Medication';
    }

    function toggleVoiceRecognition() {
        if (voiceBtn.classList.contains('listening')) {
            recognition.stop();
            voiceBtn.classList.remove('listening');
        } else {
            recognition.start();
            voiceBtn.classList.add('listening');
            medicationSearch.placeholder = 'Listening...';
            
            // Reset placeholder after a delay if nothing was recognized
            setTimeout(() => {
                if (!voiceBtn.classList.contains('listening')) {
                    medicationSearch.placeholder = 'Enter medication name or click the mic to speak';
                }
            }, 3000);
        }
    }

    // Initialize with a sample medication if needed
    // displayMedication(medicationDatabase['ibuprofen']);
});