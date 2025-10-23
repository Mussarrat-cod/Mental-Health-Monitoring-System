// Global variables
let moodData = [];
let journalEntries = [];
let currentMood = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadStoredData();
    initializeMoodChart();
});

// Initialize the application
function initializeApp() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Mood buttons
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            moodButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            this.classList.add('selected');
            currentMood = this.getAttribute('data-mood');
        });
    });

    // Chat input
    const chatInput = document.getElementById('chat-input');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Contact form
    const contactForm = document.querySelector('.contact-form form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Message sent successfully!', 'success');
        this.reset();
    });
}

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Mood tracking functions
function saveMood() {
    if (!currentMood) {
        showNotification('Please select a mood first!', 'error');
        return;
    }

    const moodNote = document.getElementById('mood-note').value;
    const moodEntry = {
        date: new Date().toISOString().split('T')[0],
        mood: currentMood,
        note: moodNote,
        timestamp: new Date().toISOString()
    };

    moodData.push(moodEntry);
    localStorage.setItem('moodData', JSON.stringify(moodData));
    
    showNotification('Mood saved successfully!', 'ginger');
    updateMoodChart();
    
    // Reset form
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('mood-note').value = '';
    currentMood = null;
}

// Journal functions
function saveJournal() {
    const journalEntry = document.getElementById('journal-entry').value;
    if (!journalEntry.trim()) {
        showNotification('Please write something in your journal!', 'error');
        return;
    }

    const entry = {
        date: new Date().toISOString().split('T')[0],
        content: journalEntry,
        timestamp: new Date().toISOString()
    };

    journalEntries.push(entry);
    localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    
    showNotification('Journal entry saved!', 'ginger');
    document.getElementById('journal-entry').value = '';
}

// Chatbot functions
function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;

    // Add user message to chat
    addMessageToChat(message, 'user');
    chatInput.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat(response, 'bot');
    }, 1000);
}

function addMessageToChat(message, sender) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(userMessage) {
    const responses = {
        greeting: [
            "Hello! I'm here to support you. How can I help you today?",
            "Hi there! I'm glad you're reaching out. What's on your mind?",
            "Welcome! I'm your AI mental health companion. How are you feeling?"
        ],
        mood: [
            "It sounds like you're going through a tough time. Remember, it's okay to feel this way. Would you like to talk about what's causing these feelings?",
            "Your feelings are valid. Let's explore some coping strategies together.",
            "I understand you're struggling. Sometimes talking about our emotions can help. What's been weighing on your mind?"
        ],
        stress: [
            "Stress is a natural response, but we can work together to manage it. Try taking some deep breaths.",
            "It sounds like you're feeling overwhelmed. Let's break this down into smaller, manageable steps.",
            "Remember to be kind to yourself. What are some things that usually help you relax?"
        ],
        anxiety: [
            "Anxiety can feel overwhelming, but you're not alone. Let's practice some grounding techniques.",
            "It's brave of you to share this. Anxiety is treatable, and there are many strategies we can explore.",
            "Your anxiety is valid. Let's work on some breathing exercises together."
        ],
        help: [
            "I'm here to listen and support you. What specific help are you looking for?",
            "I can help with mood tracking, coping strategies, or just be someone to talk to.",
            "Let me know what you need - I'm here to help with your mental wellness journey."
        ]
    };

    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
        return getRandomResponse(responses.greeting);
    } else if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
        return getRandomResponse(responses.mood);
    } else if (message.includes('stress') || message.includes('stressed') || message.includes('overwhelmed')) {
        return getRandomResponse(responses.stress);
    } else if (message.includes('anxiety') || message.includes('anxious') || message.includes('worried')) {
        return getRandomResponse(responses.anxiety);
    } else if (message.includes('help') || message.includes('support')) {
        return getRandomResponse(responses.help);
    } else {
        return "Thank you for sharing that with me. I'm here to listen and support you. How else can I help you today?";
    }
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Data management functions
function loadStoredData() {
    // Load mood data
    const storedMoodData = localStorage.getItem('moodData');
    if (storedMoodData) {
        moodData = JSON.parse(storedMoodData);
    }

    // Load journal entries
    const storedJournalEntries = localStorage.getItem('journalEntries');
    if (storedJournalEntries) {
        journalEntries = JSON.parse(storedJournalEntries);
    }
}

// Chart functions
function initializeMoodChart() {
    const ctx = document.getElementById('moodChart');
    if (!ctx) return;

    const moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: getLast7Days(),
            datasets: [{
                label: 'Mood Level',
                data: getMoodDataForChart(),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            const moods = ['', 'Very Sad', 'Sad', 'Neutral', 'Happy', 'Very Happy'];
                            return moods[value] || '';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    }
    return days;
}

function getMoodDataForChart() {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const moodEntry = moodData.find(entry => entry.date === dateString);
        if (moodEntry) {
            const moodValues = {
                'very-sad': 1,
                'sad': 2,
                'neutral': 3,
                'happy': 4,
                'very-happy': 5
            };
            last7Days.push(moodValues[moodEntry.mood] || 3);
        } else {
            last7Days.push(null);
        }
    }
    return last7Days;
}

function updateMoodChart() {
    // This would typically update the chart with new data
    // For now, we'll just reload the page to show the updated chart
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ff4757' : type === 'ginger' ? '#ffa726' : '#2ed573'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Add some sample data for demonstration
function addSampleData() {
    if (moodData.length === 0) {
        const sampleMoods = [
            { date: '2024-01-15', mood: 'happy', note: 'Had a great day at work!', timestamp: '2024-01-15T10:00:00.000Z' },
            { date: '2024-01-16', mood: 'neutral', note: 'Regular day, nothing special.', timestamp: '2024-01-16T10:00:00.000Z' },
            { date: '2024-01-17', mood: 'sad', note: 'Feeling a bit down today.', timestamp: '2024-01-17T10:00:00.000Z' },
            { date: '2024-01-18', mood: 'happy', note: 'Went for a walk, feeling better!', timestamp: '2024-01-18T10:00:00.000Z' },
            { date: '2024-01-19', mood: 'very-happy', note: 'Amazing day with friends!', timestamp: '2024-01-19T10:00:00.000Z' },
            { date: '2024-01-20', mood: 'neutral', note: 'Quiet day at home.', timestamp: '2024-01-20T10:00:00.000Z' },
            { date: '2024-01-21', mood: 'happy', note: 'Good progress on my goals.', timestamp: '2024-01-21T10:00:00.000Z' }
        ];
        
        moodData = sampleMoods;
        localStorage.setItem('moodData', JSON.stringify(moodData));
    }

    if (journalEntries.length === 0) {
        const sampleJournal = [
            { date: '2024-01-15', content: 'Today was productive. I finished my project and felt really accomplished.', timestamp: '2024-01-15T20:00:00.000Z' },
            { date: '2024-01-16', content: 'Feeling a bit stressed about the upcoming presentation. Need to practice more.', timestamp: '2024-01-16T20:00:00.000Z' },
            { date: '2024-01-17', content: 'Had a difficult conversation with a friend today. Still processing my feelings about it.', timestamp: '2024-01-17T20:00:00.000Z' }
        ];
        
        journalEntries = sampleJournal;
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }
}

// Initialize sample data on first load
setTimeout(addSampleData, 1000);
