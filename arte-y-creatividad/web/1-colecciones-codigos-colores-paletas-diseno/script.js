/**
 * Nombre del archivo JSON. Debe estar en el mismo directorio.
 */
const JSON_FILE = 'paletas-colores.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderPalettes() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const container = document.getElementById('palettes-container');

    try {
        // 1. Cargar el JSON usando la API Fetch (ES6+)
        const response = await fetch(JSON_FILE);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // 2. Renderizar el Encabezado
        mainTitle.textContent = data.titulo;
        mainDescription.textContent = data.descripcion_paletas;

        // Limpiar el mensaje de carga
        container.innerHTML = ''; 

        // 3. Iterar y Renderizar las Paletas
        data.paletas.forEach(palette => {
            const paletteCard = createPaletteCard(palette, data.formato_principal);
            container.appendChild(paletteCard);
        });

    } catch (error) {
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar Paletas';
        mainDescription.textContent = 'Hubo un problema. Asegúrate de que el archivo ' + JSON_FILE + ' existe y es accesible.';
        container.innerHTML = `<p style="color: red; padding: 20px;">${error.message}</p>`;
    }
}

/**
 * Crea el elemento de tarjeta (palette-card) para una colección.
 * @param {object} palette - Objeto de la colección de paletas.
 * @param {string} format - Formato principal (e.g., 'HEX').
 * @returns {HTMLElement} El elemento div de la tarjeta.
 */
function createPaletteCard(palette, format) {
    const card = document.createElement('div');
    card.className = 'palette-card';

    // Título y Tema
    card.innerHTML = `
        <h2>${palette.nombre_coleccion}</h2>
        <p class="theme">Tema: ${palette.tema}</p>
        <ul class="colors-list">
        </ul>
    `;
    
    const colorsList = card.querySelector('.colors-list');

    // Lista de Colores
    palette.colores.forEach(color => {
        const listItem = createColorItem(color, format);
        colorsList.appendChild(listItem);
    });

    return card;
}

/**
 * Crea el elemento de lista (color-item) para un color individual.
 * @param {object} color - Objeto de color con nombre, hex y rgb.
 * @param {string} format - Formato principal.
 * @returns {HTMLElement} El elemento li del color.
 */
function createColorItem(color, format) {
    const listItem = document.createElement('li');
    listItem.className = 'color-item';

    // Determina qué código mostrar por defecto (HEX o RGB)
    const codeToShow = format === 'HEX' ? color.hex : color.rgb;
    
    // El HTML dinámico para el item
    listItem.innerHTML = `
        <div class="color-swatch" style="background-color: ${color.hex};"></div>
        <div class="color-details">
            <strong>${color.nombre}</strong>
            <small>HEX: ${color.hex} / RGB: ${color.rgb}</small>
        </div>
        <div class="color-code">${codeToShow}</div>
    `;

    // Añadir el evento de click para copiar
    listItem.addEventListener('click', () => {
        const codeElement = listItem.querySelector('.color-code');
        const code = codeElement.textContent;
        copyToClipboard(code, codeElement);
    });

    return listItem;
}

/**
 * Copia el texto al portapapeles y muestra un mensaje de éxito.
 * @param {string} text - El texto a copiar.
 * @param {HTMLElement} element - El elemento que contiene el texto (para feedback visual).
 */
function copyToClipboard(text, element) {
    // Uso de la API del Portapapeles (Clipboard API) para modernidad
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            // Feedback visual simple
            const originalText = element.textContent;
            element.textContent = '¡Copiado!';
            element.style.backgroundColor = '#FFC107'; // Color Ámbar
            
            showCopiedMessage(text);

            setTimeout(() => {
                element.textContent = originalText;
                element.style.backgroundColor = '#eee';
            }, 1000);

        }).catch(err => {
            console.error('Error al intentar copiar:', err);
            fallbackCopy(text); // Intentar con el método de respaldo si falla
        });
    } else {
        // Método de respaldo para navegadores antiguos
        fallbackCopy(text);
    }
}

/**
 * Muestra el toast o mensaje de éxito en la parte inferior.
 * @param {string} text - El código que fue copiado.
 */
function showCopiedMessage(text) {
    let msg = document.querySelector('.copied-message');
    if (!msg) {
        msg = document.createElement('div');
        msg.className = 'copied-message';
        document.body.appendChild(msg);
    }

    msg.textContent = `Código '${text}' copiado al portapapeles.`;
    msg.classList.add('show');

    setTimeout(() => {
        msg.classList.remove('show');
    }, 1500);
}

/**
 * Método de respaldo para copiar texto.
 * @param {string} text - El texto a copiar.
 */
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        showCopiedMessage(text);
    } catch (err) {
        alert('Error al intentar copiar el código: ' + text);
    }
    document.body.removeChild(textarea);
}


// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderPalettes);