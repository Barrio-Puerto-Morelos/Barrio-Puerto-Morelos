/* scripts/gallery.js */

export async function initGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!galleryContainer) return;

    try {
        const response = await fetch('data/gallery.json');
        const photos = await response.json();

        // 1. GENERAR HTML
        photos.forEach(photo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="gallery-card" data-caption="${photo.caption}">
                    <div class="card-image-wrapper">
                        <img src="${photo.image}" alt="${photo.alt}" loading="lazy" draggable="false">
                        <div class="overlay-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                    </div>
                    <div class="card-footer">
                        <span>${photo.date}</span>
                        <strong>${photo.title}</strong>
                    </div>
                </div>`;
            galleryContainer.appendChild(li);
        });

        // 2. INICIAR LÓGICA DE MOVIMIENTO
        initDraggableMarquee(galleryContainer);

        // 3. LÓGICA DEL CLIC (ZOOM)
        galleryContainer.addEventListener('click', (e) => {
            // Si el atributo es 'true', significa que el usuario estaba arrastrando, no haciendo clic.
            if (galleryContainer.getAttribute('data-is-dragging') === 'true') {
                return; 
            }

            const card = e.target.closest('.gallery-card');
            if (card && modal) {
                const img = card.querySelector('img');
                const caption = card.getAttribute('data-caption');
                
                if (img) {
                    modalTitle.textContent = caption || "Detalle de imagen";
                    modalBody.innerHTML = `<img src="${img.src}" style="width:100%; height:auto; display:block; border-radius:8px;">`;
                    modal.classList.add('show');
                    // Asegúrate de que el modal tenga display: block o similar en tu CSS al tener la clase .show
                }
            }
        });

    } catch (error) { 
        console.error('Error cargando la galería:', error); 
    }
}

function initDraggableMarquee(track) {
    // Duplicar items para el efecto infinito
    const items = Array.from(track.children);
    items.forEach(item => {
        track.appendChild(item.cloneNode(true));
    });

    let xPos = 0;
    let currentSpeed = 0.5;
    let isDown = false;
    let isHovering = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragDistance = 0;
    let trackWidth = track.scrollWidth / 2;

    const animate = () => {
        if (!isDown && !isHovering) {
            xPos -= currentSpeed;
        }
        
        // Reset infinito
        if (Math.abs(xPos) >= trackWidth) xPos = 0;
        if (xPos > 0) xPos = -trackWidth;
        
        track.style.transform = `translateX(${xPos}px)`;
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        trackWidth = track.scrollWidth / 2;
    });

    // --- EVENTOS DE RATÓN ---

    track.addEventListener('mouseenter', () => isHovering = true);
    track.addEventListener('mouseleave', () => {
        isHovering = false;
        // Si el usuario sale del contenedor mientras arrastra, forzamos el fin del drag
        if (isDown) {
            isDown = false;
            track.style.cursor = 'grab';
        }
    });

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        dragDistance = 0;
        track.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = xPos;
        // Inicialmente asumimos que es un clic
        track.setAttribute('data-is-dragging', 'false');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        
        const x = e.pageX;
        const walk = (x - startX) * 1.2; // Sensibilidad de arrastre
        xPos = scrollLeft + walk;

        dragDistance = Math.abs(x - startX);
        
        // Umbral de 5px para diferenciar clic de arrastre
        if (dragDistance > 5) {
            track.setAttribute('data-is-dragging', 'true');
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            track.style.cursor = 'grab';
            
            // IMPORTANTE: Retraso de 150ms para que el evento 'click' 
            // alcance a leer el atributo 'true' antes de resetearlo
            setTimeout(() => {
                track.setAttribute('data-is-dragging', 'false');
            }, 150);
        }
    });

    // --- EVENTOS TÁCTILES (MÓVIL) ---
    
    track.addEventListener('touchstart', (e) => { 
        isDown = true; 
        dragDistance = 0;
        startX = e.touches[0].pageX; 
        scrollLeft = xPos; 
        track.setAttribute('data-is-dragging', 'false');
    }, { passive: true });

    track.addEventListener('touchmove', (e) => { 
        if(!isDown) return; 
        const x = e.touches[0].pageX; 
        const walk = (x - startX) * 1.2; 
        xPos = scrollLeft + walk;
        
        dragDistance = Math.abs(x - startX);
        if (dragDistance > 5) track.setAttribute('data-is-dragging', 'true');
    }, { passive: true });

    window.addEventListener('touchend', () => {
        if (isDown) {
            isDown = false;
            setTimeout(() => {
                track.setAttribute('data-is-dragging', 'false');
            }, 150);
        }
    });

    // Iniciar animación tras pequeño delay para calcular anchos correctamente
    setTimeout(() => { 
        trackWidth = track.scrollWidth / 2; 
        animate(); 
    }, 200);
}