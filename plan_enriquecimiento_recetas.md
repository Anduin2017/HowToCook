# Plan Detallado para el Enriquecimiento de Recetas Colombianas

**Objetivo:** Transformar cada archivo de receta `.md` en una ficha técnica culinaria exhaustiva. Cada receta deberá incluir no solo las instrucciones, sino también un análisis nutricional detallado por ingrediente, información sobre compuestos bioactivos, y una síntesis de los comentarios y consejos de la comunidad de cocineros en línea.

**Agente Designado:** Cascade

---

### **Fase 1: Actualización de la Estructura del Archivo `.md`**

Se añadirá una nueva sección principal al final de cada archivo de receta, justo antes de la galería de imágenes.

**Nueva Sección Propuesta:**

```markdown
### 🔬 Análisis Nutricional y Comentarios

Esta sección desglosa el perfil nutricional de los ingredientes clave y resume los consejos y variaciones aportados por la comunidad.

#### Análisis por Ingrediente

**[Nombre del Ingrediente 1] (Ej: Frijoles Rojos)**
*   **Perfil Nutricional (por porción de 100g cocidos):**
    *   Calorías: `X kcal`
    *   Proteínas: `Y g`
    *   Carbohidratos: `Z g`
    *   Grasas: `A g`
*   **Compuestos Bioactivos y Vitaminas:**
    *   Vitaminas: `[Lista de vitaminas relevantes, ej: Folato (B9)]`
    *   Minerales: `[Lista de minerales, ej: Hierro, Magnesio]`
    *   Otros: `[Antioxidantes, fibra, etc.]`
*   **Fuentes de Investigación:**
    *   [Fuente 1](URL)
    *   [Fuente 2](URL)

**[Nombre del Ingrediente 2] (Ej: Aguacate)**
*   **Perfil Nutricional (por porción de 100g):**
    *   ...
*   **Compuestos Bioactivos y Vitaminas:**
    *   ...
*   **Fuentes de Investigación:**
    *   ...

#### 💬 Síntesis de Comentarios de la Comunidad

*   **Consejos Populares:**
    *   `[Resumen de los 2-3 consejos más repetidos por los usuarios, ej: "Dejar los frijoles en remojo por 24h en lugar de 12h para una mejor cocción."]`
*   **Variaciones Comunes:**
    *   `[Lista de las variaciones más sugeridas, ej: "Añadir un poco de panela a los frijoles para un toque dulce."]`
*   **Fuentes de Comentarios:**
    *   [Receta en `sitio_web_1.com`](URL)
    *   [Video-receta en `youtube.com`](URL)
```

---

### **Fase 2: Plan de Ejecución para la Primera Receta (`bandeja_paisa.md`)**

El agente seguirá este proceso de manera sistemática:

1.  **Selección de Ingredientes Clave:** Para la Bandeja Paisa, los ingredientes a analizar serán: `Frijoles Rojos`, `Arroz`, `Carne Molida`, `Chorizo`, `Aguacate`, `Plátano Maduro`.

2.  **Investigación por Ingrediente (Bucle):**
    *   Para cada ingrediente, realizar búsquedas web específicas:
        *   `"perfil nutricional de [ingrediente] por 100g"`
        *   `"vitaminas y compuestos bioactivos en [ingrediente]"`
    *   **Fuentes Prioritarias:** Se dará preferencia a bases de datos nutricionales (como USDA FoodData Central), publicaciones de salud reconocidas y artículos científicos.
    *   **Recopilación:** Extraer los datos numéricos para el perfil nutricional y una lista de 2-3 compuestos/vitaminas destacadas. Guardar las URLs de las fuentes.

3.  **Investigación de Comentarios:**
    *   Realizar una búsqueda web de `"receta bandeja paisa comentarios"` o `"mejor receta bandeja paisa"`.
    *   Seleccionar 2-3 fuentes populares (blogs de cocina, YouTube, sitios de recetas) que tengan una sección de comentarios activa.
    *   Leer y analizar los comentarios para identificar patrones, consejos recurrentes y variaciones sugeridas.
    *   Sintetizar los hallazgos en 2-3 puntos clave y guardar las URLs de las fuentes.

4.  **Integración en el `.md`:**
    *   Abrir el archivo `bandeja_paisa.md`.
    *   Construir la nueva sección `🔬 Análisis Nutricional y Comentarios` utilizando la plantilla definida.
    *   Poblar la sección con toda la información investigada, incluyendo los enlaces a las fuentes.

5.  **Revisión y Finalización:**
    *   Releer el archivo completo para asegurar la coherencia, el formato correcto y que todos los enlaces funcionen.

---

Este plan establece un flujo de trabajo claro y riguroso para enriquecer cada receta de manera significativa. Una vez completada la Bandeja Paisa, el mismo proceso se aplicará a las recetas siguientes.
