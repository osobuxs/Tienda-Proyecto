class Producto {
    constructor(idProducto, nombreProducto, marcaProducto, categoria, descripcionProducto, precio, img) {
        this.idProducto = idProducto;
        this.nombreProducto = nombreProducto;
        this.marcaProducto = marcaProducto;
        this.categoria = categoria;
        this.descripcionProducto = descripcionProducto;
        this.precio = precio
        this.img = img;
    }
}

class Carrito {
    constructor(productos) {
        this.productos = productos;
    }

    agregarAlCarrito(producto) {
        this.productos.push(producto);
        localStorage.setItem('Carrito', JSON.stringify(this.productos));
        let contadorCarrito = document.getElementById("contadorCarrito");
        contadorCarrito.innerHTML = this.productos.length;
    }

    totalCarrito() {
        let total = 0;
        for (const producto of this.productos) {
            total = total + producto.precio;
        }
        let bodyCarrito = document.getElementById("bodyCarrito")
        let contenedor = document.createElement("tr");
        contenedor.innerHTML = `
                                    <th scope="row"></th>
                                    <td colspan=3>Total:</td>
                                    <td>$${total}</td>
                                    `;
        bodyCarrito.appendChild(contenedor);
    }

    listarProductos() {
        let bodyCarrito = document.getElementById("bodyCarrito")
        bodyCarrito.innerHTML = "";
        for (const producto of this.productos) {
            let contenedor = document.createElement("tr");
            contenedor.innerHTML = `
                                    <th scope="row">${producto.idProducto}</th>
                                    <td>${producto.nombreProducto}</td>
                                    <td>${producto.categoria}</td>
                                    <td>$${producto.precio}</td>
                                    <td class="btnEliminarProducto"><button type="button" class="btn btn-danger btn-sm p-2">X</button></td>
                                    `;
            bodyCarrito.appendChild(contenedor);
        };
        this.totalCarrito()
    }
}
class Tienda {
    constructor(nombre, direccion, telefono, baseDeDatos) {
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.baseDeDatos = baseDeDatos;
    }
    filtrarProductoPorCategoria(valor, carrito) {
        let espacioProductos = document.getElementsByClassName("contenedorProductos")
        espacioProductos[0].innerHTML = "";
        const encontrado = this.baseDeDatos.filter(producto => producto.categoria == valor);
        this.listarProductos(encontrado, carrito);
        //eventosBotones(carrito);
        //btnComprarOnClic(carrito);
    };

    buscarProductoPorId(valorId) {
        const encontrado = this.baseDeDatos.find(producto => producto.idProducto == valorId);
        return encontrado;
    };

    listarProductos(baseDeDatos, carrito) {
        let espacioProductos = document.getElementsByClassName("contenedorProductos")
        espacioProductos[0].innerHTML = "";
        for (const producto of baseDeDatos) {
            let contenedor = document.createElement("div");
            contenedor.className = "col bg-dark text-white m-3 text-sm-center p-1";
            contenedor.innerHTML = `
                                    <img class="img-fluid" src="../img/${producto.img}" alt="bebida">
                                    <p> ${producto.nombreProducto}</p>
                                    <h4> $${producto.precio} </h4>
                                    <button id="${producto.idProducto}" type="button" class="btn btn-primary btnComprar">Comprar</button>                                
                                `;
            espacioProductos[0].appendChild(contenedor);
            //eventosBotones(carrito);
            btnComprarOnClic(carrito);
        }
    }
}

const baseDeDatos = [
    { idProducto: 1, nombreProducto: "Pack 12 Cervezas Budweiser 710ml + Accesorios", marcaProducto: 'Budweiser', categoria: 'Cerveza', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 3945, img: "pack12CervezasBudweiser710ml_Accesorios.png" },
    { idProducto: 2, nombreProducto: "Pack 24 Cervezas Corona 710ml", marcaProducto: 'Corona', categoria: 'Cerveza', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 4300, img: "cervezaCorona.png" },
    { idProducto: 3, nombreProducto: "Pack 48 Cervezas Stella Artois Lager Lata 473ml", marcaProducto: 'Stella Artois', categoria: 'Cerveza', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 4620, img: "pack48CervezasStellaArtoisLata473ml.png" },
    { idProducto: 4, nombreProducto: "Pack 6 Espumantes", marcaProducto: 'Varios', categoria: 'Vino', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 2754, img: "pack6Espumantes.png" },
    { idProducto: 5, nombreProducto: "Pack 6 Vinos Premium", marcaProducto: 'Varios', categoria: 'Vino', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 5442, img: "botellaLPQTP2020.png" },
    { idProducto: 6, nombreProducto: "Pack 24 Cervezas Patagonia 24.7 Lata 473ml", marcaProducto: 'Patagonia', categoria: 'Cerveza', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 300, img: "cervezaPatagonia.png" },
    { idProducto: 7, nombreProducto: "Pack 12 Cervezas Brahma Lata 473ml + Conservadora", marcaProducto: 'Brahma', categoria: 'Cerveza', descripcionProducto: 'Lorem Ipsum is simply dummy text of the ', precio: 3852, img: "PackConservadoraBrahma_12CervezasBrahmLata473ml.png" },
];

const tienda = new Tienda('Brooklyn', 'Avellaneda 334', 4885548, baseDeDatos);

function programa() {
    const carrito = new Carrito([]);
    
    tienda.listarProductos(tienda.baseDeDatos);
    btnComprarOnClic(carrito);
    verificarLocalStorage(carrito);
    eventosBotones(carrito);

}

function btnComprarOnClic(carrito) {
    let botones = document.getElementsByClassName('btnComprar');
    for (const boton of botones) {
        boton.onclick = function(){
            let producto = tienda.buscarProductoPorId(boton.id);
            carrito.agregarAlCarrito(producto);
        }
    }
}

function selectFiltroOnChange(carrito) {
    let filtroProductos = document.getElementById('filtroCategorias')
    filtroProductos.addEventListener('change', function () {
        if (this.value != "Todos") {
            tienda.filtrarProductoPorCategoria(this.value, carrito);
        } else {
            tienda.listarProductos(tienda.baseDeDatos, carrito);
        }
    })
}

function verificarLocalStorage(carrito) {

    if ('Carrito' in localStorage) {
        const productosStorage = JSON.parse(localStorage.getItem("Carrito"));
        for (const producto of productosStorage) {
            carrito.productos.push(producto);
        }

    } else {
        carrito.productos = [];
    }
    let contadorCarrito = document.getElementById("contadorCarrito");
    contadorCarrito.innerHTML = carrito.productos.length;
}
function carritoOnClick(carrito) {
    let btnCarrito = document.getElementById('btnCarrito')
    btnCarrito.onclick = function () {
        carrito.listarProductos(carrito)
    }
}

function VaciarCarritoOnClick(carrito) {
    let btnVaciar = document.getElementById('btnVaciarCarrito')
    btnVaciar.onclick = function () {
        localStorage.clear();
        //verificarLocalStorage(carrito);
        carrito.productos = [];
        let contadorCarrito = document.getElementById("contadorCarrito");
        contadorCarrito.innerHTML = 0;
        carrito.listarProductos();
    }
}

function eventosBotones(carrito) {
    
    selectFiltroOnChange(carrito);
    carritoOnClick(carrito);
    VaciarCarritoOnClick(carrito);
}