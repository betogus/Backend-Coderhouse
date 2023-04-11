# Desafio 18

## Tercera entrega del proyecto final

**

> Base de datos

> > Utilizamos mongoose. Ejecutamos como administrador la base de datos con el cmd


```
mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> Agregar los datos del usuario (photo, phone, address, etc.)

> > Modificamos el archivo index.html que se encuentra en el directorio public/register para incluir la dirección, edad, teléfono y foto de perfil al registro (en el formulario debemos recordar agregar el enctype="multipart/form-data" para que me reconozca el file de la foto de perfil). Importamos y configuramos Multer para el manejo de archivos en app.js

```
/* MULTER */
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './public/database/uploads')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
app.use(multer({ storage }).single('photo'))
```

> > Modificamos el "register" del passport.config para que además del username, email y password, reciba los demás datos.

```
 const newUser = {
    username,
    password: createHash(password), 
    email: req.body.email, 
    first_name: req.body.first_name, 
    last_name: req.body.last_name,
    age: req.body.age,
    address: req.body.address,
    phone: req.body.phone,
    photo: req.file.filename
}
```

> > El passport.config utiliza el modelo User para almacenar los datos en la base de datos, por lo que debemos incluir en la plantilla de éste la direccion, telefono, edad y foto.

```
import mongoose from "mongoose"

mongoose.connect('mongodb://localhost:27017/backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    address: { type: String, required: true },
    photo: { type: String, required: true },
    phone: { type: Number, required: true }
})

export const users = mongoose.model('user', userSchema)

```

> > Generamos una barra de navegación. Agregamos en el main.handlebars lo siguiente:

```
<body>
    <nav class="header-nav">
        <ul class="header-nav-container">
            <li class="header-nav-item"><a href="/dashboard">Inicio</a></li>
            <li class="header-nav-item"><a href="/user">Mis datos</a></li>
            <li class="header-nav-item"><a href="/cart">Carrito</a></li>
            <li class="header-nav-item"><a href='/auth/logout'>Desloguearse</a></li>
        </ul>
    </nav>
    {{{body}}}
```


> > Creamos un userRouter el cual lo importamos al app.js. En la ruta /user tenemos que tener en cuenta que si nos logueamos con google, los datos no se almacenan en la base de datos, y sólo las podemos guardar en la session. Por lo tanto, tendremos lo siguiente en el userRouter

```
import { Router } from "express"
import { isAuth } from "../middlewares/middlewares.js"
import { users } from "../models/User.js"
const router = Router()

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const userId = req.session.passport.user;
            const user = await users.findById(userId);
            res.render('user', {
                username: user.username,
                email: user.email,
                photo: user.photo,
                address: user.address,
                age: user.age,
                phone: user.phone
            });
        } catch (err) {
            const user = req.session.user
            console.log(user)
            res.render('user', {
                username: user.username,
                email: user.email,
                photo: user.photo && user.photo,
                photoURL: user.photoURL && user.photoURL,
                address: user.address && user.address,
                age: user.age && user.age,
                phone: user.phone && user.phone
            })
        }
    } else {
        res.redirect('/auth/login')
    }
    
})

export default router
```

> > Importamos el userRouter en la app.js

```
app.use('/user', userRouter)
```

> > creamos el user.handlebars

```
<div class="user-container">
    <h1 id="title">{{username}}</h1>

    <div>
        <div class="img-container">
            {{#if photo}}
            <img src="/database/uploads/{{photo}}" />
            {{else if photoURL}}
            <img src="{{photoURL}}">
            {{else}}
            <img src="/predeterminado/avatar.jpg"/>
            {{/if}}
        </div>
        <p>Email: {{email}}</p>
        <p>Dirección: {{address}}</p>
        <p>Edad: {{age}}</p>
        <p>teléfono: {{#if phone}} +54 351{{phone}} {{else}} No hay datos {{/if}}</p>

    </div>
</div>
```

> Nodemailer

> > Instalamos nodemailer con npm i nodemailer. Creamos un middleware para el envío del mail, y guardamos en el archivo .env el TEST_MAIL y el TEST_PASS que obtenemos de la siguiente URL https://security.google.com/settings/security/apppasswords al seleccionar "otra" en donde dice "seleccionar aplicación". El middleware es el siguiente:

```
import { createTransport } from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()


const transporter = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.TEST_MAIL,
        pass: process.env.TEST_PASS //Contraseña del link
    }
});

export const etherealMail = async (req, res, next) => {
    let user = req.body
    console.log(user)
    const mailOptions = {
        from: process.env.TEST_MAIL,
        to: [`${user.email}`],
        subject: "Su registro fue exitoso",
        html: `
        <h1>Se ha registrado con éxito</h1>
        <p>Sus datos son:</p>
        <ul>
            <li>Nombre de usuario: ${user.username}</li>
            <li>Contraseña: ${user.password}</li>
        </ul>
        `
    }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log(info)
        next()
    } catch (error) {
        console.log(error)
    }

} 
```

> > En authRouter agregamos el middleware. 


> > De manera similar, creamos la ruta /cart en app.js, generamos el cart.handlebars y su cart.js donde traeremos los items del carrito que están almacenados en el localStorage. En app.js realizamos la configuración para utilizar nodemailer y twilio luego de haberlo instalado. Lo importamos y generamos las rutas de tipo GET Y POST de cart. En el POST, recibiremos la lista de los productos del carrito

```
<div class="container">
    <h1 id="titulo">Carrito</h1>
    <div id="cart-container">

    </div>
    <div class="button-container">
        <button type="button" class="button" id="borrarCarrito">Borrar todo</button>
        <button type="button" class="button" id="confirmarCompra">Confirmar compra</button>
    </div>
