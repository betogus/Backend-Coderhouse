import { PRODUCTS } from "./database/archivos/productos.js";



let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];
let agregarAlCarrito = document.getElementById('products-container')
agregarAlCarrito.onclick = e => {
    if (e.target.parentNode.className == "item-container") {
        let idProductoSeleccionado = e.target.parentNode.id
        let productoSeleccionado = PRODUCTS.find(item => item.id === parseInt(idProductoSeleccionado))
        productosEnElCarrito.push(productoSeleccionado)
        localStorage.setItem("productos", JSON.stringify(productosEnElCarrito));
        //Toastify
        Toastify({
            text: `Se agregó ${productoSeleccionado.name} al carrito`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to top, rgb(101,65,245), 100%, rgb(32,32,60), 100%);"
            },
        }).showToast();
    }
}