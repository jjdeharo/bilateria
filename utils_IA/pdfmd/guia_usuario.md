# Guía de Usuario: Convertidor de PDF a Markdown

## Descripción

Esta aplicación web permite convertir archivos PDF a formato Markdown directamente en el navegador. No requiere instalación de software adicional ni envía archivos a ningún servidor, todo el procesamiento se realiza localmente en tu navegador.

## Características principales

- Conversión de PDF a Markdown sin necesidad de Node.js
- Funciona completamente en el navegador sin enviar archivos a servidores
- Interfaz intuitiva con arrastrar y soltar
- Vista previa del Markdown generado
- Descarga directa del archivo Markdown resultante
- Preservación de estructura básica del documento
- Adición automática de metadatos

## Cómo usar la aplicación

1. **Cargar un archivo PDF**:
   - Arrastra y suelta un archivo PDF en el área designada, o
   - Haz clic en el área para seleccionar un archivo desde tu dispositivo

2. **Convertir el archivo**:
   - Una vez cargado el PDF, haz clic en el botón "Convertir a Markdown"
   - Espera mientras se procesa el archivo (el tiempo varía según el tamaño y complejidad del PDF)

3. **Revisar la vista previa**:
   - Examina la vista previa del Markdown generado
   - Verifica que el contenido y formato sean correctos

4. **Descargar el resultado**:
   - Haz clic en el botón "Descargar Markdown" para guardar el archivo en tu dispositivo
   - El archivo se guardará con el mismo nombre que el PDF original pero con extensión .md

## Atajos de teclado

- **Alt+U**: Subir un archivo PDF
- **Alt+C**: Convertir el archivo cargado
- **Alt+D**: Descargar el archivo Markdown generado

## Limitaciones

- La conversión de tablas complejas puede no ser perfecta
- Las imágenes del PDF no se convierten a referencias de imágenes en Markdown
- Algunos elementos de formato avanzado pueden perderse en la conversión
- PDFs con estructura muy compleja pueden no convertirse con precisión

## Requisitos técnicos

- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- JavaScript habilitado
- Conexión a internet para la carga inicial de la aplicación

## Solución de problemas

- **El archivo no se carga**: Asegúrate de que sea un archivo PDF válido
- **La conversión tarda demasiado**: Los archivos grandes pueden tardar más en procesarse
- **El formato no es correcto**: Algunos PDFs con formato complejo pueden no convertirse perfectamente

## Privacidad

Esta aplicación procesa todos los archivos localmente en tu navegador. No se envía ningún dato a servidores externos, garantizando la privacidad de tus documentos.
