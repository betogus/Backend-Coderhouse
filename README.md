> > Instalamos cookie-parser, session y mongoose

```
 npm i cookie-parser --save
 npm i express-session mongoose
```


> > Creamos la clase UserModel la cual almacenará en la base de datos "backend" de mongo atlas los datos del usuario. src/models/User.js

```
import mongoose from "mongoose"

mongoose.connect('mongodb://localhost:27017/backend', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
})

export const userModel = mongoose.model('user', userSchema)
```

> > Abrimos el cmd como admin y ponemos lo siguiente:

```
mongod --dbpath "C:\Program Files\MongoDB\miBaseDeDatos"
```

> > Creamos la sesion en el app.js e importaremos el authRouter que luego configuraremos

```
import authRouter from './routes/authRouter.js'
import session from "express-session";
import cookieParser from "cookie-parser";

app.use(cookieParser())
app.use(session({
    key: 'user_sid', //sid = session id
    secret: 'c0d3r',
    resave: true,
    cookie: {maxAge: 60000},
    saveUninitialized: true
}))

app.use('/auth', authRouter)
```

> > Creamos un middleware que verifique si estamos logueados trayendo los datos de la session y de la cookie. src/middlewares/middlewares.js

```
export const isAuth = (req, res, next) => {
    if (req.session?.user && req.cookies?.user_sid) return next()
    else res.redirect("/auth/login")
}
```

> > Utilizamos el middleware en en productRouter. Además traeremos los datos de la cookie y de la session para renderizar el username en el handlebars.

```
import { Router } from "express";
import { isAuth } from "../middlewares/middlewares.js";
import ProductService from "../services/ProductService.js";

const router = Router()
const productManager = new ProductService()

router.get('/', isAuth, async (req, res) => {
    let products = await productManager.getProducts()
    let user = req.cookies?.user || req.session?.user
    res.render('dashboard', {user, products} )

}) 

export default router
```

> > Crearemos un router llamado authRouter en el cual se encontrarán las rutas de login, register y logout. Para ello crearemos el login.html y el register.html. src/routes/authRouter.js:

```
import { Router } from "express";
import path from 'path'
import { isAuth } from "../middlewares/middlewares.js";
import { UserModel } from "../models/User.js";

const router = Router()
const __dirname = path.resolve();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/register/index.html'))
})

router.post('/register', async (req, res) => {
    let {username, email, password} = req.body
    let user = new UserModel({
        username: username,
        email: email,
        password: password
    })
    try {
        let findUser = await UserModel.findOne({username}).exec()
        if (!findUser) {
            let newUser = await user.save() 
            req.session.user = newUser 
            res.redirect('/products') 
        } else {
            res.redirect('/auth/register')
        }
    } catch (err) {
        console.log("err" + err)
    }
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/login/index.html'))
})

router.post('/login', async (req, res) => {
    let { username, password } = req.body
    try {
        let user = await UserModel.findOne({username}).exec()
        if (!user || user.password != password) {
           res.redirect('/auth/login')
        }
        req.session.user = user
        res.redirect('/products')
        }
    catch(err) {
        console.log("err:" + err)
    }

})

router.get('/logout', isAuth, (req, res) => {
    let {username} = req.session.user
    res.render('logout', {username})
})

router.get('/clearCookies', (req, res) => {
    res.clearCookie('user_sid')
    req.session.destroy()
    res.redirect('/auth/login')
})

export default router
```

> > Para el logout se utilizará un handlebars cuyo script nos redirigirá a los 2 seg. al /auth/clearCookies

```
<h1>Hasta pronto {{username}}</h1>
<script>
    setTimeout(()=> {
        window.location.href ='/auth/clearCookies'
    },2000)
     
</script>
```


