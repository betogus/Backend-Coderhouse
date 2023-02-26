# Desafio 4 

## API RESTful

**Consigna:**
1) Utilizando la misma API de productos del proyecto entregable de la clase
anterior, construir un web server (no REST) que incorpore:
a) Un formulario de carga de productos en la ruta raíz (configurar la ruta
'/productos' para recibir el POST, y redirigir al mismo formulario).
b) Una vista de los productos cargados (utilizando plantillas de
handlebars) en la ruta GET '/productos'.
c) Ambas páginas contarán con un botón que redirija a la otra.
2) Manteniendo la misma funcionalidad reemplazar el motor de plantillas
handlebars por pug.
3) Manteniendo la misma funcionalidad reemplazar el motor de plantillas
handlebars por ejs.
4) Por escrito, indicar cuál de los tres motores de plantillas prefieres para tu
proyecto y por qué.

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

