// scripts.js
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. Header Height Adjuster (for non-sticky header parts) ---
    const header = document.getElementById('main-header');
    const ticker = document.getElementById('event-ticker');

    function adjustTickerPosition() {
        // This ensures the non-sticky ticker always starts immediately below the branding header.
        if (header && ticker) {
            const headerHeight = header.offsetHeight;
            ticker.style.top = `${headerHeight}px`; 
        }
    }

    // Run on load and resize events
    window.addEventListener('load', adjustTickerPosition);
    window.addEventListener('resize', adjustTickerPosition);
    
    // Initial run
    adjustTickerPosition();
    
    
    // --- 2. Event Ticker Animation ---
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        // Duplicate content to ensure seamless loop
        tickerContent.innerHTML += tickerContent.innerHTML;
        
        let scrollPosition = 0;
        const scrollSpeed = 0.4; // Adjust speed (pixels per frame)
        
        function animateTicker() {
            // Total width of the original content
            const totalWidth = tickerContent.scrollWidth / 2; 
            
            scrollPosition += scrollSpeed;
            
            // When the first copy scrolls out, reset to 0
            if (scrollPosition >= totalWidth) {
                scrollPosition = 0;
            }
            
            tickerContent.style.transform = `translateX(-${scrollPosition}px)`;
            requestAnimationFrame(animateTicker);
        }
        
        // Start the continuous animation loop
        animateTicker();
    }


    // --- 3. Visitor Count Logic (Mock for Static Site) ---
    const countElement = document.getElementById('visitor-count');
    if (countElement) {
        let count = localStorage.getItem('siteVisitorCount');
        
        if (count === null) {
            count = 1000; // Starting mock count
        } else {
            count = parseInt(count) + 1;
        }
        
        localStorage.setItem('siteVisitorCount', count);
        countElement.textContent = count.toLocaleString();
    }
    
    
    // --- 4. Contact Form Submission Handler (AJAX for Formspree) ---
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('form-status-message');

    if (contactForm && statusMessage) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Stop the browser from redirecting

            const form = e.target;
            const data = new FormData(form);
            const action = form.action;

            // Clear previous messages and hide the status div
            statusMessage.classList.add('d-none');
            statusMessage.textContent = '';
            
            // Temporary button disable for user feedback
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Sending...';

            try {
                const response = await fetch(action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json' // Formspree requirement for AJAX submission
                    }
                });

                if (response.ok) {
                    // Success message
                    statusMessage.textContent = 'Message Sent Successfully! We will respond shortly.';
                    statusMessage.classList.remove('d-none', 'alert-danger');
                    statusMessage.classList.add('alert-success');
                    form.reset(); // Clear form fields on success
                } else {
                    // Error handling from Formspree
                    const responseData = await response.json();
                    let errorMessage = responseData.error || 'Oops! There was an error submitting your form.';
                    
                    statusMessage.textContent = errorMessage;
                    statusMessage.classList.remove('d-none', 'alert-success');
                    statusMessage.classList.add('alert-danger');
                }
            } catch (error) {
                // Network error handling
                console.error('Form submission failed:', error);
                statusMessage.textContent = 'Oops! Network error. Please check your connection and try again.';
                statusMessage.classList.remove('d-none', 'alert-success');
                statusMessage.classList.add('alert-danger');
            } finally {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Send Inquiry';
            }
        });
    }
});
