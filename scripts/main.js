/* scripts/main.js */

import { initNavbarEffect } from './navbar.js';
import { initMobileMenu } from './menu.js';
import { initModals } from './modal.js';
import { initGallery } from './gallery.js';
import { initScrollBtn } from './scroll.js';
import { initProgressBars } from './stats.js';

document.addEventListener('DOMContentLoaded', () => {
    
    initNavbarEffect();
    initMobileMenu();
    initModals();
    initGallery();
    initScrollBtn(); 
    initProgressBars();
    
    console.log('Sistema cargado.');
});