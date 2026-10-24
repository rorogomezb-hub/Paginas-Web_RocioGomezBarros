let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregar = document.querySelectorAll(".btn-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.getAttribute("data-nombre");
            const precio = parseInt(boton.getAttribute("data-precio"));

            agregarAlCarrito(nombre, precio);
        });
    });
});

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    actualizarCarritoVisual();
}

function actualizarCarritoVisual() {
    let contenedor = document.getElementById("resumen-carrito");
    let totalSpan = document.getElementById("total-carrito");

    if (!contenedor || !totalSpan) return;

    if (carrito.length === 0) {
        contenedor.innerHTML = `<p style="text-align: center; color: #94a3b8;">Tu carrito está vacío actualmente.</p>`;
        totalSpan.innerText = "0";
        return;
    }

    let html = "";
    let total = 0;

    carrito.forEach((item) => {
        total += item.precio;
        html += `
            <div class="item-carrito" style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b;">
                <span>${item.nombre}</span>
                <span>$${item.precio.toLocaleString()}</span>
            </div>
        `;
    });

    contenedor.innerHTML = html;
    totalSpan.innerText = total.toLocaleString();
}

function mostrarFormulario() {
    let alerta = document.getElementById("mensajeAlerta");

    if (carrito.length === 0) {
        alerta.style.color = "#f87171";
        alerta.innerText = "Error: Tu carrito está vacío. Agregá al menos un producto para continuar.";
        return;
    }

    alerta.innerText = "";
    let contenedorCheckout = document.getElementById("contenedor-checkout");
    contenedorCheckout.style.display = "block";

    contenedorCheckout.scrollIntoView({ behavior: 'smooth' });
}

function procesarCompra(evento) {
    evento.preventDefault();

    let nombre = document.getElementById("cliente-nombre").value.trim();
    let email = document.getElementById("cliente-email").value.trim();
    let envio = document.getElementById("cliente-envio").value.trim();
    let metodoPago = document.getElementById("metodo-pago").value;
    let alerta = document.getElementById("mensajeAlerta");

    if (nombre === "") {
        alerta.style.color = "#f87171";
        alerta.innerText = "Error: Por favor, ingresá tu Nombre y Apellido.";
        return false;
    }

    if (email === "" || !email.includes("@")) {
        alerta.style.color = "#f87171";
        alerta.innerText = "Error: Por favor, ingresá un correo electrónico válido.";
        return false;
    }

    if (envio === "") {
        alerta.style.color = "#f87171";
        alerta.innerText = "Error: Por favor, ingresá una dirección de envío.";
        return false;
    }

    if (metodoPago === "") {
        alerta.style.color = "#f87171";
        alerta.innerText = "Error: Por favor, seleccioná un método de pago.";
        return false;
    }

    if (carrito.length === 0) {
        alerta.style.color = "#f87171";
        alerta.innerText = "Error: El carrito está vacío.";
        return false;
    }

    const encabezado = "Fecha,Cliente,Email,DireccionEnvio,MetodoPago,Producto,Precio";
    const fechaActual = new Date().toLocaleDateString();

    let filasCSV = "";

    carrito.forEach(item => {
        const datosFila = [
            fechaActual,
            nombre,
            email,
            envio,
            metodoPago,
            item.nombre,
            item.precio
        ];

        const filaProcesada = datosFila.map(dato => {
            return '"' + String(dato).replace(/"/g, '""') + '"';
        }).join(",");

        filasCSV += filaProcesada + "\r\n";
    });

    const contenido = encabezado + "\r\n" + filasCSV;

    const archivo = new Blob(
        ["\uFEFF" + contenido],
        { type: "text/csv;charset=utf-8;" }
    );

    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(archivo);
    enlace.download = "ordenes_tecnoshop.csv";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(enlace.href);

    alerta.style.color = "#38bdf8";
    alerta.innerText = `¡Compra realizada con éxito, ${nombre}! Se generó y descargó tu archivo CSV ("ordenes_tecnoshop.csv").`;

    carrito = [];
    actualizarCarritoVisual();
    document.getElementById("contenedor-checkout").style.display = "none";
    document.getElementById("formCheckout").reset();

    return false;
}