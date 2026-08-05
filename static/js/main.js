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

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (drawer.classList.contains('open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Configurar botones de WhatsApp para productos
    const cartButtons = document.querySelectorAll('.btn-add-cart');
    const phoneNumber = "51927485356"; // Tu número de WhatsApp

    cartButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
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

        carousel.addEventListener('touchstart', () => isHovered = true, { passive: true });
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

        // startAutoScroll(); // Deshabilitado para evitar temblor con CSS scroll-snap y lag en móviles

        window.addEventListener('resize', () => {
            stopAutoScroll();
            // startAutoScroll(); // Deshabilitado para evitar temblor con CSS scroll-snap y lag en móviles
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

    // Legal Modals Logic
    const legalLinks = document.querySelectorAll('.legal-link');
    const legalModal = document.getElementById('legal-modal');
    const legalTitle = document.getElementById('legal-modal-title');
    const legalBody = document.getElementById('legal-modal-body');
    const legalClose = document.querySelector('.modal-close-legal');

    const legalTexts = {
        "Políticas de Privacidad": "<p>En Golden Perú respetamos tu privacidad. Toda la información personal recopilada a través de nuestros formularios o compras se utiliza exclusivamente para procesar tus pedidos, facturación y mejorar tu experiencia. No compartimos tus datos con terceros sin tu consentimiento explícito.</p>",
        "Políticas de Cookies": "<p>Utilizamos cookies esenciales para el correcto funcionamiento de nuestra tienda online y cookies analíticas para entender cómo navegas en nuestra web, lo cual nos ayuda a mejorar nuestros servicios. Puedes configurar tu navegador para rechazar las cookies, pero algunas funciones podrían no estar disponibles.</p>",
        "Políticas de Tratamiento de Datos": "<p>De acuerdo a la Ley de Protección de Datos Personales, garantizamos la seguridad y estricta confidencialidad de tu información. Tienes el derecho absoluto de acceder, rectificar o solicitar la eliminación de tus datos en cualquier momento comunicándote a nuestros canales de atención.</p>",
        "Términos y Condiciones": "<p>Al realizar una compra en Golden Perú, aceptas nuestros términos de venta, que incluyen nuestras garantías de fábrica (de 1 a 12 años dependiendo de la línea del producto adquirida), políticas de cambios o devoluciones por fallas de fábrica, y las condiciones de uso de esta plataforma web.</p>",
        "Políticas de Envío": "<p>Realizamos envíos a toda Lima Metropolitana y el Perú. Los tiempos de entrega varían entre 2 a 5 días hábiles luego de confirmada y validada la compra. Para envíos a provincias, la entrega se coordina mediante agencia de transportes con pago del flete en destino, bajo responsabilidad del cliente.</p>"
    };

    legalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const title = link.getAttribute('data-title');
            legalTitle.textContent = title;
            legalBody.innerHTML = legalTexts[title] || "<p>Contenido legal en actualización.</p>";
            legalModal.style.display = "flex";
        });
    });

    if (legalClose) {
        legalClose.addEventListener('click', () => {
            legalModal.style.display = "none";
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === legalModal) {
            legalModal.style.display = "none";
        }
    });

});
