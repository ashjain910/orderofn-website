// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuButton = document.querySelector('.mobile-menu-button');
    
    mobileNav.classList.toggle('active');
    menuButton.classList.toggle('active');
}

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for anchor links (backup for browsers without CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const mobileNav = document.getElementById('mobileNav');
            const menuButton = document.querySelector('.mobile-menu-button');
            if (mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                menuButton.classList.remove('active');
            }
        }
    });
});

// Contact Form Handling (basic validation and console log)
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value
        };
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Log form data (replace with actual form submission logic)
        console.log('Form submitted:', formData);
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset form
        contactForm.reset();
    });
}

// Add scroll effect to header
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 8px 30px -4px hsla(207, 90%, 54%, 0.18)';
    } else {
        header.style.boxShadow = '0 4px 20px -2px hsla(207, 90%, 54%, 0.12)';
    }
    
    lastScroll = currentScroll;
});

