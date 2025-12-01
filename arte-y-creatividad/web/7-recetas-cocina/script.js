/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '7-recetas-cocina.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderRecipes() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const versionTag = document.getElementById('version-tag');
    const recipesContainer = document.getElementById('recipes-container');

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
        versionTag.textContent = `Versión: ${data.version}`;

        // Limpiar el mensaje de carga
        recipesContainer.innerHTML = ''; 

        // 3. Iterar y Renderizar las Recetas
        data.recetas.forEach(recipe => {
            const recipeCard = createRecipeCard(recipe);
            recipesContainer.appendChild(recipeCard);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar el Libro de Recetas';
        mainDescription.textContent = 'Asegúrate de que el archivo JSON esté en la misma carpeta y de usar un servidor local.';
        recipesContainer.innerHTML = `<p style="color: red; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Crea la tarjeta completa para una Receta.
 * @param {object} recipe - Objeto de la receta.
 * @returns {HTMLElement} El elemento div de la tarjeta de receta.
 */
function createRecipeCard(recipe) {
    const card = document.createElement('article');
    card.className = 'recipe-card';
    card.id = recipe.id_receta;

    // Iniciar la estructura de la tarjeta
    card.innerHTML = `
        <h2>${recipe.nombre_plato}</h2>
        
        <div class="metadata">
            <div class="meta-item">
                <strong>${recipe.porciones}</strong>
                <span>Porciones</span>
            </div>
            <div class="meta-item">
                <strong>${recipe.tiempo_total_min}</strong>
                <span>Tiempo Total (min)</span>
            </div>
            <div class="meta-item">
                <strong>${recipe.id_receta}</strong>
                <span>ID Receta</span>
            </div>
        </div>
        
        <h3 class="section-title">Ingredientes</h3>
        <ul class="ingredients-list">
            ${recipe.ingredientes.map(ing => `
                <li class="ingredient-item">
                    <span class="ingredient-name">${ing.nombre}</span>
                    <span class="ingredient-qty">${ing.cantidad} ${ing.unidad}</span>
                </li>
            `).join('')}
        </ul>

        <h3 class="section-title">Pasos de Preparación</h3>
        <ol class="steps-list">
            ${recipe.pasos.map(step => `
                <li>${step.replace(/^\d+\.\s*/, '')}</li>
            `).join('')}
        </ol>
    `;

    return card;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderRecipes);