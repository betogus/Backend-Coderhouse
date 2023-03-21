> > instalamos knex, mysql y sqlite3. Levantamos el servidor abriendo el panel de control de Xampp y activando Apache y MySWL (puede que sea necesario crear la base de datos antes de usarla). Creamos la carpeta options dentro de src, donde tendremos el mysql.config.js. Verificar si el mismo tiene password. Puede que no tenga, puede que sea "root" o "password". 

```
const configMySQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'pruebamysql'
    }
}
```

> > En src/models/Contenedor.js modificamos la clase, de tal manera que utilice knex y que le pasemos por parámetro la configuración y el nombre de la tabla.

```
const knex = require('knex')

class Contenedor {
    constructor(config, table) {
        this.db = knex(config)
        this.table = table

    }
    createTable = async () => {
        await this.db.schema.createTable(this.table, table => {
                table.increments('id');
                table.string('title');
                table.decimal('price');
                table.string('thumbnail');
            })
            .then(console.log('Table created!'))
            .catch(err => console.log('Ya existe la tabla'))
    }

    insertData = async (product) => {
        await this.db(this.table).insert(product)
            .then(() => console.log('product inserted'))
            .catch(err => console.log(err))
    }
    getAll = async () => {
        let data = await this.db.from(this.table).select('*')
        return (JSON.parse(JSON.stringify(data)))
    }
}


module.exports = Contenedor
```

> > En app.js usaremos multer para recibir por POST en la ruta /uploads los datos del formulario que enviamos desde la ruta /api/productos que renderiza el dashboard.handlebars. Cuando recibimos dichos datos, utilizamos la clase Contenedor para insertar los datos en la base de datos.

```
const contenedor = new Contenedor(configMySQL, "products")

/* MULTER */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/database/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
app.use(multer({ storage }).single('thumbnail'))

app.post('/upload', async (req, res) => {
    let producto = req.body
    producto.thumbnail = req.file.filename
    await contenedor.insertData(producto)
    .then(result => res.status(200).send(result))
    .catch(err => res.send({error: 0, descripcion: err})) 
})
```

> >  Luego, desde el index.js (lado del cliente) enviamos por websocket el nombre "product" al servidor para que éste se encargue de actualizar la tabla de productos. 

```
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
```

> > Desde app.js, nos encargamos de obtener todos los productos de la tabla y reenviarla al cliente

```
console.log('Socket connected!')
    let productos;
    await contenedor.createTable()
    productos = await contenedor.getAll()
    io.emit('products', productos)
    socket.on('product', async data => {
        productos = await contenedor.getAll()
        io.emit('products', productos)
    }) 
     socket.emit('products', productos) //para que el que se conecte, le lleguen todos los productos
```

> > Luego para el chat el proceso es similar. Creamos el archivo db.sqlite dentro de ecommerce que está en database. Creamos la configuración en src/options/db.config:

```
const configSqlite = {
    client: 'sqlite3',
    connection: {
        filename: './src/database/ecommerce/db.sqlite'
    },
    useNullAsDefault: true
}
```

> > Creamos la clase Mensajes dentro de model

```
const knex = require('knex')

class Mensajes {
    constructor(config, table) {
        this.db = knex(config)
        this.table = table

    }
    createTable = async () => {
        await this.db.schema.createTable(this.table, table => {
                table.increments('id');
                table.string('email');
                table.string('message');
                table.string('date');
            })
            .then(console.log('Table created!'))
            .catch(err => console.log('Ya existe la tabla'))
    }

    insertData = async (chat) => {
        await this.db(this.table).insert(chat)
            .then(() => console.log('chat inserted'))
            .catch(err => console.log(err))
    }
    getAll = async () => {
        let data = await this.db.from(this.table).select('*')
        return (JSON.parse(JSON.stringify(data)))
    }
}


module.exports = Mensajes

```

> > Solamente necesitaremos modificar el app.js para recibir los chats del lado del cliente

```
const mensajes = new Mensajes(configSqlite, 'mensajes')
...
//WEBSOCKET
await mensajes.createTable()
    let history = await mensajes.getAll()
    socket.on('message', async data => { //recibimos del index.js el {email, message}
        await mensajes.insertData(data)
        history = await mensajes.getAll()
        io.emit('history', history) //enviamos a index.js el log a todos los usuarios
    })
    socket.emit('history', history) //Para que el que se conecte, le lleguen todos los chats
```