</div>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
<script>
    /* CARGAMOS LOS PRODUCTOS DEL CARRITO */
    let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];
    let cargarCarrito = () => {
        if (productosEnElCarrito.length === 0) document.getElementById('cart-container').innerHTML = `<h3>No hay productos en el carrito</h3>`
        for (let i = 0; i < productosEnElCarrito.length; i++) {
            document.getElementById('cart-container').innerHTML += `
    <div class="product-item" id="${productosEnElCarrito[i].id}">
        <p class="product-name">Nombre: ${productosEnElCarrito[i].name}</p>
        <p class="product-price">Precio: ${productosEnElCarrito[i].precioKg}</p>
    </div>`
        }
    }
    cargarCarrito()

    /* AGREGAMOS LAS FUNCIONALIDADES DE LOS BOTONES */
    let borrarCarrito = document.getElementById('borrarCarrito')
    let confirmarCompra = document.getElementById('confirmarCompra')
    //Borrar productos del carrito
    borrarCarrito.addEventListener("click", () => {
        productosEnElCarrito = []
        localStorage.setItem("productos", JSON.stringify(productosEnElCarrito));
        cargarCarrito()
    })
    //Confirmar compra

    confirmarCompra.addEventListener('click', async () => {
        if (productosEnElCarrito.length === 0) return "no hay productos"
        await fetch('/cart', {
            method: 'POST',
            body: JSON.stringify(productosEnElCarrito),
            headers: {
                'Content-Type': "application/json"
            }
        })
            .then(response => {
                if (response.status === 200) {
                    Toastify({
                        text: `Se realizó la compra con éxito`,
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
            })
        productosEnElCarrito = []
        localStorage.setItem("productos", JSON.stringify(productosEnElCarrito));
        cargarCarrito()
    })
</script>
```
> > cartRouter

```
import { Router } from "express";
import { users } from "../models/User.js";
import dotenv from 'dotenv'
import { transporter } from "../middlewares/middlewares.js";
import twilio from 'twilio'
dotenv.config()
const router = Router()

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('cart')
    } else {
        res.redirect('/auth/login')
    }
})



router.post('/', async (req, res) => {
    const userId = req.session.passport.user;
    const user = await users.findById(userId);
    let productosEnElCarrito = (req.body)
    let contenidoEmail = `
        <h3>Productos a enviar: <h3>
        <ul>
        `
    productosEnElCarrito.map(item => {
        contenidoEmail += `<li>nombre: ${item.name}, precio: ${item.precioKg}</li>`
    })
    contenidoEmail += `</ul>`
    let contenidoMensaje = ``
    productosEnElCarrito.map(item => contenidoMensaje += `nombre: ${item.name}, precio: ${item.precioKg}`)

    //nodemailer
    const mailOptions = {
        from: process.env.TEST_MAIL,
        to: user.email,
        subject: `Nuevo pedido de ${user.username}`,
        html: contenidoEmail
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('Error al enviar el correo electrónico');
        } else {
            console.log('Correo electrónico enviado: ' + info.response);
            res.status(200).send('Correo electrónico enviado con éxito');
        }
    });
    //twilio
    if (user.phone) {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = twilio(accountSid, authToken);
        client.messages
            .create({
                from: 'whatsapp:+14155238886',
                body: `Nuevo pedido de ${user.username}. ${contenidoMensaje}`,
                to: `whatsapp:+54351${user.phone}`
            })
            .then(message => console.log(message.sid));
    } 
})
export default router
```