export function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Verificamos que los elementos existan para evitar errores
    if (!menuToggle || !navLinks) return;

    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Cambio de icono (Hamburguesa <-> X)
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });
    
    // Opcional: Cerrar menú al hacer clic en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
             navLinks.classList.remove('active');
             icon.classList.remove('fa-xmark');
             icon.classList.add('fa-bars');
        });
    });
}