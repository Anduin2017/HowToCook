# 📖 Plan Maestro: Recetario de Sabores Latinos

Este documento sirve como guía central para el agente de codificación "Jules" y futuros colaboradores. El objetivo es transformar este repositorio en la enciclopedia definitiva de la cocina latinoamericana, uniendo tradición, ciencia y comunidad.

---

## 🌎 1. Visión del Proyecto

La misión es crear un recetario digital, de código abierto y perpetuamente enriquecido que celebre la diversidad y riqueza de la gastronomía de América Latina. Cada receta no será solo una lista de pasos, sino un documento completo que incluya:

-   **Historia y Cultura:** El contexto y la importancia del plato.
-   **Instrucciones Claras:** Guías paso a paso, fáciles de seguir.
-   **Análisis Científico:** Perfiles nutricionales y compuestos bioactivos de los ingredientes.
-   **Sabiduría Colectiva:** Consejos, trucos y variaciones populares extraídas de la comunidad.
-   **Recursos Visuales:** Múltiples imágenes de alta calidad y enlaces a videos de referencia.

## 📁 2. Estructura de Carpetas

Para asegurar la escalabilidad y organización, todas las recetas se estructurarán por país. Cada receta tendrá su propia carpeta, que contendrá el archivo `.md` y una subcarpeta para imágenes.

```
/dishes/
├── /argentina/
│   ├── /asado/
│   │   ├── asado.md
│   │   └── /images/
│   └── /empanadas_tucumanas/
├── /mexico/
│   ├── /mole_poblano/
│   └── /tacos_al_pastor/
├── /peru/
│   ├── /ceviche/
│   └── /lomo_saltado/
└── ... (y así sucesivamente con cada país)
```

## 🛠️ 3. Metodología de Enriquecimiento de Recetas (Guía para Jules)

Cada receta debe ser desarrollada siguiendo estas cinco fases metodológicas:

### Fase 1: Selección y Estructura

1.  **Elegir un País:** Seleccionar un país para enfocar los esfuerzos (ej. Perú, México, Argentina).
2.  **Investigar Platos Emblemáticos:** Identificar entre 5 y 10 recetas icónicas que representen la diversidad de su cocina (entradas, platos fuertes, postres, bebidas).
3.  **Crear la Estructura:** Generar la estructura de carpetas y el archivo `.md` vacío para el primer plato seleccionado.

### Fase 2: Receta Base

1.  **Investigación Inicial:** Consultar múltiples fuentes (blogs de chefs reconocidos, videos populares, libros de cocina) para entender la receta a fondo.
2.  **Redacción del Contenido Base:** Poblar el archivo `.md` con:
    -   Un título atractivo con emojis (ej. `🇵🇪 Ceviche Clásico: Frescura y Tradición`).
    -   Una breve introducción sobre la historia y cultura del plato.
    -   Información general: Dificultad, tiempo de preparación, porciones.
    -   Lista de ingredientes detallada.
    -   Instrucciones paso a paso.
    -   Sección de variaciones y consejos iniciales.
    -   Marcadores de posición para al menos 2 imágenes.

### Fase 3: Análisis Científico

1.  **Identificar Ingredientes Clave:** Seleccionar los 5-8 ingredientes más importantes de la receta.
2.  **Investigación Nutricional:** Para cada ingrediente, buscar su perfil nutricional (calorías, macros, vitaminas, minerales) por 100g, citando fuentes fiables como el USDA.
3.  **Investigación de Compuestos Bioactivos:** Investigar y documentar compuestos de interés (ej. licopeno en tomates, capsaicina en chiles, antioxidantes en hierbas) y sus beneficios, enlazando a estudios o artículos científicos si es posible.

### Fase 4: Sabiduría Colectiva

1.  **Análisis de Comentarios:** Revisar secciones de comentarios en blogs de recetas populares y videos de YouTube sobre el plato.
2.  **Síntesis de Consejos:** Extraer y sintetizar los 3-5 consejos, trucos o variaciones más repetidos y útiles mencionados por la comunidad (ej. "_El secreto que muchos mencionan es usar jugo de limón recién exprimido_" o "_Una variación popular es añadir un toque de jengibre rallado_").

### Fase 5: Integración y Revisión Final

1.  **Crear la Sección de Análisis:** Añadir una nueva sección al final del `.md` llamada `🔬 Análisis Detallado y Sabiduría Colectiva`.
2.  **Integrar la Información:** Formatear y añadir toda la información recopilada en las fases 3 y 4 en esta nueva sección, asegurando que las fuentes y enlaces estén correctamente citados.
3.  **Añadir Imágenes:** Reemplazar los marcadores de posición con imágenes de alta calidad.
4.  **Revisión Final:** Leer todo el documento para asegurar coherencia, claridad y un formato impecable.

---

## 🚀 4. Plan de Acción Inicial (Primeros Pasos para Jules)

Para comenzar, se propone el siguiente plan de acción:

1.  **País de Inicio:** `Perú`.
2.  **Primera Receta:** `Ceviche Clásico`.
3.  **Ejecutar Fases:** Aplicar la metodología de enriquecimiento completa (Fases 1-5) para la receta de ceviche.
4.  **Segunda Receta:** Una vez completado el ceviche, continuar con `Lomo Saltado`.
5.  **Crear Plantilla:** Después de las dos primeras recetas, crear un archivo `template_receta.md` para estandarizar y agilizar el proceso futuro.
