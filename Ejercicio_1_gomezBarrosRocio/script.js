let carrito = [];

function agregarAlCarro(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    actualizarCarrito();
}

function actualizarCarrito() {
    let lista = document.getElementById("lista-carrito");
    let totalSpan = document.getElementById("total-precio");
    let btnFinalizar = document.getElementById("btn-finalizar");

    lista.innerHTML = "";

    if (carrito.length === 0) {
        lista.innerHTML = '<li class="carrito-vacio">El carrito está vacío.</li>';
        totalSpan.innerText = "0";
        btnFinalizar.style.display = "none"; 
        document.getElementById("checkout-seccion").style.display = "none"; 
        return;
    }

    let total = 0;

    carrito.forEach((producto) => {
        total += producto.precio;
        let item = document.createElement("li");
        item.innerHTML = `${producto.nombre} <span>$${producto.precio.toLocaleString()}</span>`;
        lista.appendChild(item);
    });

    totalSpan.innerText = total.toLocaleString();
    btnFinalizar.style.display = "block"; 
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

function mostrarCheckout() {
    let seccionCheckout = document.getElementById("checkout-seccion");
    seccionCheckout.style.display = "block";
    seccionCheckout.scrollIntoView({ behavior: 'smooth' }); 
}

function procesarPedido(evento) {
    evento.preventDefault();

    const nombre = document.querySelector("#cliente-nombre").value.trim();
    const telefono = document.querySelector("#cliente-telefono").value.trim();
    const modalidad = document.querySelector("#modalidad").value;
    const pago = document.querySelector("#pago").value;
    let mensajeExito = document.getElementById("mensajeExitoPedido");

    if (nombre === "" || telefono === "" || modalidad === "" || pago === "") {
        alert("Por favor, completá todos los campos del pedido.");
        return false;
    }

    if (carrito.length === 0) {
        alert("El carrito está vacío. Agregá productos antes de confirmar.");
        return false;
    }

    const encabezado = "Nombre,Telefono,Modalidad,Pago,Producto,Precio";

    let filasCSV = "";

    carrito.forEach(item => {
        const datosFila = [
            nombre,
            telefono,
            modalidad,
            pago,
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
    enlace.download = "pedidos_cafe.csv";

    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    URL.revokeObjectURL(enlace.href);

    mensajeExito.innerText = `¡Muchas gracias por tu compra, ${nombre}! Tu pedido se registró con éxito y se descargó el archivo CSV ("pedidos_cafe.csv").`;

    carrito = [];
    actualizarCarrito();
    document.getElementById("formCheckout").reset();

    return false;
}