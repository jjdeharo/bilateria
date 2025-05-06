function limpiarCaracteresNoImprimibles(texto) {
    // Elimina el carácter de reemplazo (�)
    let limpio = texto.replace(/\uFFFD/g, '');
    // Elimina caracteres del área de uso privado (U+E000 a U+F8FF), donde suele aparecer el ""
    limpio = limpio.replace(/[\uE000-\uF8FF]/g, '');
    // Luego, conserva únicamente tabulaciones, saltos de línea, espacios y caracteres imprimibles
    return limpio.replace(/[^\x09\x0A\x0D\x20-\x7E\u00A0-\uFFFF]/g, '');
}

// Archivo principal para manejar la lógica de la aplicación

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const convertBtn = document.getElementById('convert-btn');
    const downloadBtn = document.getElementById('download-btn');
    const previewContainer = document.getElementById('preview-container');
    const previewArea = document.getElementById('preview-area');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    // Variable para almacenar el archivo PDF seleccionado
    let selectedFile = null;
    // Variable para almacenar el contenido Markdown generado
    let markdownContent = null;
    
    // Manejo de eventos para arrastrar y soltar
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
    
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });
    
    // Manejar el archivo seleccionado
    function handleFile(file) {
        if (file.type !== 'application/pdf') {
            showError('Por favor, selecciona un archivo PDF válido.');
            return;
        }
        
        // Guardar el archivo seleccionado
        selectedFile = file;
        
        // Mostrar nombre del archivo seleccionado
        uploadArea.innerHTML = `<p>Archivo seleccionado: ${file.name}</p>`;
        convertBtn.disabled = false;
        
        // Ocultar la vista previa si estaba visible
        previewContainer.classList.remove('show');
        downloadBtn.disabled = true;
        
        showSuccess('Archivo PDF cargado correctamente. Haz clic en "Convertir a Markdown" para procesar.');
    }
    
    // Evento para el botón de conversión
    convertBtn.addEventListener('click', async function() {
        if (!selectedFile) {
            showError('Por favor, selecciona un archivo PDF primero.');
            return;
        }
        
        try {
            // Mostrar indicador de carga
            loading.classList.add('show');
            convertBtn.disabled = true;
            
            // Extraer texto del PDF usando PDF.js
            const extractedText = await window.pdfExtractor.extractTextFromPDF(selectedFile);
            // Limpiar el texto extraído eliminando caracteres no imprimibles y del área de uso privado
            const textoLimpio = limpiarCaracteresNoImprimibles(extractedText);
            
            // Convertir el texto extraído a Markdown
            markdownContent = window.markdownConverter.convertToMarkdown(textoLimpio);
            
            // Añadir metadatos y sanitizar el contenido
            markdownContent = window.markdownUtils.addMetadata(markdownContent, selectedFile.name);
            markdownContent = window.markdownUtils.sanitizeMarkdown(markdownContent);
            
            // Mostrar el Markdown en la vista previa con formato HTML
            previewArea.innerHTML = window.markdownUtils.renderMarkdownPreview(markdownContent);
            previewContainer.classList.add('show');
            
            // Habilitar el botón de descarga
            downloadBtn.disabled = false;
            
            // Ocultar indicador de carga
            loading.classList.remove('show');
            
            showSuccess('Conversión completada con éxito.');
        } catch (error) {
            console.error('Error durante la conversión:', error);
            showError('Error al procesar el PDF: ' + error.message);
            loading.classList.remove('show');
            convertBtn.disabled = false;
        }
    });
    
    // Evento para el botón de descarga
    downloadBtn.addEventListener('click', function() {
        if (!markdownContent) {
            showError('No hay contenido Markdown para descargar.');
            return;
        }
        
        try {
            // Asegurar que el contenido esté sanitizado antes de la descarga
            const finalContent = window.markdownUtils.sanitizeMarkdown(markdownContent);
            
            // Crear un blob con el contenido Markdown
            const blob = new Blob([finalContent], { type: 'text/markdown' });
            
            // Crear un enlace de descarga
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            // Generar nombre de archivo basado en el archivo original
            const fileName = selectedFile.name.replace(/\.pdf$/i, '') + '.md';
            a.download = fileName;
            
            // Simular clic en el enlace para iniciar la descarga
            document.body.appendChild(a);
            a.click();
            
            // Limpiar
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showSuccess(`Archivo "${fileName}" descargado correctamente.`);
            
            // Registrar evento de descarga para análisis
            console.log(`Archivo descargado: ${fileName}, tamaño: ${Math.round(finalContent.length / 1024)} KB`);
        } catch (error) {
            console.error('Error al descargar el archivo:', error);
            showError('Error al descargar el archivo: ' + error.message);
        }
    });
    
    // Funciones de utilidad para mostrar mensajes
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);
    }
});

