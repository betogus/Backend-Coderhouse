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


> > Creamos una carpeta public donde tendremos un product.html con un formulario. El mismo nos redirigirá a la ruta /api/productos con el método POST.

> > Instalamos multer

```
npm i express multer
```

> > Creamos una carpeta route con un archivo productRouter.js el cual tendrá las rutas api/productos. En el mismo se hará uso de la clase Contenedor el cual se encarga de guardar, modificar, borrar y leer los productos que se encuentran en el archivo.json. Además creamos un middleware llamado noEmptyFields que permite validar que se hayan ingresado todos los datos. También se hará uso del middleware Multer

> > En el archivo app.js utilizamos el router y creamos otra ruta que corresponderá al formulario product.html. Para que la app pueda interpretar los datos en formato json, debemos agregar la siguiente línea de código:
app.use(express.json())
Y para que pueda leer el product.html de la carpeta public, agregamos lo siguiente:
app.use(express.static('public'))

> > Podemos hacer uso de Thunder Client para las ruta api/productos con los métodos GET, POST, PUT y DELETE. Con el formulario html podremos hacer sólo uso del método POST.