const socket = io()

/* CONFIGURACION DEL FORMULARIO DE PRODUCTOS */

//Envio del formulario
let productForm = document.getElementById('productForm')
const handleSubmit = (evt, form) => {
    evt.preventDefault()
    let formData = new FormData(form)
    fetch('/upload', {
        method: 'POST',
        body: formData
        })
        .then(response => {
            console.log(response)
        })
        .then(data => {
            // Emitir evento de socket para notificar al cliente que el archivo se ha cargado correctamente
            socket.emit('product', data)
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error)
        })
    productForm.reset()
}


productForm.addEventListener('submit', (e) => handleSubmit(e, e.target))

//visualización de la tabla
const renderTable = (productos) => {
    let contenido = ''
    if (productos.length > 0) {
        contenido =
            `<table>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Foto</th>
            </tr>`
        productos.map(producto => {
            contenido += `
            <tr>
                <td>${producto.title}</td>
                <td>${producto.price}</td>
                <td><img src="/uploads/${producto.thumbnail}" class="foto"/></td>
            </tr>`
        })
        contenido += `</table>`
    } else {
        contenido = `<h2> No hay productos por mostrar </h2>`
    }
    return contenido
}
socket.on('products', data => {
    document.getElementById('table').innerHTML = renderTable(data)
})

/* CENTRO DE MENSAJES */

let sendMessage = document.getElementById('sendMessage')
let email = document.getElementById('email')
let chatBox = document.getElementById('chatBox')
let history = document.getElementById('history')
const fecha = new Date()


//Envio del mensaje

sendMessage.addEventListener('click', (e) => {
    e.preventDefault()
    if (chatBox.value.trim().length > 0 && email.value) { //el trim quita los espacios en blanco
        socket.emit('message', {
            email: email.value,
            message: chatBox.value.trim(),
            date: fecha.toLocaleString()
        }) //enviamos al app.js el {user, message}
        chatBox.value = ""
    }
})

chatBox.addEventListener('keyup', e => {
    if (email) {
        if (e.key === "Enter") {
            if (chatBox.value.trim().length > 0) { //el trim quita los espacios en blanco
                socket.emit('message', {
                    email,
                    message: chatBox.value.trim(),
                    date: date
                }) //enviamos al app.js el {user, message}
                chatBox.value = ""
            }
        }
    }

})

//Historial de chat
socket.on('history', data => { //recibimos del app.js el { emails, messages } 
    console.log(data)
    let messages = ""
    data.map(item => {
        messages += `<span class="email">${item.email}</span><span class="date">[${item.date}]</span>:<span class="message">${item.message}</span><br>`
    })
    history.innerHTML = messages
    socket.emit('historyOfMessages', messages)
})