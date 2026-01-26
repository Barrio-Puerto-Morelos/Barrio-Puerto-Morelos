/* scripts/stats.js */

export function initProgressBars() {
    // CAMBIO CLAVE: Ahora buscamos CUALQUIER elemento con el atributo data-current
    // Esto nos permite poner los datos en la tarjeta O en las barras individuales.
    const elements = document.querySelectorAll('[data-current]');

    elements.forEach(el => {
        const current = parseFloat(el.getAttribute('data-current'));
        const target = parseFloat(el.getAttribute('data-target'));

        if (!isNaN(current) && !isNaN(target)) {
            let percentage = (current / target) * 100;
            
            if (percentage > 100) percentage = 100;
            if (percentage < 0) percentage = 0;

            // Buscamos la barra y el texto DENTRO de este elemento específico
            const barFill = el.querySelector('.progress-fill');
            const percentageText = el.querySelector('.progress-text-label');

            if (barFill) {
                setTimeout(() => {
                    barFill.style.width = `${percentage}%`;
                }, 500);
            }

            if (percentageText) {
                percentageText.textContent = `${Math.round(percentage)}% completado`;
            }
        }
    });
}