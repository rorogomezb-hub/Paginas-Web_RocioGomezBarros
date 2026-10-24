const preciosBase = {
    "musculacion": 22000,
    "crossfit": 26000,
    "yoga": 18000,
    "pase-libre": 32000
};

function calcularCuota() {
    let actividad = document.getElementById("actividad").value;
    let plan = document.getElementById("plan").value;
    let visorTotal = document.getElementById("monto-total");

    if (!actividad || !preciosBase[actividad]) {
        visorTotal.innerText = "0";
        return;
    }

    let monto = preciosBase[actividad];

    if (plan === "trimestral") {
        monto = monto * 3 * 0.90;
    } else if (plan === "anual") {
        monto = monto * 12 * 0.80; 
    }

    visorTotal.innerText = Math.round(monto).toLocaleString();
}

function procesarInscripcion(evento) {
    evento.preventDefault();

    const nombre = document.querySelector("#socio-nombre").value.trim();
    const telefono = document.querySelector("#socio-telefono").value.trim();
    const actividad = document.querySelector("#actividad").value;
    const plan = document.querySelector("#plan").value;
    const totalEstimado = document.querySelector("#monto-total").innerText;
    let alerta = document.getElementById("mensajeAlerta");

    if (nombre === "") {
        alerta.style.color = "#ff5252";
        alerta.innerText = "Error: Por favor, ingresá tu Nombre y Apellido.";
        return false;
    }

    if (telefono === "") {
        alerta.style.color = "#ff5252";
        alerta.innerText = "Error: Por favor, ingresá un teléfono de contacto.";
        return false;
    }

    if (actividad === "") {
        alerta.style.color = "#ff5252";
        alerta.innerText = "Error: Seleccioná la actividad a la que querés inscribirte.";
        return false;
    }

    const encabezado = "Nombre,Telefono,Actividad,Plan,MontoTotal,Fecha";
    const fechaActual = new Date().toLocaleDateString();

    const datosFila = [
        nombre,
        telefono,
        actividad,
        plan,
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
    enlace.download = "inscripciones_powerfit.csv";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(enlace.href);

    alerta.style.color = "#22c55e";
    alerta.innerText = `¡Inscripción registrada con éxito! Bienvenido a PowerFit, ${nombre}. Se descargó tu comprobante CSV ("inscripciones_powerfit.csv").`;

    document.getElementById("formInscripcion").reset();
    document.getElementById("monto-total").innerText = "0";

    return false;
}