// Mobile Menu Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-btn')) {
        const header = document.querySelector('.header');
        const nav = document.querySelector('nav');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('div');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        
        // Insert mobile menu button into header
        if (nav) {
            nav.appendChild(mobileMenuBtn);
        } else if (header) {
            header.appendChild(mobileMenuBtn);
        }
        
        // Create mobile menu container
        const mobileMenuContainer = document.createElement('div');
        mobileMenuContainer.className = 'mobile-menu-container';
        document.body.appendChild(mobileMenuContainer);
        
        // Clone navigation links for mobile menu
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const mobileNavLinks = navLinks.cloneNode(true);
            mobileNavLinks.className = 'mobile-nav-links';
            mobileMenuContainer.appendChild(mobileNavLinks);
        }
        
        // Add close button to mobile menu
        const closeBtn = document.createElement('div');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        mobileMenuContainer.prepend(closeBtn);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenuContainer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
        });
        
        // Close mobile menu
        closeBtn.addEventListener('click', function() {
            mobileMenuContainer.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close menu when clicking on a link
        const mobileLinks = mobileMenuContainer.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuContainer.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (mobileMenuContainer.classList.contains('active') && 
                !mobileMenuContainer.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                mobileMenuContainer.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
});
