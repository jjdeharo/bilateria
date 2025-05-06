// Mejoras para la funcionalidad de conversión de PDF a Markdown

// Función para mejorar la detección de estructura en el texto extraído
function enhanceTextStructure(text) {
    // Dividir el texto en líneas
    const lines = text.split('\n');
    let enhancedText = '';
    let inList = false;
    let previousLineEmpty = true; // Considerar el inicio como si hubiera una línea vacía antes
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
        
        // Detectar encabezados por contexto (líneas cortas seguidas de líneas vacías)
        if (line !== '' && nextLine === '' && previousLineEmpty && line.length < 50 && !line.startsWith('## Página')) {
            // Evitar convertir listas o líneas que ya parecen encabezados
            if (!line.match(/^[0-9]+\./) && !line.match(/^[-*•]/)) {
                enhancedText += `\n### ${line}\n\n`;
                previousLineEmpty = true;
                continue;
            }
        }
        
        // Detectar elementos de lista
        if (line.match(/^[0-9]+\./) || line.match(/^[-*•]/)) {
            if (!inList && !previousLineEmpty) {
                enhancedText += '\n';
            }
            enhancedText += `${line}\n`;
            inList = true;
        }
        // Líneas vacías
        else if (line === '') {
            enhancedText += '\n';
            inList = false;
            previousLineEmpty = true;
        }
        // Líneas normales
        else {
            if (inList) {
                enhancedText += '\n';
                inList = false;
            }
            enhancedText += `${line}\n`;
            previousLineEmpty = false;
        }
    }
    
    return enhancedText;
}

// Función para mejorar el formato del Markdown final
function enhanceMarkdown(markdown) {
    // Eliminar encabezados de página duplicados o consecutivos
    let enhancedMarkdown = markdown.replace(/## Página \d+\s+## Página \d+/g, match => {
        return match.split('\n')[0];
    });
    
    // Mejorar formato de listas
    enhancedMarkdown = enhancedMarkdown.replace(/(\n- [^\n]+)(\n)([^\n-])/g, '$1\n$3');
    
    // Mejorar espaciado de encabezados
    enhancedMarkdown = enhancedMarkdown.replace(/\n(#{1,6} [^\n]+)\n(?!\n)/g, '\n$1\n\n');
    
    // Eliminar líneas vacías excesivas
    enhancedMarkdown = enhancedMarkdown.replace(/\n{3,}/g, '\n\n');
    
    return enhancedMarkdown;
}

// Exportar funciones para uso en otros scripts
window.markdownEnhancer = {
    enhanceTextStructure,
    enhanceMarkdown
};
