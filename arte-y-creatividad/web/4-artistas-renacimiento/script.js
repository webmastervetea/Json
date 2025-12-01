/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '4-artistas-renacimiento.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderArt() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const movementsContainer = document.getElementById('movements-container');

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

        // Limpiar el mensaje de carga
        movementsContainer.innerHTML = ''; 

        // 3. Iterar y Renderizar los Movimientos Artísticos
        data.movimientos_artisticos.forEach(movement => {
            const movementSection = createMovementSection(movement);
            movementsContainer.appendChild(movementSection);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar la Colección Artística';
        mainDescription.textContent = 'Asegúrate de que el archivo JSON esté en la misma carpeta y de usar un servidor local.';
        movementsContainer.innerHTML = `<p style="color: red; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Crea la sección de un Movimiento Artístico.
 * @param {object} movement - Objeto del movimiento artístico.
 * @returns {HTMLElement} El elemento section del movimiento.
 */
function createMovementSection(movement) {
    const section = document.createElement('section');
    section.className = 'movement-section';

    section.innerHTML = `
        <h2>${movement.nombre}</h2>
        <span class="period">${movement.periodo}</span>
        <div class="artists-grid">
            </div>
    `;

    const artistsGrid = section.querySelector('.artists-grid');

    // Iterar y añadir las tarjetas de artistas
    movement.artistas.forEach(artist => {
        const artistCard = createArtistCard(artist);
        artistsGrid.appendChild(artistCard);
    });

    return section;
}

/**
 * Crea la tarjeta de un Artista.
 * @param {object} artist - Objeto del artista.
 * @returns {HTMLElement} El elemento article de la tarjeta.
 */
function createArtistCard(artist) {
    const card = document.createElement('article');
    card.className = 'artist-card';

    // Información del artista
    card.innerHTML = `
        <h3>${artist.nombre}</h3>
        <span class="nationality">Nacionalidad: ${artist.nacionalidad}</span>
        <p class="bio">${artist.biografia_corta}</p>
        
        <div class="works-list">
            <h4>Obras Clave:</h4>
            <ul class="works-items">
                </ul>
        </div>
    `;

    const worksList = card.querySelector('.works-items');

    // Lista de Obras Clave
    artist.obras_clave.forEach(work => {
        const item = document.createElement('li');
        item.className = 'work-item';
        item.innerHTML = `
            <span class="title">${work.titulo}</span>
            <span class="year">(${work.ano})</span>
        `;
        worksList.appendChild(item);
    });

    return card;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderArt);