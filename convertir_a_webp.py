import os
from PIL import Image

def convertir_imagenes_a_webp(carpeta_origen, calidad=80, borrar_originales=False):
    """
    Convierte todas las imágenes (JPG, JPEG, PNG) de una carpeta a WebP.
    
    :param carpeta_origen: Ruta de la carpeta donde están las fotos (ej: "images")
    :param calidad: Calidad de compresión (1-100). 80 es un buen balance.
    :param borrar_originales: Si es True, borra el archivo JPG después de convertir.
    """
    
    # Extensiones que queremos buscar
    extensiones_validas = ('.jpg', '.jpeg', '.png')
    
    # Verificamos que la carpeta exista
    if not os.path.exists(carpeta_origen):
        print(f"❌ Error: La carpeta '{carpeta_origen}' no existe.")
        return

    print(f"📂 Buscando imágenes en: {carpeta_origen}...")
    
    contador = 0
    
    # Recorremos todos los archivos de la carpeta
    for nombre_archivo in os.listdir(carpeta_origen):
        if nombre_archivo.lower().endswith(extensiones_validas):
            
            ruta_completa = os.path.join(carpeta_origen, nombre_archivo)
            nombre_sin_ext = os.path.splitext(nombre_archivo)[0]
            ruta_nueva = os.path.join(carpeta_origen, f"{nombre_sin_ext}.webp")
            
            try:
                # Abrimos la imagen
                with Image.open(ruta_completa) as img:
                    # Convertimos y guardamos en WebP
                    print(f"🔄 Convirtiendo: {nombre_archivo} -> {nombre_sin_ext}.webp")
                    img.save(ruta_nueva, 'webp', quality=calidad, optimize=True)
                    contador += 1
                
                # Opcional: Borrar el archivo viejo
                if borrar_originales:
                    os.remove(ruta_completa)
                    print(f"🗑️ Original eliminado: {nombre_archivo}")
                    
            except Exception as e:
                print(f"⚠️ No se pudo convertir {nombre_archivo}: {e}")

    print("-" * 30)
    print(f"✅ ¡Listo! Se convirtieron {contador} imágenes a WebP.")

# --- EJECUCIÓN ---
if __name__ == "__main__":
    # Ajusta 'images' si tu carpeta se llama diferente
    convertir_imagenes_a_webp("images", calidad=80, borrar_originales=False)