// Archivo para cargar PDF.js y sus dependencias
// Se cargará desde el CDN para evitar problemas de configuración del servidor

// Definir la URL base para los archivos de PDF.js
const PDF_JS_BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174';

// Cargar el script principal de PDF.js
const pdfJsScript = document.createElement('script');
pdfJsScript.src = `${PDF_JS_BASE_URL}/pdf.min.js`;
document.head.appendChild(pdfJsScript);

// Cargar el worker de PDF.js después de que se cargue el script principal
pdfJsScript.onload = function() {
    // Configurar la URL del worker
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = `${PDF_JS_BASE_URL}/pdf.worker.min.js`;
    
    console.log('PDF.js cargado correctamente');
};

// Función para extraer texto de un PDF
async function extractTextFromPDF(pdfFile) {
    try {
        // Convertir el archivo a ArrayBuffer
        const arrayBuffer = await readFileAsArrayBuffer(pdfFile);
        
        // Cargar el documento PDF
        const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        console.log(`PDF cargado. Número de páginas: ${pdf.numPages}`);
        
        // Extraer texto de todas las páginas
        let allText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Procesar el contenido de texto
            const textItems = textContent.items;
            let lastY = null;
            let pageText = '';
            
            for (const item of textItems) {
                // Añadir saltos de línea cuando cambia la posición Y
                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                    pageText += '\n';
                }
                
                pageText += item.str + ' ';
                lastY = item.transform[5];
            }
            
            // Añadir encabezado de página y el texto extraído
            allText += `\n## Página ${i}\n\n${pageText}\n\n`;
        }
        
        return allText;
    } catch (error) {
        console.error('Error al extraer texto del PDF:', error);
        throw error;
    }
}

// Función auxiliar para leer un archivo como ArrayBuffer
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        
        reader.onerror = function(error) {
            reject(error);
        };
        
        reader.readAsArrayBuffer(file);
    });
}

// Exportar funciones para uso en otros scripts
window.pdfExtractor = {
    extractTextFromPDF
};
