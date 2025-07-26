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
    
    // Chat functionality
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input textarea');
    const sendBtn = document.querySelector('.send-btn');
    const quickQuestions = document.querySelectorAll('.quick-question');
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Send message function
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            const response = await fetch('/ask-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            chatMessages.removeChild(typingIndicator);
            if (data.success) {
                addMessage(data.response, 'ai');
            } else {
                addMessage('Error: ' + data.message, 'ai');
            }
        } catch (error) {
            chatMessages.removeChild(typingIndicator);
            addMessage('Failed to connect to AI service.', 'ai');
        }
    }
    
    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${text}</p>
            </div>
            <div class="message-time">${timeString}</div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);
    
    // Send message on Enter key (but allow Shift+Enter for new lines)
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick question buttons
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            chatInput.value = this.textContent;
            chatInput.focus();
        });
    });
});
