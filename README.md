# Desafio 4 

## API RESTful

**Consigna:**
1) Modificar el último entregable para que disponga de un canal de websocket que
permita representar, por debajo del formulario de ingreso, una tabla con la lista de productos en
tiempo real.
- Puede haber varios clientes conectados simultáneamente y en cada uno de ellos se reflejarán
los cambios que se realicen en los productos sin necesidad de recargar la vista.
- Cuando un cliente se conecte, recibirá la lista de productos a representar en la vista.
2) Añadiremos al proyecto un canal de chat entre los clientes y el servidor.
- En la parte inferior del formulario de ingreso se presentará el centro de mensajes almacenados en el
servidor, donde figuren los mensajes de todos los usuarios identificados por su email.
- El formato a representar será: email (texto negrita en azul) [fecha y hora (DD/MM/YYYY
HH:MM:SS)](texto normal en marrón) : mensaje (texto italic en verde)
- Además incorporar dos elementos de entrada: uno para que el usuario ingrese su email (obligatorio
para poder utilizar el chat) y otro para ingresar mensajes y enviarlos mediante un botón.
- Los mensajes deben persistir en el servidor en un archivo (ver segundo entregable).

> 1) Solución: Websocket en la lista de Productos


> > Instalamos socket

```
npm i socket.io
```

> > Importamos la librería y realizamos la configuración en app.js

```
const { Server} = require('socket.io')
const io = new Server(server)
```

> > Incorporamos el script de socket en el dashboard e inicializamos el canal de Websocket. Esta inicialización lo haremos desde un script llamado index.js que se encuentra en la carpeta public. Nuestro dashboard.handlebars quedaría de la siguiente manera:

```
<h1>Formulario de productos</h1>
<form id="productForm" action="/api/productos" enctype="multipart/form-data" method="POST">
    <label>Título:</label>
    <input type="text" name="title" required/>
    <label>Precio:</label>
    <input type="number" name="price" required/>
    <label>Inserte una imagen:</label>
    <input type="file" name="thumbnail" required/>
    <input type="submit" value="Subir Archivo" />
</form>
<div id="empyFields"></div>
<h1 id="titulo">Vista de Productos</h1>
<div id="table"></div>

<script src="/socket.io/socket.io.js"></script>
<script src="/public/index.js"></script>
```

> > Para que me reconozca el directorio donde se encuentra el index, debemos poner lo siguiente en app.js:

```
app.use('/public', express.static('src/public'))
```

> > En el index.js haremos la tabla de los productos, inicializamos socket desde el cliente, y enviaremos al backend el formulario. Para el formulario debemos hacer un fetch cuyo body sea el formData

```
const socket = io()

/* CONFIGURACION DEL FORMULARIO DE PRODUCTOS */

//Envio del formulario
let productForm = document.getElementById('productForm')
const handleSubmit = (evt, form, route) => {
    evt.preventDefault()
    let formData = new FormData(form)
    fetch(route, {
        method: "POST",
        body: formData
    })
}

productForm.addEventListener('submit', (e) => handleSubmit(e, e.target, '/api/productos'))

//visualización de la tabla
const renderTable = (productos) => {
    let contenido = ''
    if (productos) {
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

```

> > En app.js ahora quitaremos el product.html y lo redirigiremos directamente al /api/productos. Además estableceremos la conexión socket con el cliente

```
app.get('/',  (req, res) => {
    res.redirect('/api/productos')
})

/* WEBSOCKET */

io.on('connection', async socket => {
    console.log('Socket connected!')
    let productos;
    await contenedor.getAll().then(result => productos = result)
    socket.emit('products', productos)
})
```

> > Finalmente modificamos las rutas /api/productos de los métodos GET y POST dentro de productRouter

```
router.get('/', async (req, res) => {
    res.render('dashboard')
})

router.post('/', noEmptyFields, async (req, res) => {
    let producto = req.body
    producto.thumbnail = req.file.filename
    await contenedor.save(producto).then(result =>  result)
})
```

> 2) Solución: Websocket en el chat


> > Creamos nuestro div de centro de mensajes en el dashboard.handlebars

```
<div id="messageContainer">
    <h1>Centro de Mensajes</h1>
    <form id="formMessages">
         <input type="email" placeholder="tuemail@tuemail.com" name="email" id="email" required/>
         <p id="history"></p>
         <input id="chatBox" required/>
         <input id="sendMessage" type="submit" value="Enviar"/>
    </form>
</div>
```

> > Permitiremos que el usuario pueda enviar su mensaje al ingresar su email y apretando en el botón Enviar o simplemente haciendo enter. Para ello modificamos el index:

```
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

```
> > Desde el backend en app.js creamos dos funciones: una para escribir en un archivo el historial de mensajes, y otro para leerlo. En primer lugar lo leemos y lo guardamos en la variable history. Traemos del front el mensaje del usuario, la agregamos al historial y la emitimos de vuelta con el io.emit. Además debemos enviar el historial a los usuarios que recién se conectan con un socket.emit

```
io.on('connection', async socket => {

    /* PRODUCTOS */
    ...


    /* MENSAJES */
    history = readHistoryOfMessages()
    socket.on('message', data => { //recibimos del index.js el {email, message}
        history.push(data)
        io.emit('history', history) //enviamos a index.js el log a todos los usuarios
        writeHistoryOfMessages(history)
    })
    socket.emit('history', history) //Para que el que se conecte, le lleguen todos los chats
})

/* Agregamos el historial de chat a un archivo messages.txt */

const writeHistoryOfMessages = (messages) => {
    console.log(messages)
    messages = JSON.stringify((messages), null, 2)
    try {
        fs.writeFileSync("./src/database/messages.txt", messages)
        console.log({
            message: "se añadio con exito",
            messages
        })
    } catch (err) {
        console.log('Error en la escritura', err)
    }
}

const readHistoryOfMessages = () => {
    try {
        let data = fs.readFileSync("./src/database/messages.txt", 'utf8');
        history = data.length > 0 ? JSON.parse(data) : [];
    } catch (err) {
        console.log('Error en la lectura del archivo', err)
    }
    return history
}

```