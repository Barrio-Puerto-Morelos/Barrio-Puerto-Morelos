const fs = require('fs');
const path = require('path');
const sharp = require('sharp'); // <- Agregamos el compresor

const carpetaPropiedad = 'maracaibo-34'; 
const nombreSEO = 'Casa en Venta Puerto Morelos Residencial El Faro, México'; 

// Rutas basadas en la estructura
const rutaImagenes = path.join('./images', carpetaPropiedad);
const rutaRaiz = './'; 

function generarSlug(texto) {
    return texto.toString().toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

const slugBase = generarSlug(nombreSEO);

// Envolvemos todo en una función asíncrona porque la compresión toma tiempo
async function optimizarPropiedad() {
    let mapaReemplazos = {};
    let contenidoCSV = "Archivo,Alt_Text\n";

    // 1. Leer imágenes en la subcarpeta
    const archivos = fs.readdirSync(rutaImagenes);
    const imagenes = archivos
        .filter(archivo => {
            const ext = path.extname(archivo).toLowerCase();
            return ext === '.webp' || ext === '.jpg' || ext === '.jpeg' || ext === '.png';
        })
        .sort();

    console.log(`\n🔄 Comprimiendo y renombrando imágenes en /images/${carpetaPropiedad}...`);
    
    // 2. Procesar imágenes una por una
    for (let index = 0; index < imagenes.length; index++) {
        const archivoViejo = imagenes[index];
        const numero = (index + 1).toString().padStart(2, '0');
        
        // Forzamos la extensión a .webp para el archivo final
        const archivoNuevo = `${slugBase}-${numero}.webp`; 
        
        const rutaViejaFisica = path.join(rutaImagenes, archivoViejo);
        const rutaNuevaFisica = path.join(rutaImagenes, archivoNuevo);

        // Guardar para el reemplazo en HTML/JSON
        const rutaViejaHTML = `images/${carpetaPropiedad}/${archivoViejo}`;
        const rutaNuevaHTML = `images/${carpetaPropiedad}/${archivoNuevo}`;
        mapaReemplazos[rutaViejaHTML] = rutaNuevaHTML;

        try {
            // MAGIA DE COMPRESIÓN CON SHARP
            await sharp(rutaViejaFisica)
                .resize({ width: 1600, withoutEnlargement: true }) // Máximo 1600px de ancho
                .webp({ quality: 80 }) // Calidad al 80% (excelente para web)
                .toFile(rutaNuevaFisica);

            // Si el nombre o extensión cambió, borramos el original pesado para ahorrar espacio
            if (rutaViejaFisica !== rutaNuevaFisica) {
                fs.unlinkSync(rutaViejaFisica);
            }

            // Agregar al CSV
            contenidoCSV += `${archivoNuevo},"${nombreSEO} - Imagen ${numero}"\n`;
            console.log(`✅ ${archivoViejo} -> comprimido a -> ${archivoNuevo}`);
        } catch (error) {
            console.error(`❌ Error al comprimir ${archivoViejo}:`, error);
        }
    }

    // Guardar CSV
    fs.writeFileSync(path.join(rutaImagenes, 'seo-alt-texts.csv'), contenidoCSV);
    console.log(`📄 CSV de Textos ALT generado exitosamente.`);

    /* ==============================
       ACTUALIZAR JSON
    ============================== */
    console.log('\n📝 Actualizando forSale.json...');
    const rutaJson = path.join(rutaRaiz, 'data/forSale.json');

    if (fs.existsSync(rutaJson)) {
        let contenidoJson = fs.readFileSync(rutaJson, 'utf8');
        let jsonModificado = false;

        Object.entries(mapaReemplazos).forEach(([viejo, nuevo]) => {
            if (contenidoJson.includes(viejo)) {
                contenidoJson = contenidoJson.split(viejo).join(nuevo);
                jsonModificado = true;
            }
        });

        if (jsonModificado) {
            fs.writeFileSync(rutaJson, contenidoJson, 'utf8');
            console.log(`✅ Nombres y extensiones actualizados exitosamente en: forSale.json`);
        } else {
            console.log(`ℹ️ No se encontraron coincidencias en el JSON.`);
        }
    } else {
        console.log(`❌ Error: No se encontró el archivo forSale.json`);
    }

    console.log('\n🚀 PROCESO COMPLETADO AL 100%');
}

// Ejecutar la función principal
optimizarPropiedad();