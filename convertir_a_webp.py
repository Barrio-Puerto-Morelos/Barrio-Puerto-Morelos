import os
import io
from PIL import Image

def convertir_imagenes_a_webp(carpeta_origen, tamaño_objetivo_kb=300, borrar_originales=False):
    """
    Convierte imágenes a WebP ajustando dinámicamente la calidad para alcanzar un peso objetivo.
    """
    extensiones_validas = ('.jpg', '.jpeg', '.png')
    
    if not os.path.exists(carpeta_origen):
        print(f"❌ Error: La carpeta '{carpeta_origen}' no existe.")
        return

    print(f"📂 Buscando imágenes en: {carpeta_origen}...")
    contador = 0
    
    for nombre_archivo in os.listdir(carpeta_origen):
        if nombre_archivo.lower().endswith(extensiones_validas):
            ruta_completa = os.path.join(carpeta_origen, nombre_archivo)
            nombre_sin_ext = os.path.splitext(nombre_archivo)[0]
            ruta_nueva = os.path.join(carpeta_origen, f"{nombre_sin_ext}.webp")
            
            try:
                with Image.open(ruta_completa) as img:
                    # 1. Redimensionar si es absurdamente grande (Max 1600px ancho)
                    max_width = 1600
                    if img.width > max_width:
                        ratio = max_width / img.width
                        new_size = (max_width, int(img.height * ratio))
                        # Usamos LANCZOS, el mejor algoritmo de redimensionamiento
                        img = img.resize(new_size, Image.Resampling.LANCZOS)

                    # 2. Búsqueda binaria para encontrar la calidad perfecta
                    calidad_min = 10
                    calidad_max = 95
                    calidad_optima = 80 # Default
                    
                    while calidad_min <= calidad_max:
                        calidad_test = (calidad_min + calidad_max) // 2
                        buffer = io.BytesIO()
                        # method=6 le dice al motor WebP que use la compresión más lenta pero de mejor calidad
                        img.save(buffer, format="webp", quality=calidad_test, method=6)
                        peso_kb = buffer.tell() / 1024

                        if peso_kb <= tamaño_objetivo_kb:
                            calidad_optima = calidad_test
                            calidad_min = calidad_test + 1 # Intentamos subir la calidad a ver si aún cumple
                        else:
                            calidad_max = calidad_test - 1 # Pesa mucho, bajamos la calidad

                    # 3. Guardar la imagen final con la calidad ganadora
                    img.save(ruta_nueva, 'webp', quality=calidad_optima, method=6)
                    peso_final = os.path.getsize(ruta_nueva) / 1024
                    contador += 1
                    
                    print(f"✅ {nombre_archivo} -> {nombre_sin_ext}.webp | Calidad: {calidad_optima} | Peso: {peso_final:.1f} KB")
                
                # Borrar original si se requiere
                if borrar_originales and ruta_completa != ruta_nueva:
                    os.remove(ruta_completa)
                    print(f"   🗑️ Original eliminado.")
                    
            except Exception as e:
                print(f"⚠️ No se pudo convertir {nombre_archivo}: {e}")

    print("-" * 30)
    print(f"🚀 ¡Listo! Se comprimieron {contador} imágenes a WebP apuntando a {tamaño_objetivo_kb}KB.")

# --- EJECUCIÓN ---
if __name__ == "__main__":
    # Ajusta 'images' a la ruta de tu carpeta de prueba
    convertir_imagenes_a_webp("images", tamaño_objetivo_kb=300, borrar_originales=False)