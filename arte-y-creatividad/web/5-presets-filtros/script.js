/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '5-presets-filtros.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderFilters() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const unitsContainer = document.getElementById('units-container');
    const mainParamsContainer = document.getElementById('main-params-container');
    const additionalParamsContainer = document.getElementById('additional-params-container');

    try {
        // 1. Cargar el JSON usando Fetch API
        const response = await fetch(JSON_FILE);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // 2. Renderizar el Encabezado
        mainTitle.textContent = data.titulo;
        mainDescription.textContent = data.descripcion;

        // 3. Renderizar Unidades Base
        renderUnits(data.unidades_base, unitsContainer);

        // 4. Renderizar Parámetros Principales
        data.parametros_principales.forEach(param => {
            const card = createParamCard(param);
            mainParamsContainer.appendChild(card);
        });

        // 5. Renderizar Parámetros Adicionales
        data.parametros_adicionales.forEach(param => {
            const card = createParamCard(param);
            additionalParamsContainer.appendChild(card);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar Parámetros';
        mainDescription.textContent = 'Asegúrate de ejecutar la página con un servidor local.';
        unitsContainer.parentElement.innerHTML = `<p style="color: red; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Renderiza las unidades base en el contenedor especificado.
 */
function renderUnits(units, container) {
    container.innerHTML = '';
    for (const key in units) {
        if (units.hasOwnProperty(key)) {
            const unitItem = document.createElement('div');
            unitItem.className = 'unit-item';
            
            // Formatea la clave para que se vea bien (ej: 'brillo_contraste_exposicion' -> 'Brillo, Contraste, Exposición')
            const formattedKey = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            unitItem.innerHTML = `
                <strong>${formattedKey}</strong>
                <p>${units[key]}</p>
            `;
            container.appendChild(unitItem);
        }
    }
}


/**
 * Crea la tarjeta (param-card) para un parámetro de filtro.
 * @param {object} param - Objeto del parámetro de filtro.
 * @returns {HTMLElement} El elemento article de la tarjeta.
 */
function createParamCard(param) {
    const card = document.createElement('article');
    card.className = 'param-card';

    const [min, max] = param.rango_valor;

    // Estructura de la tarjeta
    card.innerHTML = `
        <h3>${param.nombre_parametro}</h3>
        <span class="code-tag">${param.etiqueta_codigo}</span>
        
        <div class="details">
            <p><strong>Rango de Valor:</strong> ${min} a ${max}</p>
            <p><strong>Valor por Defecto:</strong> ${param.valor_defecto}</p>
        </div>
        
        <p class="description">${param.descripcion}</p>
    `;

    return card;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderFilters);