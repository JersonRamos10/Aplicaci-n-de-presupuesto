// Variables globales para almacenar los totales
let totalIngresos = 0;
let totalEgresos = 0;

// Esta función se ejecuta cuando el documento HTML está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar el título con el mes y año actual
    actualizarTitulo();
    
    // Limpiar las listas por si tienen elementos estáticos
    document.getElementById('tabla-ingresos').querySelector('ul').innerHTML = '';
    document.getElementById('tabla-egresos').querySelector('ul').innerHTML = '';
    
    // Configurar el evento del botón para agregar transacciones
    document.getElementById('submitBtn').addEventListener('click', function(event) {
        // Prevenir que el formulario se envíe normalmente
        event.preventDefault();
        
        // Obtener los valores ingresados por el usuario
        var tipo = document.getElementById('tipoTransaccion').value;
        var descripcion = document.getElementById('descripcion').value;
        var monto = parseFloat(document.getElementById('monto').value);

        // Validar los datos ingresados con sweetalert2
        if (descripcion.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Falta información',
                text: 'Por favor ingrese una descripción para la transacción.',
                background: '#212529',
                color: "white",
                confirmButtonColor: '#dc3545',
            });
            return;
        }
        
        if (isNaN(monto) || monto <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Monto inválido',
                text: 'Por favor ingrese un número válido mayor que cero en el monto.',
                background: '#212529',
                color: "white",
                confirmButtonColor: '#dc3545',
            });
            return;
        }

        // Obtener la fecha actual
        var fechaActual = new Date();
        var fechaFormateada = fechaActual.toLocaleDateString(); // Formato: DD/MM/AAAA

        // Obtener la lista correspondiente segun el tipo de transacción
        var tablaIngresos = document.getElementById('tabla-ingresos').getElementsByTagName('ul')[0];
        var tablaEgresos = document.getElementById('tabla-egresos').getElementsByTagName('ul')[0];
        
        // Crear el nuevo elemento de lista
        var nuevaFila = document.createElement('li');
        nuevaFila.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        
        // Actualizar los totales y agregar la transacción a la lista correspondiente
        if (tipo === 'Ingreso') {
            totalIngresos += monto;
            nuevaFila.innerHTML = `
                <div>
                    <strong>${descripcion}</strong>
                    <div><small>Fecha: ${fechaFormateada}</small></div>
                    <div><small class="text-success">Monto: +$${monto.toFixed(2)}</small></div>
                </div>
                <span class="badge badge-primary badge-pill">+$${monto.toFixed(2)}</span>
            `;
            tablaIngresos.appendChild(nuevaFila);
            
            // Mostrar mensaje de éxito con sweetalert2
            Swal.fire({
                icon: 'success',
                title: 'Ingreso agregado',
                text: `Se ha registrado un ingreso de $${monto.toFixed(2)}`,
                background: '#212529',
                color: "white",
                confirmButtonColor: '#dc3545',
                timer: 3000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        } else {
            totalEgresos += monto;
            
            // Para egresos, calculamos el porcentaje
            var porcentajeIndividual = totalIngresos > 0 ? ((monto / totalIngresos) * 100).toFixed(2) : 0;
            
            // Usamos un estilo diferente para asegurar que los valores sean visibles
            nuevaFila.innerHTML = `
                <div style="flex: 1;">
                    <strong>${descripcion}</strong>
                    <div><small>Fecha: ${fechaFormateada}</small></div>
                    <div><small class="text-danger">Monto: -$${monto.toFixed(2)}</small></div>
                </div>
                <div style="display: flex; align-items: center;">
                    <button class="btn btn-dark btn-sm mr-2" style="opacity: 1; margin-right: 5px;">-$${monto.toFixed(2)}</button>
                    <button class="btn btn-secondary btn-sm" style="opacity: 1;">${porcentajeIndividual}%</button>
                </div>
            `;
            tablaEgresos.appendChild(nuevaFila);
            
            // Mostrar mensaje de éxito con sweetalert2
            Swal.fire({
                icon: 'success',
                title: 'Egreso agregado',
                text: `Se ha registrado un egreso de $${monto.toFixed(2)}`,
                background: '#212529',
                color: "white",
                confirmButtonColor: '#dc3545',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
        }

        // Actualizar los totales mostrados en la interfaz
        actualizarTotales();
        
        // Limpiar los campos del formulario
        document.getElementById('descripcion').value = '';
        document.getElementById('monto').value = '';
    });
    
    // Inicializar la vista (mostrar ingresos, ocultar egresos por defecto)
    document.getElementById('tabla-egresos').classList.add('hidden');
    
    // Actualizar los totales iniciales
    actualizarTotales();
});

// Función para actualizar el título con el mes y año actual
function actualizarTitulo() {
    const fechaActual = new Date();
    const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const mesActual = meses[fechaActual.getMonth()];
    const añoActual = fechaActual.getFullYear();
    document.getElementById("titulo").textContent = `Presupuesto de ${mesActual} ${añoActual}`;
}

// Función para actualizar los totales mostrados en la interfaz
function actualizarTotales() {
    // Calcular el saldo total y el porcentaje de gastos
    var saldoTotal = totalIngresos - totalEgresos;
    var porcentajeGastos = totalIngresos > 0 ? ((totalEgresos / totalIngresos) * 100).toFixed(2) : 0;
    
    // Actualizar los elementos en la interfaz
    document.getElementById('totalIngresos').innerHTML = `<i class="fa-solid fa-dollar-sign" style="color: #ffffff;"></i> INGRESOS: +$${totalIngresos.toFixed(2)}`;
    document.getElementById('totalEgresos').innerHTML = `<i class="fa-solid fa-right-left" style="color: #000000;"></i> EGRESOS: -$${totalEgresos.toFixed(2)}`;
    document.getElementById('saldoTotal').textContent = `+$${saldoTotal.toFixed(2)}`;
    document.getElementById('porcentajeGastos').textContent = `${porcentajeGastos}%`;
}

// Función para cambiar entre las vistas de ingresos y egresos
function toggleTables(tipo) {
    var tablaIngresos = document.getElementById('tabla-ingresos');
    var tablaEgresos = document.getElementById('tabla-egresos');
    
    // Cambiar la clase activa en los botones
    const botonesNav = document.querySelectorAll('#botones-segmentados button');
    botonesNav.forEach(boton => {
        boton.classList.remove('btn-dark');
        boton.classList.add('btn-light');
    });

    if (tipo === 'ingresos') {
        tablaIngresos.classList.remove('hidden');
        tablaEgresos.classList.add('hidden');
        document.querySelector('[onclick="toggleTables(\'ingresos\')"]').classList.remove('btn-light');
        document.querySelector('[onclick="toggleTables(\'ingresos\')"]').classList.add('btn-dark');
    } else if (tipo === 'egresos') {
        tablaIngresos.classList.add('hidden');
        tablaEgresos.classList.remove('hidden');
        document.querySelector('[onclick="toggleTables(\'egresos\')"]').classList.remove('btn-light');
        document.querySelector('[onclick="toggleTables(\'egresos\')"]').classList.add('btn-dark');
    }
}