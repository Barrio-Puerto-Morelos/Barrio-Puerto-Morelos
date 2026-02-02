/* scripts/main.js */

import { initNavbarEffect } from './navbar.js';
import { initMobileMenu } from './menu.js';
import { initModals } from './modal.js';
import { initGallery } from './gallery.js';
import { initScrollBtn } from './scroll.js';
import { initProgressBars } from './stats.js';
import { initHeroSlider } from './hero.js';

document.addEventListener('DOMContentLoaded', () => {
    
    initNavbarEffect();
    initMobileMenu();
    initModals();
    initGallery();
    initScrollBtn(); 
    initProgressBars();
    initHeroSlider();
    
    console.log('Sistema cargado.');
});