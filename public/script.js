// Remove card flipping functionality

function scrollToAppointment() {
    document.getElementById('appointment').scrollIntoView({ 
        behavior: 'smooth' 
    });
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
