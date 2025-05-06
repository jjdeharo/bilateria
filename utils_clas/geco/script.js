/**
 * GeCo - Generador de Equipos Cooperativos
 * Autor: Juan José de Haro
 * Versión mejorada
 */

// Función para parsear alumnos desde un campo de texto
function parseAlumnos(input) {
  return input.split(/[\n,]+/).map(alumno => alumno.trim()).filter(alumno => alumno.length > 0);
}

// Función para mezclar un array (algoritmo Fisher-Yates)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array; // Retornamos el array para facilitar encadenamiento
}

// Función que etiqueta a los alumnos con su tipología
function etiquetarAlumnos(alumnos, tipo) {
  return alumnos.map(alumno => ({
    nombre: alumno,
    tipo: tipo
  }));
}

// Función principal para generar grupos
function generarGrupos() {
  // Obtener y parsear los datos de entrada
  const alumnosA = parseAlumnos(document.getElementById("grupoA").value);
  const alumnosB = parseAlumnos(document.getElementById("grupoB").value);
  const alumnosC = parseAlumnos(document.getElementById("grupoC").value);
  const numAlumnosPorGrupo = parseInt(document.getElementById("numAlumnos").value);
  const tipoGrupo = document.querySelector('input[name="tipoGrupo"]:checked').value;
  const opcionSobrantes = document.querySelector('input[name="sobrantes"]:checked').value;
  
  // Validar datos de entrada
  if (numAlumnosPorGrupo < 2) {
    alert("El número de alumnos por grupo debe ser al menos 2");
    return;
  }
  
  const totalAlumnos = alumnosA.length + alumnosB.length + alumnosC.length;
  if (totalAlumnos === 0) {
    alert("No hay alumnos para formar grupos");
    return;
  }
  
  // Crear lista de alumnos con su tipología
  let listaAlumnosA = etiquetarAlumnos(alumnosA, "A");
  let listaAlumnosB = etiquetarAlumnos(alumnosB, "B");
  let listaAlumnosC = etiquetarAlumnos(alumnosC, "C");
  
  // Mezclar aleatoriamente los alumnos de cada grupo
  listaAlumnosA = shuffleArray(listaAlumnosA);
  listaAlumnosB = shuffleArray(listaAlumnosB);
  listaAlumnosC = shuffleArray(listaAlumnosC);
  
  let grupos = [];
  
  // Generar grupos según el tipo seleccionado
  if (tipoGrupo === "heterogeneos") {
    grupos = generarGruposHeterogeneos(listaAlumnosA, listaAlumnosB, listaAlumnosC, numAlumnosPorGrupo);
  } else if (tipoGrupo === "homogeneos") {
    grupos = generarGruposHomogeneos(listaAlumnosA, listaAlumnosB, listaAlumnosC, numAlumnosPorGrupo);
  } else { // esporádicos
    grupos = generarGruposEsporadicos([...listaAlumnosA, ...listaAlumnosB, ...listaAlumnosC], numAlumnosPorGrupo);
  }
  
  // Manejar alumnos sobrantes
  manejarSobrantes(grupos, opcionSobrantes, numAlumnosPorGrupo);
  
  // Mostrar los resultados
  mostrarResultados(grupos);
}

// Función para generar grupos heterogéneos (base)
function generarGruposHeterogeneos(alumnosA, alumnosB, alumnosC, numAlumnosPorGrupo) {
  const totalAlumnos = alumnosA.length + alumnosB.length + alumnosC.length;
  const numGrupos = Math.floor(totalAlumnos / numAlumnosPorGrupo);
  let grupos = Array(numGrupos).fill().map(() => []);
  
  // Distribuir alumnos tipo A (idealmente uno por grupo)
  distribuirAlumnosPorGrupo(alumnosA, grupos);
  
  // Distribuir alumnos tipo C (idealmente uno por grupo)
  distribuirAlumnosPorGrupo(alumnosC, grupos);
  
  // Distribuir alumnos tipo B para completar grupos
  distribuirAlumnosPorGrupo(alumnosB, grupos);
  
  // Recoger alumnos sobrantes
  const alumnosSobrantes = [
    ...alumnosA.slice(numGrupos), 
    ...alumnosC.slice(numGrupos),
    ...alumnosB.slice(alumnosB.length - (alumnosB.length % numGrupos))
  ];
  
  if (alumnosSobrantes.length > 0) {
    grupos.push(alumnosSobrantes);
  }
  
  // Asegurar que los grupos heterogéneos tienen al menos un alumno de tipo A y/o C si es posible
  balancearGruposHeterogeneos(grupos);
  
  return grupos;
}

// Distribuir alumnos de una tipología entre grupos de forma equilibrada
function distribuirAlumnosPorGrupo(alumnos, grupos) {
  let indiceGrupo = 0;
  for (let i = 0; i < alumnos.length && indiceGrupo < grupos.length; i++) {
    grupos[indiceGrupo].push(alumnos[i]);
    indiceGrupo = (indiceGrupo + 1) % grupos.length;
  }
}

// Balancear grupos heterogéneos para asegurar diversidad
function balancearGruposHeterogeneos(grupos) {
  // Asegurar que todos los grupos tienen al menos un alumno de tipo A o C si es posible
  for (let i = 0; i < grupos.length; i++) {
    const tieneA = grupos[i].some(alumno => alumno.tipo === "A");
    const tieneC = grupos[i].some(alumno => alumno.tipo === "C");
    
    if (!tieneA && !tieneC) {
      // Buscar un grupo que tenga más de un alumno de tipo A o C para intercambiar
      for (let j = 0; j < grupos.length; j++) {
        if (i !== j) {
          const alumnosATipoA = grupos[j].filter(alumno => alumno.tipo === "A");
          const alumnosATipoC = grupos[j].filter(alumno => alumno.tipo === "C");
          
          if (alumnosATipoA.length > 1) {
            // Intercambiar un alumno tipo A por un alumno tipo B
            const indiceA = grupos[j].findIndex(alumno => alumno.tipo === "A");
            const indiceB = grupos[i].findIndex(alumno => alumno.tipo === "B");
            
            if (indiceB !== -1) {
              const temp = grupos[j][indiceA];
              grupos[j][indiceA] = grupos[i][indiceB];
              grupos[i][indiceB] = temp;
              break;
            }
          } else if (alumnosATipoC.length > 1) {
            // Intercambiar un alumno tipo C por un alumno tipo B
            const indiceC = grupos[j].findIndex(alumno => alumno.tipo === "C");
            const indiceB = grupos[i].findIndex(alumno => alumno.tipo === "B");
            
            if (indiceB !== -1) {
              const temp = grupos[j][indiceC];
              grupos[j][indiceC] = grupos[i][indiceB];
              grupos[i][indiceB] = temp;
              break;
            }
          }
        }
      }
    }
  }
}

// Función para generar grupos homogéneos (similares)
function generarGruposHomogeneos(alumnosA, alumnosB, alumnosC, numAlumnosPorGrupo) {
  const grupos = [];
  
  // Crear grupos homogéneos de tipo A
  crearGruposHomogeneosPorTipo(alumnosA, grupos, numAlumnosPorGrupo);
  
  // Crear grupos homogéneos de tipo B
  crearGruposHomogeneosPorTipo(alumnosB, grupos, numAlumnosPorGrupo);
  
  // Crear grupos homogéneos de tipo C
  crearGruposHomogeneosPorTipo(alumnosC, grupos, numAlumnosPorGrupo);
  
  // Recolectar alumnos sobrantes de cada tipo y crear grupos adicionales
  const sobrantesA = alumnosA.slice(Math.floor(alumnosA.length / numAlumnosPorGrupo) * numAlumnosPorGrupo);
  const sobrantesB = alumnosB.slice(Math.floor(alumnosB.length / numAlumnosPorGrupo) * numAlumnosPorGrupo);
  const sobrantesC = alumnosC.slice(Math.floor(alumnosC.length / numAlumnosPorGrupo) * numAlumnosPorGrupo);
  
  const sobrantes = [...sobrantesA, ...sobrantesB, ...sobrantesC];
  
  // Crear grupos adicionales con los sobrantes
  while (sobrantes.length > 0) {
    const grupoActual = [];
    for (let i = 0; i < numAlumnosPorGrupo && sobrantes.length > 0; i++) {
      grupoActual.push(sobrantes.shift());
    }
    if (grupoActual.length > 0) {
      grupos.push(grupoActual);
    }
  }
  
  return grupos;
}

// Crear grupos homogéneos para un tipo específico de alumno
function crearGruposHomogeneosPorTipo(alumnos, grupos, numAlumnosPorGrupo) {
  const numGruposCompletos = Math.floor(alumnos.length / numAlumnosPorGrupo);
  
  for (let i = 0; i < numGruposCompletos; i++) {
    const grupo = [];
    for (let j = 0; j < numAlumnosPorGrupo; j++) {
      grupo.push(alumnos[i * numAlumnosPorGrupo + j]);
    }
    grupos.push(grupo);
  }
}

// Función para generar grupos esporádicos (aleatorios)
function generarGruposEsporadicos(alumnos, numAlumnosPorGrupo) {
  // Mezclar todos los alumnos aleatoriamente
  alumnos = shuffleArray(alumnos);
  
  const grupos = [];
  const numGruposCompletos = Math.floor(alumnos.length / numAlumnosPorGrupo);
  
  // Crear grupos completos
  for (let i = 0; i < numGruposCompletos; i++) {
    const grupo = alumnos.slice(i * numAlumnosPorGrupo, (i + 1) * numAlumnosPorGrupo);
    grupos.push(grupo);
  }
  
  // Manejar alumnos sobrantes
  const sobrantes = alumnos.slice(numGruposCompletos * numAlumnosPorGrupo);
  if (sobrantes.length > 0) {
    grupos.push(sobrantes);
  }
  
  return grupos;
}

