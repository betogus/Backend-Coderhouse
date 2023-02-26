# Desafio 4 

## API RESTful

**Consigna:**
Realizar un proyecto de servidor basado en node.js y express que
ofrezca una API RESTful de productos. En detalle, que incorpore las siguientes
rutas:
● GET '/api/productos' -> devuelve todos los productos.
● GET '/api/productos/:id' -> devuelve un producto según su id.
● POST '/api/productos' -> recibe y agrega un producto, y lo devuelve con su id
asignado.
● PUT '/api/productos/:id' -> recibe y actualiza un producto según su id.
● DELETE '/api/productos/:id' -> elimina un producto según su id.
Cada producto estará representado por un objeto con el siguiente formato:
- Cada ítem almacenado dispondrá de un id numérico proporcionado por el backend,
comenzando en 1, y que se irá incrementando a medida de que se incorporen
productos. Ese id será utilizado para identificar un producto que va a ser listado en
forma individual.
Para el caso de que un producto no exista, se devolverá el objeto:
{ error : 'producto no encontrado' }
- Implementar la API en una clase separada, utilizando un array como soporte de
persistencia en memoria.
- Incorporar el Router de express en la url base '/api/productos' y configurar todas las
subrutas en base a este.
- Crear un espacio público de servidor que contenga un documento index.html con un
formulario de ingreso de productos con los datos apropiados.
- El servidor debe estar basado en express y debe implementar los mensajes de conexión
al puerto 8080 y en caso de error, representar la descripción del mismo.
- Las respuestas del servidor serán en formato JSON. La funcionalidad será probada a
través de Postman y del formulario de ingreso.

> Solución:


> > Instalamos handlebars

```
npm i express-handlebars
```

> > Configuramos el app.js para utilizar handlebars

```
const handlebars = require('express-handlebars')
app.engine('handlebars', handlebars.engine()) //establecemos la configuracion de handlebars
app.set('views', './src/public/views/handlebars') //establecemos el directorio donde se encuentran los archivos de plantilla
app.set('view engine', 'handlebars') //establecemos el motor de plantilla que se utiliza
```

> > Creamos el archivo main.handlebars dentro de src/public/views/handlebars/layouts. En el body es donde se van a renderizar los demás archivos handlebars

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Desafio 3</title>
</head>
<body>
    {{{body}}}
</body>
</html>

```

> > Creamos el archivo dashboard.handlebars que se encuentra en src/public/views/handlebars. Le agregamos el botón para volver al formulario. Además, utilizaremos la ruta del src de las img como /uploads

```
<h1>Vista de Productos</h1>
{{#if productos}}
    {{#each productos}}
        <table>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Foto</th>
            </tr> 
            <tr>
                <td>{{this.title}}</td>
                <td>{{this.price}}</td>
                <td><img src="/uploads/{{this.thumbnail}}" class="foto"/></td>
            </tr>
        </table>
    {{/each}}
{{else}}
    <h2>No hay productos por mostrar</h2>
{{/if}}

<button id="button"><a href='/'>Ir al formulario</a></button>
```

> > Para que me reconozca la ruta de la imagen que se encuentra en src/database/uploads, debemos configurar el app.js 

```
app.use('/uploads', express.static('src/database/uploads'))
```


> > Modificamos la ruta GET dentro de productRouter para que me renderice el dashboard y le pasamos los productos

```
router.get('/', async (req, res) => {
    let productos;
    await contenedor.getAll().then(result => productos = result)
    res.render('dashboard', {productos})
})
```

> > Modificamos la ruta POST dentro de productRouter para que me redirija al metodo GET

```
router.post('/', noEmptyFields, async (req, res) => {
    let producto = req.body
    let mensaje
    producto.thumbnail = req.file.filename
    await contenedor.save(producto).then(result => mensaje = result)
    res.redirect('/api/productos')
})
```

> > Ahora haremos el mismo procedimiento pero utilizando pug. Instalamos pug

```
npm i pug
```

> > Importamos pug en el app.js

```
npm i pug
```


> > Creamos el archivo dashboard.pug dentro de src/public/views/pug y en app.js hacemos la configuracion

```
app.set('view engine', 'pug')
app.set('views', './src/public/views/pug')
```

> > Del mismo modo haríamos con EJS

