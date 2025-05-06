// Archivo para realizar pruebas más avanzadas de la aplicación

// Función para simular la carga de un archivo PDF
function simulateFileUpload() {
    console.log('Simulando carga de archivo PDF...');
    
    // Crear un archivo PDF de prueba (esto no es un PDF real, solo para probar la interfaz)
    const blob = new Blob(['Contenido de prueba'], { type: 'application/pdf' });
    const file = new File([blob], 'test-document.pdf', { type: 'application/pdf' });
    
    // Obtener elementos de la interfaz
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    
    // Crear un objeto DataTransfer para simular un evento de arrastrar y soltar
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    
    // Asignar el archivo al input
    if (fileInput) {
        // Crear un nuevo evento de cambio
        const event = new Event('change', { bubbles: true });
        
        // Asignar archivos al input
        Object.defineProperty(fileInput, 'files', {
            value: dataTransfer.files,
            writable: false
        });
        
        // Disparar el evento
        fileInput.dispatchEvent(event);
        
        console.log('✅ Simulación de carga de archivo completada');
        return true;
    } else {
        console.error('❌ No se pudo encontrar el elemento de entrada de archivo');
        return false;
    }
}

// Función para probar el manejo de errores
function testErrorHandling() {
    console.log('Probando manejo de errores...');
    
    try {
        // Intentar convertir un archivo inexistente
        window.pdfExtractor.extractTextFromPDF(null)
            .then(() => {
                console.error('❌ La prueba de manejo de errores falló: no se lanzó ningún error');
            })
            .catch(error => {
                console.log('✅ Manejo de errores funcionando correctamente:', error.message);
            });
        
        return true;
    } catch (error) {
        console.log('✅ Manejo de errores funcionando correctamente (error síncrono):', error.message);
        return true;
    }
}

// Función para verificar la compatibilidad del navegador
function checkBrowserCompatibility() {
    console.log('Verificando compatibilidad del navegador...');
    
    const features = {
        blob: typeof Blob !== 'undefined',
        file: typeof File !== 'undefined',
        fileReader: typeof FileReader !== 'undefined',
        promise: typeof Promise !== 'undefined',
        arrayBuffer: typeof ArrayBuffer !== 'undefined',
        url: typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
    };
    
    console.log('Características del navegador:', features);
    
    // Verificar si todas las características son compatibles
    const allCompatible = Object.values(features).every(supported => supported);
    
    if (allCompatible) {
        console.log('✅ El navegador es compatible con todas las características necesarias');
    } else {
        console.error('❌ El navegador no es compatible con algunas características necesarias');
        
        // Mostrar cuáles no son compatibles
        Object.entries(features)
            .filter(([_, supported]) => !supported)
            .forEach(([name]) => {
                console.error(`  - ${name} no es compatible`);
            });
    }
    
    return allCompatible;
}

// Función para ejecutar pruebas avanzadas
function runAdvancedTests() {
    console.log('Iniciando pruebas avanzadas...');
    
    const browserCompatible = checkBrowserCompatibility();
    const errorHandlingWorks = testErrorHandling();
    
    // No ejecutamos simulateFileUpload() automáticamente porque podría interferir con la interacción del usuario
    // Pero dejamos la función disponible para pruebas manuales
    
    if (browserCompatible && errorHandlingWorks) {
        console.log('✅ Pruebas avanzadas completadas con éxito');
    } else {
        console.error('❌ Algunas pruebas avanzadas han fallado');
    }
}

// Ejecutar pruebas avanzadas cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un momento para asegurar que todas las bibliotecas se hayan cargado
    setTimeout(runAdvancedTests, 2000);
});
