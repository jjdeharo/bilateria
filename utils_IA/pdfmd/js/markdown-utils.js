// Funciones adicionales para mejorar la experiencia de usuario y la funcionalidad

// Función para mostrar una vista previa HTML del Markdown
function renderMarkdownPreview(markdownText) {
    // Cargar showdown.js si no está ya cargado
    if (typeof showdown === 'undefined') {
        return `<pre>${markdownText}</pre>`;
    }
    
    try {
        // Convertir Markdown a HTML para la vista previa
        const converter = new showdown.Converter({
            tables: true,
            tasklists: true,
            strikethrough: true,
            emoji: true
        });
        
        return converter.makeHtml(markdownText);
    } catch (error) {
        console.error('Error al renderizar vista previa:', error);
        return `<pre>${markdownText}</pre>`;
    }
}

// Función para añadir metadatos al Markdown
function addMetadata(markdownText, pdfFileName) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('es-ES');
    
    const metadata = `---
Título: ${pdfFileName.replace(/\.pdf$/i, '')}
Fecha de conversión: ${formattedDate}
Generado por: Convertidor PDF a Markdown
---

`;
    
    return metadata + markdownText;
}

// Función para limpiar caracteres problemáticos
function sanitizeMarkdown(markdownText) {
    // Reemplazar caracteres que pueden causar problemas
    let sanitized = markdownText
        .replace(/\u00A0/g, ' ')  // Reemplazar espacios no rompibles
        .replace(/\r\n/g, '\n')   // Normalizar saltos de línea
        .replace(/\r/g, '\n');    // Normalizar saltos de línea
    
    return sanitized;
}

// Exportar funciones para uso en otros scripts
window.markdownUtils = {
    renderMarkdownPreview,
    addMetadata,
    sanitizeMarkdown
};
