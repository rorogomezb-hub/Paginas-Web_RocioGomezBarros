const preciosDestinos = {
    "cataratas": 380000,
    "bariloche": 450000,
    "ushuaia": 520000,
    "rio": 880000,
    "cusco": 950000,
    "cancun": 1200000,
    "europa": 2800000
};

const costoSeguroPersona = 40000;

function calcularPresupuesto() {
    let destino = document.getElementById("destino").value;
    let cantidadPasajeros = parseInt(document.getElementById("pasajeros").value) || 1;
    let seguroIncluido = document.getElementById("seguro").checked;
    let visorTotal = document.getElementById("monto-total");

    if (!destino || !preciosDestinos[destino]) {
        visorTotal.innerText = "0";
        return;
    }

    let precioBasePorPersona = preciosDestinos[destino];
    let totalPersona = precioBasePorPersona;

    if (seguroIncluido) {
        totalPersona += costoSeguroPersona;
    }

    let totalViaje = totalPersona * cantidadPasajeros;

    visorTotal.innerText = Math.round(totalViaje).toLocaleString();
}

function aplicarPromoCataratas() {
    let selectDestino = document.getElementById("destino");
    selectDestino.value = "cataratas";

    calcularPresupuesto();

    document.getElementById("cotizador").scrollIntoView({ behavior: 'smooth' });

    let alerta = document.getElementById("mensajeAlerta");
    alerta.style.color = "#7f4f24";
    alerta.innerText = "¡Promoción de Cataratas del Iguazú cargada en el cotizador! Completá tus datos para finalizar.";
}

function procesarReserva(evento) {
    evento.preventDefault();

    const nombre = document.querySelector("#pasajero-nombre").value.trim();
    const email = document.querySelector("#pasajero-email").value.trim();
    const destino = document.querySelector("#destino").value;
    const pasajeros = document.querySelector("#pasajeros").value;
    const seguro = document.querySelector("#seguro").checked ? "Si" : "No";
    const totalEstimado = document.querySelector("#monto-total").innerText;
    let alerta = document.getElementById("mensajeAlerta");

    if (nombre === "") {
        alerta.style.color = "#a33a1e";
        alerta.innerText = "Error: Por favor, ingresá tu Nombre y Apellido.";
        return false;
    }

    if (email === "" || !email.includes("@")) {
        alerta.style.color = "#a33a1e";
        alerta.innerText = "Error: Por favor, ingresá un correo electrónico válido.";
        return false;
    }

    if (destino === "") {
        alerta.style.color = "#a33a1e";
        alerta.innerText = "Error: Por favor, seleccioná un destino para cotizar.";
        return false;
    }

    const encabezado = "Nombre,Email,Destino,Pasajeros,SeguroMedico,TotalEstimado,Fecha";
    const fechaActual = new Date().toLocaleDateString();

    const datosFila = [
        nombre,
        email,
        destino,
        pasajeros,
        seguro,
        "$" + totalEstimado,
        fechaActual
    ];

    const filaProcesada = datosFila.map(dato => {
        return '"' + String(dato).replace(/"/g, '""') + '"';
    }).join(",");

    const contenido = encabezado + "\r\n" + filaProcesada + "\r\n";

    const archivo = new Blob(
        ["\uFEFF" + contenido],
        { type: "text/csv;charset=utf-8;" }
    );

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "cotizaciones_mundoviajes.csv";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(enlace.href);

    alerta.style.color = "#2e6f40";
    alerta.innerText = `¡Solicitud enviada con éxito, ${nombre}! Se generó y descargó tu archivo CSV ("cotizaciones_mundoviajes.csv").`;

    document.getElementById("formCotizador").reset();
    document.getElementById("monto-total").innerText = "0";

    return false;
}