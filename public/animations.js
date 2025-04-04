// Scroll Animation Functions

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add scroll progress indicator
    const scrollProgressBar = document.createElement('div');
    scrollProgressBar.className = 'scroll-progress';
    document.body.appendChild(scrollProgressBar);
    
    // Add animation classes to elements
    setupAnimations();
    
    // Check which elements are visible on initial load
    checkVisibility();
    
    // Listen for scroll events
    window.addEventListener('scroll', function() {
        // Update scroll progress bar
        updateScrollProgress();
        
        // Check which elements are visible
        checkVisibility();
    });
});

// Setup animation classes for various elements
function setupAnimations() {
    // Add animation classes to section titles
    document.querySelectorAll('.section-title').forEach((el, index) => {
        el.classList.add('animate-on-scroll');
    });
    
    // Remove animation classes from section subtitles
    document.querySelectorAll('.section-subtitle').forEach((el) => {
        el.classList.remove('animate-on-scroll', 'delay-1');
    });
    
    // Add animations to cards section
    const cardPositions = document.querySelectorAll('.card-position');
    cardPositions.forEach((el, index) => {
        el.classList.add('animate-on-scroll', `delay-${index + 1}`);
    });
    
    // Add animations to reading description
    document.querySelector('.reading-description').classList.add('animate-on-scroll');
    
    // Add animations to pricing cards with staggered delay
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((el, index) => {
        const delay = index % 3 + 1;
        el.classList.add('animate-on-scroll', `delay-${delay}`);
    });
    
    // Add animations to testimonials
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach((el, index) => {
        el.classList.add('animate-on-scroll', index % 2 === 0 ? 'animate-left' : 'animate-right');
    });
    
    // Add floating animation to decorative elements
    document.querySelectorAll('.tarot-card-prop').forEach(el => {
        el.classList.add('float-animation');
    });
    
    // Add glow animation to specific elements
    document.querySelectorAll('.whatsapp-button, .book-now-btn').forEach(el => {
        el.classList.add('glow-animation');
    });
}

// Check which elements are visible in the viewport
function checkVisibility() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        if (isElementInViewport(element)) {
            element.classList.add('visible');
        }
    });
}

// Helper function to check if an element is in the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
        rect.bottom >= 0
    );
}

// Update scroll progress bar
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    scrollProgress.style.width = scrollPercentage + '%';
}
