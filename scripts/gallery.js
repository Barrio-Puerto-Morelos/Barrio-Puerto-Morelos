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

        photos.forEach(photo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="gallery-card" data-caption="${photo.caption}">
                    <div class="card-image-wrapper">
                        <img src="${photo.image}" alt="${photo.alt}" loading="lazy" class="draggable-img">
                        <div class="overlay-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                    </div>
                    <div class="card-footer">
                        <span>${photo.date}</span>
                        <strong>${photo.title}</strong>
                    </div>
                </div>`;
            galleryContainer.appendChild(li);
        });

        // Iniciamos la lógica de movimiento
        initDraggableMarquee(galleryContainer);

        // --- LÓGICA DE CLIC INTELIGENTE (Detectar Clic vs Arrastre) ---
        // Usaremos las variables globales que define initDraggableMarquee
        // Pero para el modal, lo más seguro es usar delegación aquí mismo.
        
        galleryContainer.addEventListener('click', (e) => {
            // Un atributo especial que pondremos si se arrastró mucho
            if (galleryContainer.getAttribute('data-is-dragging') === 'true') {
                return; // Fue un arrastre, no abrir modal
            }

            const card = e.target.closest('.gallery-card');
            if (card && modal) {
                const img = card.querySelector('img');
                const caption = card.getAttribute('data-caption');
                
                modalTitle.textContent = caption;
                modalBody.innerHTML = `<img src="${img.src}" style="max-width:100%; border-radius:8px;">`;
                modal.classList.add('show');
            }
        });

    } catch (error) { console.error('Error galería:', error); }
}

function initDraggableMarquee(track) {
    // 1. Clonar items para el infinito
    Array.from(track.children).forEach(item => {
        track.appendChild(item.cloneNode(true));
    });

    // 2. Variables
    let xPos = 0;
    let currentSpeed = 0.5;
    let isDown = false;
    let isHovering = false;
    let startX = 0;
    let scrollLeft = 0;
    let dragDistance = 0; // NUEVO: Para medir cuánto movió el mouse
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

    // Hover (Pausa)
    track.addEventListener('mouseenter', () => isHovering = true);
    track.addEventListener('mouseleave', () => { 
        isHovering = false; 
        // No forzamos isDown = false aquí para permitir arrastrar fuera del área si es necesario
    });
    
    // Iniciar arrastre
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        dragDistance = 0; // Reseteamos contador de distancia
        track.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = xPos;
        track.setAttribute('data-is-dragging', 'false'); // Asumimos que es clic al principio
    });

    // Mover
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        
        const x = e.pageX;
        const walk = (x - startX) * 1.5;
        xPos = scrollLeft + walk;

        // Calculamos cuánto se movió en total (valor absoluto)
        dragDistance = Math.abs(x - startX);

        // Si movió más de 5 píxeles, ya es un arrastre, no un clic
        if (dragDistance > 5) {
            track.setAttribute('data-is-dragging', 'true');
            // Desactivamos pointer-events en hijos MIENTRAS arrastramos para evitar parpadeos
            track.style.pointerEvents = 'auto'; 
        }
    });

    // Terminar arrastre (EN WINDOW para que detecte soltar en cualquier lado)
    window.addEventListener('mouseup', () => {
        if (isDown) {
            isDown = false;
            track.style.cursor = 'grab';
            
            // Pequeño timeout para resetear la bandera de arrastre
            // Esto permite que el evento 'click' lea el estado correcto antes de borrarlo
            setTimeout(() => {
                track.setAttribute('data-is-dragging', 'false');
            }, 50);
        }
    });

    // Soporte Táctil
    track.addEventListener('touchstart', (e) => { 
        isHovering = false; 
        isDown = true; 
        startX = e.touches[0].pageX; 
        scrollLeft = xPos; 
        dragDistance = 0;
        track.setAttribute('data-is-dragging', 'false');
    });
    
    window.addEventListener('touchend', () => { isDown = false; });
    
    track.addEventListener('touchmove', (e) => { 
        if(!isDown) return; 
        const x = e.touches[0].pageX; 
        const walk = (x - startX) * 1.5; 
        xPos = scrollLeft + walk;
        dragDistance = Math.abs(x - startX);
        if(dragDistance > 5) track.setAttribute('data-is-dragging', 'true');
    });

    setTimeout(() => { trackWidth = track.scrollWidth / 2; animate(); }, 100);
}