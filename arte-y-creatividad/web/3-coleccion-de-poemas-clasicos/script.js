/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '3-poemas-clasicos.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderPoemas() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const poetsContainer = document.getElementById('poets-container');

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
        poetsContainer.innerHTML = ''; 

        // 3. Iterar y Renderizar las Tarjetas de Poetas
        data.poetas.forEach(poeta => {
            const poetCard = createPoetCard(poeta);
            poetsContainer.appendChild(poetCard);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar la Colección';
        mainDescription.textContent = 'Asegúrate de ejecutar la página con un servidor local.';
        poetsContainer.innerHTML = `<p style="color: red; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Crea el elemento de tarjeta (poet-card) para un autor.
 * @param {object} poeta - Objeto del poeta a renderizar.
 * @returns {HTMLElement} El elemento div de la tarjeta.
 */
function createPoetCard(poeta) {
    const card = document.createElement('article');
    card.className = 'poet-card';

    // Info del Poeta (título, nacionalidad, periodo)
    const poetInfo = document.createElement('div');
    poetInfo.className = 'poet-info';
    poetInfo.innerHTML = `
        <h2>${poeta.nombre_autor}</h2>
        <span>Nacionalidad: ${poeta.nacionalidad}</span>
        <span>Período: ${poeta.periodo}</span>
    `;
    card.appendChild(poetInfo);

    // Lista de Poemas
    const poemsList = document.createElement('ul');
    poemsList.className = 'poems-list';

    poeta.poemas.forEach(poema => {
        const item = createPoemItem(poema);
        poemsList.appendChild(item);
    });

    card.appendChild(poemsList);

    return card;
}

/**
 * Crea el elemento de lista (poem-item) para un poema individual.
 * @param {object} poema - Objeto del poema.
 * @returns {HTMLElement} El elemento li del poema.
 */
function createPoemItem(poema) {
    const listItem = document.createElement('li');
    listItem.className = 'poem-item';
    
    // El HTML dinámico para el item
    listItem.innerHTML = `
        <h3>${poema.titulo}</h3>
        <p class="extract">${poema.contenido_extracto}</p>
        <span class="reference">Referencia: ${poema.referencia_libro}</span>
    `;

    return listItem;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderPoemas);