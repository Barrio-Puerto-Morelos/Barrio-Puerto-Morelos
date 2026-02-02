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

        // 1. GENERAR HTML (Corregido: Imagen interactiva pero no arrastrable por el navegador)
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
        // Usamos un listener en el contenedor que delega a las tarjetas
        galleryContainer.addEventListener('click', (e) => {
            // Si el sistema detectó que estábamos arrastrando, NO abrimos el modal
            if (galleryContainer.getAttribute('data-is-dragging') === 'true') {
                return; 
            }

            // Buscar si el clic fue en una tarjeta
            const card = e.target.closest('.gallery-card');
            if (card && modal) {
                const img = card.querySelector('img');
                const caption = card.getAttribute('data-caption');
                
                if (img) {
                    modalTitle.textContent = caption;
                    modalBody.innerHTML = `<img src="${img.src}" style="max-width:100%; border-radius:8px;">`;
                    modal.classList.add('show');
                }
            }
        });

    } catch (error) { console.error('Error galería:', error); }
}

function initDraggableMarquee(track) {
    // Duplicar items
    Array.from(track.children).forEach(item => {
        track.appendChild(item.cloneNode(true));
    });

    let xPos = 0;
    let currentSpeed = 0.5;
    let isDown = false;
    let isHovering = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragDistance = 0; // Medidor de distancia
    let trackWidth = track.scrollWidth / 2;

    const animate = () => {
        if (!isDown && !isHovering) xPos -= currentSpeed;
        if (Math.abs(xPos) >= trackWidth) xPos = 0;
        if (xPos > 0) xPos = -trackWidth;
        
        track.style.transform = `translateX(${xPos}px)`;
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => trackWidth = track.scrollWidth / 2);

    // --- EVENTOS ---

    // Hover: Pausar animación
    track.addEventListener('mouseenter', () => isHovering = true);
    track.addEventListener('mouseleave', () => isHovering = false);

    // INICIO ARRASTRE
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        dragDistance = 0; // Reiniciamos contador
        track.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = xPos;
        track.setAttribute('data-is-dragging', 'false'); // Asumimos clic al inicio
    });

    // MOVIMIENTO
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX;
        const walk = (x - startX) * 1.5;
        xPos = scrollLeft + walk;

        // Calculamos cuánto se movió realmente
        dragDistance = Math.abs(x - startX);
        
        // Si se movió más de 5 pixeles, declaramos que es un ARRASTRE
        if (dragDistance > 5) {
            track.setAttribute('data-is-dragging', 'true');
        }
    });

    // FIN ARRASTRE (Usamos window para detectar si sueltas fuera de la galería)
    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            track.style.cursor = 'grab';
            
            // Retrasamos un poco el cambio de estado para que el evento 'click' 
            // le dé tiempo de leer que fue un arrastre
            setTimeout(() => {
                track.setAttribute('data-is-dragging', 'false');
            }, 50);
        }
    });

    // SOPORTE TÁCTIL (Móvil)
    track.addEventListener('touchstart', (e) => { 
        isHovering = false; 
        isDown = true; 
        dragDistance = 0;
        startX = e.touches[0].pageX; 
        scrollLeft = xPos; 
        track.setAttribute('data-is-dragging', 'false');
    });
    
    window.addEventListener('touchend', () => { isDown = false; });
    
    track.addEventListener('touchmove', (e) => { 
        if(!isDown) return; 
        const x = e.touches[0].pageX; 
        const walk = (x - startX) * 1.5; 
        xPos = scrollLeft + walk;
        
        dragDistance = Math.abs(x - startX);
        if (dragDistance > 5) track.setAttribute('data-is-dragging', 'true');
    });

    // Arrancar
    setTimeout(() => { trackWidth = track.scrollWidth / 2; animate(); }, 100);
}