/* scripts/main.js */

import { initNavbarEffect } from './navbar.js';
import { initMobileMenu } from './menu.js';
import { initModals } from './modal.js';
import { initGallery } from './gallery.js';
import { initScrollBtn } from './scroll.js'; // <--- 1. IMPORTAR

document.addEventListener('DOMContentLoaded', () => {
    
    initNavbarEffect();
    initMobileMenu();
    initModals();
    initGallery();
    initScrollBtn(); // <--- 2. INICIAR
    
    console.log('Sistema cargado.');
});