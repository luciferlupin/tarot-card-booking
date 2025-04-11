// Tarot card data
const tarotCards = {
    past: {
        name: "The Fool",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
        meaning: "The Fool represents a new beginning, pure innocence, and spontaneity. In the past position, it suggests you've taken a leap of faith or started a significant journey with an open heart.",
        keywords: "New beginnings • Spontaneity • Faith"
    },
    present: {
        name: "The Magician",
        image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
        meaning: "The Magician symbolizes manifestation, resourcefulness, and power. In your present position, it indicates you have all the tools and skills needed to achieve your goals.",
        keywords: "Manifestation • Power • Action"
    },
    future: {
        name: "The High Priestess",
        image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
        meaning: "The High Priestess represents intuition, mystery, and inner knowledge. In the future position, she suggests that trusting your intuition will lead you to profound insights.",
        keywords: "Intuition • Mystery • Inner voice"
    }
};

// Track flipped cards and reading state
let flippedCards = [];
let readingComplete = false;

// Initialize tarot cards
document.addEventListener('DOMContentLoaded', function() {
    initializeTarotCards();
});

function initializeTarotCards() {
    const cards = document.querySelectorAll('.tarot-card');
    
    cards.forEach(card => {
        // Add click event listener
        card.addEventListener('click', function() {
            flipTarotCard(this);
        });
        
        // Add touch event listener for mobile
        card.addEventListener('touchstart', function(e) {
            e.preventDefault();
            flipTarotCard(this);
        });
    });
}

function flipTarotCard(card) {
    // Don't allow flipping if reading is complete
    if (readingComplete) return;
    
    // Don't flip if already flipped
    if (card.classList.contains('flipped')) return;
    
    // Flip the card with animation
    card.classList.add('flipped');
    
    // Add to flipped cards array
    const position = card.getAttribute('data-position');
    flippedCards.push(position);
    
    // Play flip sound
    playCardFlipSound();
    
    // Update the reading message
    updateReadingMessage();
    
    // Check if all cards are flipped
    if (flippedCards.length === 3) {
        readingComplete = true;
        setTimeout(showFullReading, 1000);
    }
}

function playCardFlipSound() {
    // You can add a sound effect here if desired
}

function updateReadingMessage() {
    const messageElement = document.getElementById('reading-message');
    if (!messageElement) return;
    
    let message = "";
    
    // Build message based on flipped cards
    flippedCards.forEach(position => {
        const card = tarotCards[position];
        message += `<div class="reading-card-message">
            <h4>${position.charAt(0).toUpperCase() + position.slice(1)}: ${card.name}</h4>
            <p>${card.meaning}</p>
        </div>`;
    });
    
    // Update the message element
    messageElement.innerHTML = message;
    
    // Show the message if there are flipped cards
    if (flippedCards.length > 0) {
        messageElement.classList.add('visible');
    }
}

function showFullReading() {
    const messageElement = document.getElementById('reading-message');
    if (!messageElement) return;
    
    let readingHTML = `
        <h3>Your Tarot Reading</h3>
        <div class="full-reading">
    `;
    
    // Add each card to the reading
    flippedCards.forEach(position => {
        const card = tarotCards[position];
        readingHTML += `
            <div class="reading-card">
                <h4>${position.charAt(0).toUpperCase() + position.slice(1)}: ${card.name}</h4>
                <p class="keywords">${card.keywords}</p>
                <p>${card.meaning}</p>
            </div>
        `;
    });
    
    // Add overall interpretation
    readingHTML += `
        <div class="reading-interpretation">
            <h4>Overall Interpretation</h4>
            <p>This reading suggests a journey from ${tarotCards.past.name} energy in your past, 
            through the current influence of ${tarotCards.present.name}, 
            leading toward the potential of ${tarotCards.future.name} in your future.</p>
            <p>Consider how these energies are flowing through your life right now.</p>
        </div>
    `;
    
    // Add reset button
    readingHTML += `
        </div>
        <button onclick="resetTarotReading()" class="submit-button">New Reading</button>
    `;
    
    // Update the message element
    messageElement.innerHTML = readingHTML;
    messageElement.classList.add('visible', 'full-reading-visible');
    
    // Scroll to the reading
    setTimeout(() => {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

function resetTarotReading() {
    // Reset state
    flippedCards = [];
    readingComplete = false;
    
    // Flip all cards back
    const cards = document.querySelectorAll('.tarot-card');
    cards.forEach(card => {
        card.classList.remove('flipped');
    });
    
    // Hide and clear the reading message
    const messageElement = document.getElementById('reading-message');
    if (messageElement) {
        messageElement.classList.remove('visible', 'full-reading-visible');
        setTimeout(() => {
            messageElement.innerHTML = '';
        }, 500);
    }
}

// Initialize WhatsApp link with dynamic content
document.addEventListener('DOMContentLoaded', function() {
    // Update WhatsApp link when service type is clicked
    const serviceCards = document.querySelectorAll('.reading-type-card');
    const whatsappButton = document.querySelector('.whatsapp-button');
    
    if (serviceCards.length > 0 && whatsappButton) {
        const baseUrl = "https://wa.me/919211370852";
        
        serviceCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all cards
                serviceCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                this.classList.add('active');
                
                // Get service type and create appropriate message
                const serviceType = this.getAttribute('data-service');
                const serviceTitle = this.querySelector('h3').textContent;
                let message = `Hello, I would like to book a ${serviceTitle}.`;
                
                // Add specific details based on service type
                if (serviceType === 'telephonic-questions') {
                    message += " I'm interested in the question-based service. Please let me know the available time slots.";
                } else if (serviceType === 'telephonic-time') {
                    message += " I'm interested in the time-based service. Please let me know the available time slots.";
                } else if (serviceType === 'text-based') {
                    message += " I'm interested in the text-based service. Please let me know how to proceed.";
                } else if (serviceType === 'detailed-reports') {
                    message += " I'm interested in getting a detailed report. Please let me know what information you need from me.";
                } else if (serviceType === 'tarot-courses') {
                    message += " I'm interested in learning more about your tarot courses. Please provide me with more information.";
                }
                
                // Update WhatsApp link
                whatsappButton.href = `${baseUrl}?text=${encodeURIComponent(message)}`;
            });
        });
    }
    
    // Particle animation for mystical effect
    createMysticalParticles();
});

