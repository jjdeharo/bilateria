// Archivo para manejar la conversión de HTML a Markdown usando Turndown.js

// Cargar Turndown.js desde CDN
const turndownScript = document.createElement('script');
turndownScript.src = 'https://unpkg.com/turndown/dist/turndown.js';
document.head.appendChild(turndownScript);

// Variable para almacenar la instancia de Turndown
let turndownService = null;

// Inicializar Turndown cuando el script se haya cargado
turndownScript.onload = function() {
    // Crear una instancia de TurndownService con opciones personalizadas
    turndownService = new TurndownService({
        headingStyle: 'atx',           // Usar # para encabezados
        hr: '---',                     // Usar --- para líneas horizontales
        bulletListMarker: '-',         // Usar - para listas
        codeBlockStyle: 'fenced',      // Usar bloques de código cercados
        emDelimiter: '*',              // Usar * para énfasis
        strongDelimiter: '**',         // Usar ** para texto fuerte
        linkStyle: 'inlined',          // Usar enlaces en línea
        linkReferenceStyle: 'full'     // Usar referencias completas para enlaces
    });
    
    console.log('Turndown.js cargado correctamente');
};

// Función para convertir texto a Markdown
function convertToMarkdown(htmlContent) {
    if (!turndownService) {
        throw new Error('Turndown.js no está inicializado');
    }
    
    try {
        // Mejorar la estructura del texto antes de convertirlo
        const enhancedText = window.markdownEnhancer.enhanceTextStructure(htmlContent);
        
        // Convertir el texto a HTML con formato básico
        const formattedHtml = formatTextAsHtml(enhancedText);
        
        // Convertir HTML a Markdown usando Turndown
        let markdown = turndownService.turndown(formattedHtml);
        
        // Mejorar el formato del Markdown resultante
        markdown = window.markdownEnhancer.enhanceMarkdown(markdown);
        
        return markdown;
    } catch (error) {
        console.error('Error al convertir a Markdown:', error);
        throw error;
    }
}

// Función para dar formato al texto extraído como HTML
function formatTextAsHtml(text) {
    // Dividir el texto en líneas
    const lines = text.split('\n');
    let html = '';
    let inParagraph = false;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Detectar encabezados de página (## Página X)
        if (trimmedLine.startsWith('## Página')) {
            if (inParagraph) {
                html += '</p>';
                inParagraph = false;
            }
            
            // Convertir encabezado de página a h2
            html += `<h2>${trimmedLine.substring(3)}</h2>`;
        } 
        // Líneas en blanco terminan párrafos
        else if (trimmedLine === '') {
            if (inParagraph) {
                html += '</p>';
                inParagraph = false;
            }
            
            html += '<br>';
        } 
        // Líneas normales
        else {
            // Si no estamos en un párrafo, comenzar uno nuevo
            if (!inParagraph) {
                html += '<p>';
                inParagraph = true;
            }
            
            html += trimmedLine + ' ';
        }
    }
    
    // Cerrar el último párrafo si es necesario
    if (inParagraph) {
        html += '</p>';
    }
    
    return html;
}

// Exportar funciones para uso en otros scripts
window.markdownConverter = {
    convertToMarkdown
};
