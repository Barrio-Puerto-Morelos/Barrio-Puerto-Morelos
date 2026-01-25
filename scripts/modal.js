export function initModals() {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Botón X de arriba
    const closeModal = document.querySelector('.close-modal');
    // Botón "Cerrar" de abajo (Nuevo)
    const closeBtnSecondary = document.querySelector('.btn-close-secondary'); 

    if (!modal) return; // Seguridad: Si no hay modal en el HTML, no hace nada

    // --- Función para CERRAR ---
    const hideModal = () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Reactiva el scroll de la página
    };

    // --- 1. Evento para ABRIR (Click en las tarjetas) ---
    document.querySelectorAll('.open-modal-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            // Extraer datos del HTML
            const title = button.getAttribute('data-title');
            const content = button.getAttribute('data-content');
            
            // Rellenar el modal
            if (modalTitle) modalTitle.textContent = title;
            if (modalBody) modalBody.innerHTML = content;
            
            // Mostrar
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Bloquea el scroll de fondo
        });
    });

    // --- 2. Eventos para CERRAR ---
    
    // Clic en la "X"
    if (closeModal) closeModal.addEventListener('click', hideModal);
    
    // Clic en el botón "Cerrar" de abajo
    if (closeBtnSecondary) closeBtnSecondary.addEventListener('click', hideModal);

    // Clic fuera de la tarjeta (en el fondo oscuro)
    window.addEventListener('click', (e) => {
        if (e.target == modal) hideModal();
    });

    // Tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) hideModal();
    });
}