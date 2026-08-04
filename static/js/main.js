document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');

    function openDrawer() {
        drawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Configurar botones de WhatsApp para productos
    const cartButtons = document.querySelectorAll('.btn-add-cart');
    const phoneNumber = "51939030861"; // Tu número de WhatsApp

    cartButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            let productName = "";
            let categoryName = "";
            
            // Buscar la sección y la tarjeta actual
            const card = this.closest('.carousel-item');
            const section = this.closest('.catalog-section');
            
            if (section) {
                const sectionTitle = section.querySelector('h2');
                if (sectionTitle) {
                    categoryName = sectionTitle.textContent.trim();
                }
            }

            if (card) {
                const h4 = card.querySelector('h4');
                const btnText = this.textContent.trim().toUpperCase();
                
                if (btnText.includes('CONSULTAR')) {
                    // Para tarimas: "CONSULTAR MAJESTAD" -> "Tarima MAJESTAD"
                    // Para Nube: "CONSULTAR NUBE" -> "Tarima NUBE"
                    productName = "Tarima " + btnText.replace('CONSULTAR', '').trim();
                } else if (h4) {
                    // Para colchones: tomar el nombre del título h4
                    productName = h4.textContent.trim();
                }
            }
            
            // Construir el mensaje pre-armado
            const message = `Hola, estoy interesado en el producto: *${productName}* (${categoryName}). ¿Me podrían brindar precios y más información?`;
            
            // Crear el enlace a WhatsApp con el texto codificado
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            // Redirigir a WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    });

    // Auto-scroll carousels
    const carousels = document.querySelectorAll('.carousel-container');
    
    carousels.forEach(carousel => {
        let isDown = false;
        let isHovered = false;
        let startX;
        let scrollLeft;
        let scrollInterval;
        
        const section = carousel.closest('.catalog-section');
        const isMobileOnly = section && section.classList.contains('auto-scroll-mobile');
        const isAll = section && section.classList.contains('auto-scroll-all');
        
        function startAutoScroll() {
            if (scrollInterval) clearInterval(scrollInterval);
            scrollInterval = setInterval(() => {
                const isMobileView = window.innerWidth <= 768;
                
                if (!isHovered && !isDown && ((isMobileOnly && isMobileView) || isAll)) {
                    carousel.scrollLeft += 1.5; // Scroll speed
                    
                    if (carousel.scrollLeft >= (carousel.scrollWidth - carousel.clientWidth - 2)) {
                        // Simplemente regresamos al inicio suavemente (o de golpe)
                        // para no alterar el orden del DOM y mantener la foto estática al final.
                        carousel.scrollLeft = 0;
                    }
                }
            }, 30);
        }
        
        function stopAutoScroll() {
            if (scrollInterval) clearInterval(scrollInterval);
        }
        
        carousel.addEventListener('mouseenter', () => isHovered = true);
        carousel.addEventListener('mouseleave', () => {
            isHovered = false;
            isDown = false;
        });
        
        carousel.addEventListener('touchstart', () => isHovered = true, {passive: true});
        carousel.addEventListener('touchend', () => isHovered = false);
        
        // Touch/Mouse dragging support
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        carousel.addEventListener('mouseup', () => isDown = false);
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2; 
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        startAutoScroll();
        
        window.addEventListener('resize', () => {
            stopAutoScroll();
            startAutoScroll();
        });
    });

    // Scroll reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    // For elements inside carousels (which may not have the reveal class but should still animate nicely if needed), 
    // we already put reveal on the section, which gives a nice section-level animation.
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Mobile Footer Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-col h4');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const parent = header.parentElement;
                parent.classList.toggle('active');
            }
        });
    });

    // FAQ Accordion
    const faqHeaders = document.querySelectorAll('.accordion-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            
            // Toggle current
            header.classList.toggle('active');
            
            if (header.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
                content.classList.add('active');
            } else {
                content.style.maxHeight = "0px";
                content.classList.remove('active');
            }
        });
    });
});
