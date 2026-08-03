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
});
