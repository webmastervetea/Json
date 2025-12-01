/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '8-instrumentos-musicales.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderInstruments() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const familiesContainer = document.getElementById('families-container');

    try {
        // 1. Cargar el JSON usando Fetch API (ES6+)
        const response = await fetch(JSON_FILE);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // 2. Renderizar el Encabezado
        mainTitle.textContent = data.titulo;
        mainDescription.textContent = data.descripcion;

        // Limpiar el mensaje de carga
        familiesContainer.innerHTML = ''; 

        // 3. Iterar y Renderizar las Tarjetas de Familia
        data.familias_instrumentales.forEach(family => {
            const familyCard = createFamilyCard(family);
            familiesContainer.appendChild(familyCard);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar la Clasificación de Instrumentos';
        mainDescription.textContent = 'Asegúrate de ejecutar la página con un servidor local.';
        familiesContainer.innerHTML = `<p style="color: #F44336; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Crea la tarjeta completa para una Familia Instrumental.
 * @param {object} family - Objeto de la familia instrumental.
 * @returns {HTMLElement} El elemento article de la tarjeta.
 */
function createFamilyCard(family) {
    const card = document.createElement('article');
    card.className = 'family-card';

    // Contenido base de la tarjeta
    card.innerHTML = `
        <h2>${family.familia}</h2>
        <p>${family.descripcion}</p>
        <div class="subcategories-list">
            <h3>Ejemplos:</h3>
        </div>
    `;

    const subListContainer = card.querySelector('.subcategories-list');

    // Manejar Subcategorías (Cuerda, Viento, Percusión)
    if (family.subcategorias && family.subcategorias.length > 0) {
        family.subcategorias.forEach(sub => {
            const subDiv = document.createElement('div');
            // Listado de instrumentos como etiquetas (tags)
            const instrumentTagsHtml = sub.ejemplos.map(inst => `<li>${inst}</li>`).join('');
            
            subDiv.innerHTML = `
                <strong>${sub.tipo}</strong>
                <ul class="instrument-tags">${instrumentTagsHtml}</ul>
            `;
            subListContainer.appendChild(subDiv);
        });
    } 
    // Manejar Ejemplos Directos (Teclado, Electrófonos)
    else if (family.ejemplos && family.ejemplos.length > 0) {
        const instrumentTagsHtml = family.ejemplos.map(inst => `<li>${inst}</li>`).join('');
        subListContainer.innerHTML += `
            <ul class="instrument-tags">${instrumentTagsHtml}</ul>
        `;
    } else {
        subListContainer.innerHTML = '<p class="text-light">No hay ejemplos listados.</p>';
    }

    return card;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderInstruments);