/**
 * Nombre del archivo JSON a cargar.
 */
const JSON_FILE = '9-comics-personajes.json';

/**
 * Función para crear y rellenar la tarjeta de un personaje.
 * @param {object} character - Objeto de personaje con sus propiedades.
 * @returns {HTMLElement} El elemento article de la tarjeta.
 */
function createCharacterCard(character) {
    const card = document.createElement('article');
    card.className = 'character-card';

    // Lista de poderes (HTML)
    const powersHtml = character.poderes
        .map(power => `<li>${power}</li>`)
        .join('');

    // Construcción completa de la tarjeta
    card.innerHTML = `
        <h2>${character.nombre_personaje}</h2>
        <span class="universe-tag">${character.universo}</span>
        
        <h3>Superpoderes:</h3>
        <ul class="powers-list">
            ${powersHtml}
        </ul>

        <p class="character-note">
            Nota: ${character.nota}
        </p>
    `;

    return card;
}

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderCharacters() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const mainSource = document.getElementById('main-source');
    const charactersContainer = document.getElementById('characters-container');

    try {
        // 1. Cargar el JSON usando Fetch API
        const response = await fetch(JSON_FILE);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}. Asegúrese de usar un servidor local.`);
        }
        const data = await response.json();

        // 2. Renderizar el Encabezado
        mainTitle.textContent = data.titulo;
        mainDescription.textContent = data.descripcion;
        mainSource.textContent = `Fuente Primaria: ${data.fuente_primaria}`;

        // Limpiar el mensaje de carga
        charactersContainer.innerHTML = ''; 

        // 3. Iterar y Renderizar las Tarjetas de Personajes
        data.personajes_con_poderes.forEach(character => {
            const characterCard = createCharacterCard(character);
            charactersContainer.appendChild(characterCard);
        });

    } catch (error) {
        // Manejo de errores en caso de fallo de carga
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'ERROR CÓMICS: No se pudo cargar el archivo.';
        mainDescription.textContent = 'Verifique el nombre del archivo JSON y las instrucciones de ejecución.';
        charactersContainer.innerHTML = `<p style="color: var(--secondary-color); padding: 20px;">Error: ${error.message}</p>`;
    }
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderCharacters);