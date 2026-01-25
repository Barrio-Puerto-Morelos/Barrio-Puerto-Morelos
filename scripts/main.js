/* scripts/main.js */

import { initNavbarEffect } from './navbar.js';
import { initMobileMenu } from './menu.js';
import { initModals } from './modal.js';
import { initGallery } from './gallery.js'; // <--- 1. IMPORTAR

document.addEventListener('DOMContentLoaded', () => {
    
    // Iniciar Módulos
    initNavbarEffect();
    initMobileMenu();
    initModals();
    
    // Iniciar la Galería
    initGallery(); // <--- 2. EJECUTAR
    
    console.log('Sistema del Barrio cargado correctamente.');
});