// Función para manejar alumnos sobrantes según la opción seleccionada
function manejarSobrantes(grupos, opcionSobrantes, numAlumnosPorGrupo) {
  // Si no hay al menos dos grupos, no hay nada que redistribuir
  if (grupos.length <= 1) return;
  
  // Identificar grupos incompletos (con menos alumnos que el número deseado)
  const gruposIncompletos = grupos.filter(grupo => grupo.length < numAlumnosPorGrupo);
  
  if (gruposIncompletos.length === 0) return; // No hay grupos incompletos
  
  if (opcionSobrantes === "grupoNuevo") {
    // Opción "Crear un equipo nuevo": mantener alumnos sobrantes en su propio grupo
    // (No hacer nada, los grupos ya están configurados así)
    return;
  } else if (opcionSobrantes === "agregar") {
    // Opción "Agregar a otros equipos": redistribuir alumnos de grupos incompletos
    
    // Extraer el último grupo (asumiendo que es el incompleto)
    const ultimoGrupo = grupos.pop();
    
    // Distribuir los alumnos del último grupo entre los demás grupos
    let indicePosicion = 0;
    while (ultimoGrupo.length > 0) {
      grupos[indicePosicion % grupos.length].push(ultimoGrupo.shift());
      indicePosicion++;
    }
  }
}

// Función para mostrar los resultados en el HTML
function mostrarResultados(grupos) {
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";
  
  // Crear tabla para mostrar los grupos
  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.borderCollapse = "collapse";
  table.style.marginTop = "20px";
  
  grupos.forEach((grupo, indice) => {
    const row = table.insertRow();
    
    const cellNum = row.insertCell();
    cellNum.style.padding = "10px";
    cellNum.style.borderBottom = "1px solid #ddd";
    cellNum.style.fontWeight = "bold";
    
    const cellMiembros = row.insertCell();
    cellMiembros.style.padding = "10px";
    cellMiembros.style.borderBottom = "1px solid #ddd";
    
    const lang = document.getElementById('es-btn')?.classList.contains('active') ? 'es' : 'ca';
    
    if (lang === 'ca') {
      cellNum.textContent = `Equip ${indice + 1}:`;
    } else {
      cellNum.textContent = `Equipo ${indice + 1}:`;
    }
    
    // Formatear alumnos con su tipo
    const miembrosFormateados = grupo.map(alumno => {
      // Si el alumno ya es un string (en caso de grupos esporádicos)
      if (typeof alumno === 'string') {
        return alumno;
      }
      return `(${alumno.tipo}) ${alumno.nombre}`;
    });
    
    // Ordenar miembros alfabéticamente
    miembrosFormateados.sort();
    
    cellMiembros.textContent = miembrosFormateados.join(", ");
  });
  
  resultadosDiv.appendChild(table);
}

// Función para actualizar información de grupos
function actualizarInfoGrupos() {
  const grupoA = parseAlumnos(document.getElementById("grupoA").value);
  const grupoB = parseAlumnos(document.getElementById("grupoB").value);
  const grupoC = parseAlumnos(document.getElementById("grupoC").value);
  const numAlumnosPorGrupo = parseInt(document.getElementById("numAlumnos").value);

  const totalAlumnos = grupoA.length + grupoB.length + grupoC.length;
  const numGrupos = Math.floor(totalAlumnos / numAlumnosPorGrupo);
  const sobrantes = totalAlumnos % numAlumnosPorGrupo;

  const infoGrupos = document.getElementById("infoGrupos");
  
  const lang = document.getElementById('es-btn')?.classList.contains('active') ? 'es' : 'ca';
  
  if (lang === 'ca') {
    infoGrupos.textContent = `Hi ha ${totalAlumnos} persones, es formaran ${numGrupos} equips i sobren ${sobrantes} persones.`;
  } else {
    infoGrupos.textContent = `Hay ${totalAlumnos} personas, se formarán ${numGrupos} equipos y sobran ${sobrantes} personas.`;
  }
}

// Inicializar eventos
document.addEventListener("DOMContentLoaded", function() {
  // Conectar eventos para actualizar información automáticamente
  document.getElementById("grupoA").addEventListener("input", actualizarInfoGrupos);
  document.getElementById("grupoB").addEventListener("input", actualizarInfoGrupos);
  document.getElementById("grupoC").addEventListener("input", actualizarInfoGrupos);
  
  // Para el selector numérico personalizado
  const bubbles = document.querySelectorAll('.bubble');
  if (bubbles.length > 0) {
    bubbles.forEach(bubble => {
      bubble.addEventListener("click", actualizarInfoGrupos);
    });
  } else {
    // Para el input numérico estándar
    document.getElementById("numAlumnos").addEventListener("input", actualizarInfoGrupos);
  }
  
  // Conectar evento para cambio de idioma
  if (document.getElementById('es-btn')) {
    document.getElementById('es-btn').addEventListener('click', actualizarInfoGrupos);
  }
  if (document.getElementById('ca-btn')) {
    document.getElementById('ca-btn').addEventListener('click', actualizarInfoGrupos);
  }
  
  // Conectar evento para generar grupos
  document.getElementById("generarGrupos").addEventListener("click", generarGrupos);
  
  // Inicializar información
  actualizarInfoGrupos();
});
