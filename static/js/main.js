document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Add subtle animation to Add to Cart buttons
    const cartButtons = document.querySelectorAll('.btn-add-cart');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = this.innerText;
            this.innerText = '¡AGREGADO!';
            this.style.backgroundColor = '#25D366'; // WhatsApp Green for success
            
            setTimeout(() => {
                this.innerText = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        });
    });
});
