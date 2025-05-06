// Archivo para realizar pruebas básicas de la aplicación

// Función para verificar la carga de las bibliotecas
function checkLibrariesLoaded() {
    const results = {
        pdfjs: typeof window.pdfjsLib !== 'undefined',
        turndown: typeof TurndownService !== 'undefined',
        showdown: typeof showdown !== 'undefined',
        pdfExtractor: typeof window.pdfExtractor !== 'undefined',
        markdownConverter: typeof window.markdownConverter !== 'undefined',
        markdownEnhancer: typeof window.markdownEnhancer !== 'undefined',
        markdownUtils: typeof window.markdownUtils !== 'undefined'
    };
    
    console.log('Estado de carga de bibliotecas:', results);
    
    // Verificar si todas las bibliotecas están cargadas
    const allLoaded = Object.values(results).every(loaded => loaded);
    
    if (allLoaded) {
        console.log('✅ Todas las bibliotecas están cargadas correctamente');
    } else {
        console.error('❌ Algunas bibliotecas no se han cargado correctamente');
        
        // Mostrar cuáles no están cargadas
        Object.entries(results)
            .filter(([_, loaded]) => !loaded)
            .forEach(([name]) => {
                console.error(`  - ${name} no está cargado`);
            });
    }
    
    return allLoaded;
}

// Función para verificar la funcionalidad de la interfaz de usuario
function checkUIElements() {
    const elements = {
        uploadArea: document.getElementById('upload-area'),
        fileInput: document.getElementById('file-input'),
        convertBtn: document.getElementById('convert-btn'),
        downloadBtn: document.getElementById('download-btn'),
        previewContainer: document.getElementById('preview-container'),
        previewArea: document.getElementById('preview-area'),
        loading: document.getElementById('loading'),
        errorMessage: document.getElementById('error-message'),
        successMessage: document.getElementById('success-message')
    };
    
    console.log('Verificando elementos de la interfaz de usuario:');
    
    // Verificar si todos los elementos existen
    const allExist = Object.entries(elements).every(([name, element]) => {
        const exists = element !== null;
        console.log(`  - ${name}: ${exists ? '✅' : '❌'}`);
        return exists;
    });
    
    if (allExist) {
        console.log('✅ Todos los elementos de la interfaz de usuario existen');
    } else {
        console.error('❌ Algunos elementos de la interfaz de usuario no existen');
    }
    
    return allExist;
}

// Función para ejecutar todas las pruebas
function runAllTests() {
    console.log('Iniciando pruebas del convertidor de PDF a Markdown...');
    
    const librariesLoaded = checkLibrariesLoaded();
    const uiElementsExist = checkUIElements();
    
    if (librariesLoaded && uiElementsExist) {
        console.log('✅ Pruebas básicas completadas con éxito');
    } else {
        console.error('❌ Algunas pruebas han fallado');
    }
}

// Ejecutar pruebas cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un momento para asegurar que todas las bibliotecas se hayan cargado
    setTimeout(runAllTests, 1000);
});