// Create mystical particles
function createMysticalParticles() {
    const particlesContainer = document.querySelector('.mystical-particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random size
        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s infinite ease-in-out`;
        
        particlesContainer.appendChild(particle);
    }
}

// Add smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to nav items on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add touch support
document.querySelectorAll('.card').forEach(card => {
    // Remove any existing event listeners
    card.removeEventListener('touchstart', null);
    card.removeEventListener('click', null);
    
    // Add touch event
    card.addEventListener('touchstart', function(e) {
        e.preventDefault();
        flipTarotCard(this);
    });
    
    // Add click event
    card.addEventListener('click', function(e) {
        e.preventDefault();
        flipTarotCard(this);
    });
});

// Form field animations
document.querySelectorAll('.form-field input').forEach(input => {
    // Add focus animations
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('field-active');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('field-active');
        }
    });
    
    // Add floating label animation
    input.addEventListener('input', function() {
        if (this.value) {
            this.parentElement.classList.add('field-filled');
        } else {
            this.parentElement.classList.remove('field-filled');
        }
    });
});

// Reading option hover effects
document.querySelectorAll('.reading-option').forEach(option => {
    option.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.crystal-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(45deg)';
        }
    });
    
    option.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.crystal-icon');
        if (icon) {
            icon.style.transform = 'none';
        }
    });
});

// Add smooth scrolling for pricing buttons
document.addEventListener('DOMContentLoaded', function() {
    const pricingButtons = document.querySelectorAll('.book-now-btn');
    
    pricingButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the reading type from the button's parent card
            const card = this.closest('.pricing-card');
            const readingType = card.querySelector('h3').textContent.toLowerCase().split(' ')[0];
            
            // Find the corresponding radio button in the booking form
            const radioButton = document.querySelector(`input[type="radio"][value="${readingType}"]`);
            if (radioButton) {
                radioButton.checked = true;
            }
            
            // Scroll to the booking section
            const bookingSection = document.getElementById('appointment');
            bookingSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
});

// Add floating symbols
document.addEventListener('DOMContentLoaded', function() {
    const symbols = document.querySelectorAll('.floating-symbols span');
    
    symbols.forEach((symbol, index) => {
        symbol.style.left = `${Math.random() * 100}vw`;
        symbol.style.top = `${Math.random() * 100}vh`;
        symbol.style.animationDelay = `${Math.random() * 5}s`;
    });

    // Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Header scroll effect and mobile menu
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.header nav');
    const navLinks = document.querySelectorAll('.header nav a');

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        mobileMenuBtn.textContent = nav.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // Active link highlight
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 300)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// Service Cards Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    const modal = document.getElementById('serviceModal');
    const modalBody = document.querySelector('.modal-body');
    const closeModal = document.querySelector('.close-modal');
    const serviceDetails = document.querySelector('.service-details');
    
    // Open modal when clicking on a service card
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceType = this.getAttribute('data-service');
            const detailsContent = document.getElementById(`${serviceType}-details`);
            
            if (detailsContent) {
                // Clone the content to avoid removing it from the original container
                const contentClone = detailsContent.cloneNode(true);
                
                // Clear previous content and add new content
                modalBody.innerHTML = '';
                modalBody.appendChild(contentClone);
                
                // Show the modal with animation
                modal.style.display = 'block';
                
                // Add event listener to the "Book Now" button in the modal
                const bookButton = modalBody.querySelector('.book-now-btn');
                if (bookButton) {
                    bookButton.addEventListener('click', function(e) {
                        e.preventDefault();
                        
                        // Close the modal
                        modal.style.display = 'none';
                        
                        // Scroll to the appointment section
                        const appointmentSection = document.getElementById('appointment');
                        if (appointmentSection) {
                            appointmentSection.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // Select the corresponding service in the booking form if available
                            const serviceInput = document.querySelector(`input[name="service"][value="${serviceType}"]`);
                            if (serviceInput) {
                                serviceInput.checked = true;
                            }
                        }
                    });
                }
                
                // Add mystical particles to the modal for enhanced effect
                const particles = document.createElement('div');
                particles.className = 'modal-particles';
                modalBody.appendChild(particles);
                
                // Create floating particles
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('span');
                    particle.className = 'modal-particle';
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    particle.style.animationDelay = `${Math.random() * 5}s`;
                    particle.style.opacity = Math.random() * 0.5 + 0.1;
                    particle.style.fontSize = `${Math.random() * 10 + 10}px`;
                    particle.innerHTML = '✧';
                    particles.appendChild(particle);
                }
            }
        });
    });
    
    // Close modal when clicking the close button
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
});

// Add CSS for modal particles
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .modal-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }
        
        .modal-particle {
            position: absolute;
            color: var(--accent-1);
            animation: float 10s infinite ease-in-out;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(10deg);
            }
        }
    `;
    document.head.appendChild(style);
});
