// Archivo para optimizar el rendimiento y la experiencia de usuario

// Función para mostrar mensajes de ayuda contextuales
function setupHelpTooltips() {
    // Añadir tooltips a elementos importantes
    const tooltips = [
        { selector: '#upload-area', message: 'Arrastra y suelta un archivo PDF aquí o haz clic para seleccionarlo' },
        { selector: '#convert-btn', message: 'Procesa el PDF y genera el contenido Markdown' },
        { selector: '#download-btn', message: 'Descarga el archivo Markdown generado' }
    ];
    
    tooltips.forEach(tooltip => {
        const element = document.querySelector(tooltip.selector);
        if (element) {
            element.setAttribute('title', tooltip.message);
        }
    });
}

// Función para optimizar la carga de recursos
function optimizeResourceLoading() {
    // Añadir atributos a los scripts para mejorar la carga
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.src.includes('unpkg.com') || script.src.includes('cdnjs.cloudflare.com')) {
            script.setAttribute('crossorigin', 'anonymous');
            script.setAttribute('defer', '');
        }
    });
}

// Función para mejorar la accesibilidad
function enhanceAccessibility() {
    // Añadir atributos ARIA a elementos importantes
    const ariaElements = [
        { selector: '#upload-area', role: 'button', label: 'Área para subir archivo PDF' },
        { selector: '#convert-btn', role: 'button', label: 'Convertir a Markdown' },
        { selector: '#download-btn', role: 'button', label: 'Descargar archivo Markdown' },
        { selector: '#preview-area', role: 'region', label: 'Vista previa del Markdown' }
    ];
    
    ariaElements.forEach(item => {
        const element = document.querySelector(item.selector);
        if (element) {
            element.setAttribute('role', item.role);
            element.setAttribute('aria-label', item.label);
        }
    });
}

// Función para añadir atajos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Alt + C para convertir
        if (event.altKey && event.key === 'c') {
            const convertBtn = document.getElementById('convert-btn');
            if (convertBtn && !convertBtn.disabled) {
                convertBtn.click();
                event.preventDefault();
            }
        }
        
        // Alt + D para descargar
        if (event.altKey && event.key === 'd') {
            const downloadBtn = document.getElementById('download-btn');
            if (downloadBtn && !downloadBtn.disabled) {
                downloadBtn.click();
                event.preventDefault();
            }
        }
        
        // Alt + U para subir archivo
        if (event.altKey && event.key === 'u') {
            const fileInput = document.getElementById('file-input');
            if (fileInput) {
                fileInput.click();
                event.preventDefault();
            }
        }
    });
    
    // Añadir información sobre atajos de teclado en la interfaz
    const footer = document.querySelector('footer');
    if (footer) {
        const shortcutsInfo = document.createElement('p');
        shortcutsInfo.innerHTML = 'Atajos de teclado: <kbd>Alt+U</kbd> para subir, <kbd>Alt+C</kbd> para convertir, <kbd>Alt+D</kbd> para descargar';
        shortcutsInfo.style.fontSize = '12px';
        shortcutsInfo.style.marginTop = '10px';
        footer.appendChild(shortcutsInfo);
    }
}

// Función para optimizar el rendimiento
function optimizePerformance() {
    // Limitar la frecuencia de operaciones costosas
    window.addEventListener('resize', debounce(function() {
        // Ajustar la interfaz si es necesario
        const previewContainer = document.getElementById('preview-container');
        if (previewContainer && previewContainer.classList.contains('show')) {
            // Ajustar altura máxima según el tamaño de la ventana
            const previewArea = document.getElementById('preview-area');
            if (previewArea) {
                previewArea.style.maxHeight = (window.innerHeight * 0.5) + 'px';
            }
        }
    }, 200));
}

// Función auxiliar para limitar la frecuencia de ejecución
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Ejecutar optimizaciones cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    setupHelpTooltips();
    optimizeResourceLoading();
    enhanceAccessibility();
    setupKeyboardShortcuts();
    optimizePerformance();
    
    console.log('✅ Optimizaciones aplicadas correctamente');
});
