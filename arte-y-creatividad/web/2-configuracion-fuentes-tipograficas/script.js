/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '2-tipografias-web.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderFonts() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const fontsContainer = document.getElementById('fonts-container');
    const weightDefinitionSection = document.getElementById('weight-definition');

    try {
        // 1. Cargar el JSON
        const response = await fetch(JSON_FILE);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // 2. Renderizar el Encabezado
        mainTitle.textContent = data.titulo;
        mainDescription.textContent = data.descripcion;

        // 3. Renderizar la Definición de Peso
        weightDefinitionSection.innerHTML = `
            <h2>Definición de Peso Tipográfico (${data.definicion_peso.ejemplo})</h2>
            <p>${data.definicion_peso.descripcion}</p>
        `;

        // Limpiar el mensaje de carga
        fontsContainer.innerHTML = ''; 

        // 4. Iterar y Renderizar las Tarjetas de Fuente
        data.fuentes_configuradas.forEach(font => {
            const fontCard = createFontCard(font);
            fontsContainer.appendChild(fontCard);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar la Configuración';
        mainDescription.textContent = 'Asegúrate de ejecutar la página con un servidor local.';
        fontsContainer.innerHTML = `<p style="color: red; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Crea el elemento de tarjeta (font-card) para una fuente.
 * @param {object} font - Objeto de la fuente a renderizar.
 * @returns {HTMLElement} El elemento div de la tarjeta.
 */
function createFontCard(font) {
    const card = document.createElement('div');
    card.className = 'font-card';

    // Construye la URL completa (útil para copiar)
    let urlCompleta = font.url_base;
    if (font.proveedor === 'Google Fonts') {
        const pesos = font.pesos_disponibles.map(p => p.peso).join(';');
        urlCompleta += `wght@${pesos}&display=swap`;
    }

    // Estructura básica de la tarjeta
    card.innerHTML = `
        <h2 style="font-family: '${font.nombre_fuente}', sans-serif;">${font.nombre_fuente} (${font.tipo})</h2>
        <p><strong>Proveedor:</strong> ${font.proveedor}</p>
        <p><strong>URL/Ruta Base:</strong> 
            <span class="url-text">${urlCompleta}</span>
        </p>
        
        <div class="weights-container">
            <h3>Pesos Disponibles (font-weight)</h3>
            <div id="weights-list-${font.nombre_fuente.replace(/\s/g, '-')}">
                </div>
        </div>
        
        <p class="note">Nota: ${font.nota}</p>
    `;

    const weightsList = card.querySelector(`#weights-list-${font.nombre_fuente.replace(/\s/g, '-')}`);

    // Inyectar los pesos disponibles
    font.pesos_disponibles.forEach(weight => {
        const item = document.createElement('div');
        item.className = 'weight-item';
        
        // Aplica el estilo de fuente y el peso para la muestra.
        // Nota: Solo funcionará para Roboto y Playfair Display que cargamos en index.html
        // y para fuentes de sistema (Courier New).
        item.innerHTML = `
            <span>${weight.peso}</span>
            <span>${weight.nombre_estilo}</span>
            <div class="weight-sample" style="font-family: '${font.nombre_fuente}', sans-serif; font-weight: ${weight.peso};">
                Muestra de Texto (Peso ${weight.peso})
            </div>
        `;
        weightsList.appendChild(item);
    });

    return card;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderFonts);