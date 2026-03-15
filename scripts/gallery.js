/* scripts/gallery.js */

export async function initGallery() {
    const galleryContainer = document.getElementById('gallery-container');
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!galleryContainer) return;

    // 1. CARGAR DATOS JSON
    try {
        const response = await fetch('data/gallery.json');
        const photos = await response.json();

        photos.forEach(photo => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="gallery-card" data-caption="${photo.caption}">
                    <div class="card-image-wrapper">
                        <img src="${photo.image}" alt="${photo.alt}" loading="lazy">
                        <div class="overlay-zoom"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
                    </div>
                    <div class="card-footer">
                        <span>${photo.date}</span>
                        <strong>${photo.title}</strong>
                    </div>
                </div>`;
            galleryContainer.appendChild(li);
        });

        // Iniciar el movimiento suave
        initSimpleMarquee(galleryContainer);

    } catch (error) { console.error('Error galería:', error); }

    // 2. LÓGICA DEL ZOOM (Click súper limpio)
    galleryContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.gallery-card');
        if (card && modal) {
            e.preventDefault();
            const img = card.querySelector('img');
            const caption = card.getAttribute('data-caption');
            
            if (img) {
                if (modalTitle) modalTitle.textContent = caption;
                if (modalBody) modalBody.innerHTML = `<img src="${img.src}" style="max-width:100%; border-radius:8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">`;
                modal.classList.add('show');
            }
        }
    });
}

function initSimpleMarquee(track) {
    // Clonamos para el efecto infinito
    Array.from(track.children).forEach(item => {
        track.appendChild(item.cloneNode(true));
    });

    let xPos = 0;
    const speed = 0.5; // Modifica este número si lo quieres más rápido o lento (ej. 0.8)
    let isPaused = false;
    let trackWidth = track.scrollWidth / 2;

    // El motor que mueve todo cuadro por cuadro
    const animate = () => {
        if (!isPaused) {
            xPos -= speed;
        }

        // Si llegamos al final de la primera mitad, reiniciamos sin que se note
        if (Math.abs(xPos) >= trackWidth) xPos = 0;
        if (xPos > 0) xPos = -trackWidth; // Por si le dan a la flecha izquierda

        track.style.transform = `translateX(${xPos}px)`;
        requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => trackWidth = track.scrollWidth / 2);

    // PAUSA AL PASAR EL RATÓN
    track.addEventListener('mouseenter', () => isPaused = true);
    track.addEventListener('mouseleave', () => isPaused = false);

    // CONTROL DE FLECHAS
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const skipAmount = 300; // Píxeles que avanza al hacer clic en una flecha

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            xPos += skipAmount;
        });
    }
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            xPos -= skipAmount;
        });
    }

    // Iniciar animación
    setTimeout(() => { trackWidth = track.scrollWidth / 2; animate(); }, 100);
}