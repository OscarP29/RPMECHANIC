document.addEventListener('DOMContentLoaded',function(){
    window.abrirEnOtraPestana = function(ruta,localicion) {
        if(localicion){
             window.open(ruta+".html","_self");
        }else{
             window.open("html/"+ruta+".html","_self");
        }
       
    }
    window.changeImage = function(element) {
            const mainImage = document.getElementById('mainImage');
            mainImage.src = element.src;
            document.querySelectorAll('.thumbnail-img').forEach(img => {
                img.classList.remove('BorderImg');
            });
            element.classList.add('BorderImg');
    }
    function obtenerIDDesdeURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("id");
    }

    async function mostrarProductoDesdeCSV(idProducto) {
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
                const imagenes = encabezados
                    .filter(encabezado => encabezado.trim().toLowerCase().startsWith("imagen"))
                    .map(encabezado => producto[encabezado.trim()])
                    .filter(Boolean);

                producto.imagenes = imagenes;
                renderizarProducto(producto);
                break;
            }
        }
    }

    function renderizarProducto(producto) {
        const contenedor = document.getElementById("producto");
        const idInputCantidad = `inputCantidad_${producto.id}`;

        contenedor.innerHTML = `
            <div class="row justify-content-center">
                <!-- Nombre y marca -->
                <div class="col-md-4 m-0 p-0 d-flex flex-column divAndroid">
                    <div class="col-md-12 px-3 d-flex mb-3 align-items-center justify-content-center flex-column">
                        <h4 class="m-0 d-inline-block">${producto.nombre}</h4>
                        <p class="text-muted d-inline-block m-0 ms-2 text-center">Marca ${producto.marca}</p>
                    </div>
                </div>

                <!-- Imágenes para PC -->
                <div class="col-md-5 d-flex m-0 p-0 flex-column flex-md-row align-items-center justify-content-center gap-3">
                    <div class="d-flex flex-md-column justify-content-center" id="carouselWin">
                        ${producto.imagenes.map(src => `<img src="${src}" class="thumbnail-img" onclick="changeImage(this)">`).join("")}
                    </div>
                    <div class="mx-auto">
                        <img id="mainImage" src="${producto.imagenes[0]}" class="main-img" alt="Imagen principal">
                    </div>

                    <!-- Carrusel móvil -->
                    <div id="carouselExampleIndicators" class="carousel slide d-md-none w-100 mt-3">
                        <div class="carousel-indicators">
                            ${producto.imagenes.map((_, i) => `
                                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}"
                                    class="${i === 0 ? 'active' : ''}" aria-label="Slide ${i + 1}"></button>
                            `).join("")}
                        </div>
                        <div class="carousel-inner">
                            ${producto.imagenes.map((src, i) => `
                                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                                    <img src="${src}" class="d-block w-100" alt="...">
                                </div>
                            `).join("")}
                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Siguiente</span>
                        </button>
                    </div>
                </div>

                <!-- Info, precio, input cantidad y botón -->
                <div class="col-md-4 m-0 p-0 d-flex flex-column align-items-center justify-content-center mt-3 mt-md-0">
                    <div class="col-md-12 px-3 py-2">
                        <h4 class="my-0 TituloPC">${producto.nombre}</h4>
                        <small class="text-muted">Marca ${producto.marca}</small>
                        <h5 class="fs-2">$ ${producto.precio}</h5>
                        <p class="text-muted">${producto.descrip}</p>

                        <label for="${idInputCantidad}" class="form-label">Cantidad</label>
                        <input id="${idInputCantidad}" type="number" value="1" min="1" max="30" class="form-control mb-3">

                        <button class="btn btn-dark w-100" onclick="irAPaginaDeCompra('${producto.id}', '${idInputCantidad}')">Comprar</button>
                    </div>
                </div>
            </div>
        `;
    }

    window.irAPaginaDeCompra = function(idProducto, idInputCantidad) {
        const cantidad = document.getElementById(idInputCantidad).value;
        const url = `Formulario.html?id=${idProducto}&cantidad=${cantidad}`;
        window.location.href = url;
    };

    function changeImage(img) {
        const main = document.getElementById("mainImage");
        main.src = img.src;
    }

    const idProducto = obtenerIDDesdeURL();
    if (idProducto) {
        mostrarProductoDesdeCSV(idProducto);
    } else {
        document.getElementById("producto").innerHTML = "<p class='text-warning'>No se especificó ningún producto.</p>";
    }

    
})