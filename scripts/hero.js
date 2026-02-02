/* scripts/hero.js */

export function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    
    // Si no hay slides, no hacemos nada
    if (slides.length === 0) return;

    let currentSlide = 0;
    const slideInterval = 13000; // 5 segundos por imagen

    const nextSlide = () => {
        // 1. Ocultar actual
        slides[currentSlide].classList.remove('active');

        // 2. Calcular siguiente (bucle)
        currentSlide = (currentSlide + 1) % slides.length;

        // 3. Mostrar nueva
        const next = slides[currentSlide];
        next.classList.add('active');

        // 4. Si es video, forzar Play desde el inicio
        const video = next.querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(e => console.log("Autoplay bloqueado (normal en móviles si no hay interacción)", e));
        }
    };

    // Iniciar el ciclo
    setInterval(nextSlide, slideInterval);
}