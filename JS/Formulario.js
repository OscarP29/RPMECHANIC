function obtenerParametrosDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        id: params.get("id"),
        cantidad: params.get("cantidad")
    };
}

async function mostrarResumenCompra(idProducto, cantidad) {
    const resp = await fetch('../CSV/Producto.csv');
    const texto = await resp.text();
    const lineas = texto.trim().split("\n");
    const encabezados = lineas.shift().split(";");

    for (let linea of lineas) {
        const valores = linea.split(";");
        const producto = {};
        encabezados.forEach((clave, i) => {
            producto[clave.trim()] = valores[i]?.trim();
        });

        if (producto.id == idProducto.toString()) {
            const imagen = encabezados
                .filter(key => key.toLowerCase().startsWith("imagen"))
                .map(key => producto[key.trim()])
                .find(src => src && src !== "");

            const precioLimpio = parseInt(producto.precio.replace(/\./g, ""));
            const total = precioLimpio * parseInt(cantidad);
            const totalFormateado = total.toLocaleString("es-CO");

            document.getElementById("resumenCompra").innerHTML = `
                <div class="col-md-12 bg-light p-3 TarjetaContenido">
                    <div class="ContenedorImg">
                        <img src="${imagen}" alt="">
                    </div>
                    <div class="px-2 mt-2 m-0 p-0">
                        <h4 class="my-0 TituloPC">${producto.nombre}</h4>
                        <small class="text-muted">Marca ${producto.marca}</small>
                        <p class="text-muted m-0">Cantidad: ${cantidad}</p>
                        <h5 class="fs-4 text-success">$ ${totalFormateado}</h5>
                    </div>
                </div>
            `;
            break;
        }
    }
}

const { id, cantidad } = obtenerParametrosDesdeURL();
if (id && cantidad) {
    mostrarResumenCompra(id, cantidad);
} else {
    document.getElementById("resumenCompra").innerHTML = "<p class='text-danger'>Faltan datos para mostrar el resumen.</p>";
}
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const idProducto = params.get('id');
  const cantidad = params.get('cantidad');
  let productoData = null;

  fetch('../CSV/Producto.csv')
    .then(r => r.text())
    .then(texto => {
      const líneas = texto.trim().split('\n');
      const encabezados = líneas.shift().split(';');

      for (let linea of líneas) {
        const valores = linea.split(';');
        const producto = {};
        encabezados.forEach((k, i) => {
          producto[k.trim()] = valores[i]?.trim();
        });

        if (producto.id === idProducto) {
          productoData = producto;
          break;
        }
      }
    });

  document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();

    if (!productoData) {
      alert("Los datos del producto aún no están listos.");
      return;
    }
    const precioLimpio = parseInt(productoData.precio.replace(/\./g, ''));
    const total = precioLimpio * parseInt(cantidad);

    const totalFormateado = total.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    });
    const form = e.target;
    const templateParams = {
      user_name: form.user_name.value,
      user_email: form.user_email.value,
      user_id_type: form.user_id_type.value,
      user_id_number: form.user_id_number.value,
      user_address: form.user_address.value,
      product_id: productoData.id,
      product_name: productoData.nombre,
      product_marca: productoData.marca,
      product_precio: productoData.precio,
      product_cantidad: cantidad,
      total: total
    };

    emailjs.send("service_5aq13rr", "template_83elaz5", templateParams)
      .then(() => {
        const modalEl = document.getElementById('successModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();

        modalEl.addEventListener('hidden.bs.modal', () => {
          window.location.href = `Producto.html?id=${idProducto}`;
        });
      })
      .catch(error => {
        console.error('Error al enviar el correo:', error);
        alert("Hubo un error al enviar el pedido. Intenta nuevamente.");
      });
  });
});
