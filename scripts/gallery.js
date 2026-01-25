export function initGallery() {
    console.log("--- INICIANDO GALERÍA ---");

    const scrollers = document.querySelectorAll(".scroller");
    
    // Verificamos si encontró el contenedor
    if (scrollers.length === 0) {
        console.warn("⚠️ ALERTA: No encontré ningún div con la clase .scroller");
        return;
    } else {
        console.log(`✅ Encontré ${scrollers.length} scroller(s).`);
    }

    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // --- 1. Lógica de Scroll Infinito (FORZADA) ---
    // Quitamos el "if" de prefer-reduced-motion para probar
    scrollers.forEach((scroller) => {
        // Le ponemos el atributo que activa el CSS
        scroller.setAttribute("data-animated", "true");
        console.log("✅ Atributo data-animated='true' agregado.");

        const scrollerInner = scroller.querySelector(".scroller__inner");
        
        if (!scrollerInner) {
            console.error("❌ ERROR: No encontré la lista .scroller__inner dentro del scroller");
            return;
        }

        const scrollerContent = Array.from(scrollerInner.children);
        console.log(`📸 Fotos originales encontradas: ${scrollerContent.length}`);

        // Duplicamos el contenido
        scrollerContent.forEach((item) => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", "true");
            scrollerInner.appendChild(duplicatedItem);
        });
        
        console.log("✅ Fotos duplicadas para el bucle infinito.");
    });

    // --- 2. Lógica de Lightbox (Click para ampliar) ---
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-card');

        if (card && modal) {
            e.preventDefault(); 
            console.log("🔍 Click en tarjeta de galería");

            const img = card.querySelector('img');
            const caption = card.getAttribute('data-caption');
            const imgSrc = img.src;

            if (modalTitle) modalTitle.textContent = caption; 
            
            if (modalBody) {
                modalBody.innerHTML = `
                    <div style="text-align: center;">
                        <img src="${imgSrc}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    </div>
                `;
            }

            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    });
}