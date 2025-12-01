/**
 * Nombre del archivo JSON.
 */
const JSON_FILE = '6-sonidos-interfaz.json';

/**
 * Función principal asíncrona para cargar los datos y renderizar la página.
 */
async function loadAndRenderSounds() {
    const mainTitle = document.getElementById('main-title');
    const mainDescription = document.getElementById('main-description');
    const suggestedFormat = document.getElementById('suggested-format');
    const notificationsContainer = document.getElementById('notifications-container');

    try {
        // 1. Cargar el JSON usando Fetch API
        const response = await fetch(JSON_FILE);
        if (!response.ok) {
            throw new Error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // 2. Renderizar el Encabezado y Formato Sugerido
        mainTitle.textContent = data.titulo;
        mainDescription.textContent = data.descripcion;
        suggestedFormat.textContent = data.formato_sugerido;

        // Limpiar el mensaje de carga
        notificationsContainer.innerHTML = ''; 

        // 3. Iterar y Renderizar las Tarjetas de Notificación
        data.notificaciones_de_estado.forEach(notification => {
            const card = createNotificationCard(notification);
            notificationsContainer.appendChild(card);
        });

    } catch (error) {
        // Manejo de errores
        console.error('Fallo en la carga o renderizado de datos:', error);
        mainTitle.textContent = 'Error al Cargar la Colección de Sonidos';
        mainDescription.textContent = 'Asegúrate de ejecutar la página con un servidor local.';
        notificationsContainer.innerHTML = `<p style="color: ${getCardColor('Error')}; padding: 20px;">Error: ${error.message}</p>`;
    }
}

/**
 * Determina el color de acento de la tarjeta basado en el propósito.
 * @param {string} proposito - El propósito de la notificación (ej: 'Éxito', 'Error').
 * @returns {string} La clase CSS a aplicar.
 */
function getClassModifier(proposito) {
    const lowerProposito = proposito.toLowerCase();
    if (lowerProposito.includes('error') || lowerProposito.includes('fallo')) {
        return 'error';
    }
    if (lowerProposito.includes('alerta') || lowerProposito.includes('advertencia')) {
        return 'warning';
    }
    return ''; // Default es Success
}

/**
 * Crea la tarjeta de notificación.
 * @param {object} notification - Objeto de notificación con propósito, descripción y archivos.
 * @returns {HTMLElement} El elemento article de la tarjeta.
 */
function createNotificationCard(notification) {
    const card = document.createElement('article');
    const classModifier = getClassModifier(notification.proposito);
    card.className = `notification-card ${classModifier}`;

    // Contenido estático de la tarjeta
    card.innerHTML = `
        <h3>${notification.proposito}</h3>
        <p class="description">${notification.descripcion_uso}</p>
        
        <table class="files-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Archivo Sugerido</th>
                </tr>
            </thead>
            <tbody>
                </tbody>
        </table>
    `;

    // Inyectar filas de archivos
    const tableBody = card.querySelector('tbody');

    notification.archivos.forEach(archivo => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="id-col">${archivo.id_sonido}</td>
            <td class="file-col">${archivo.nombre_archivo}</td>
        `;
        tableBody.appendChild(row);
    });

    return card;
}

// Iniciar el proceso de carga cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', loadAndRenderSounds);