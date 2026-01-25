/* scripts/scroll.js */

export function initScrollBtn() {
    const btn = document.getElementById('scrollTopBtn');

    if (!btn) return;

    // 1. Detectar el Scroll para mostrar/ocultar
    window.addEventListener('scroll', () => {
        // Si bajamos más de 300px, aparece el botón
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    // 2. Acción al hacer click (Subir suave)
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // ¡La magia del deslizamiento suave!
        });
    });
}