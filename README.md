> > Instalamos los paquetes necesarios:

```
npm i passport passport-local bcrypt connect-mongo
```

> > Modificamos el User Schema de mongoose para tener en cuenta la dirección, edad, nombre y apellido. En el register.html debemos agregar dichos campos en el formulario. Creamos un archivo utils.js en el cual se encontrarán los métodos para encriptar la contraseña.

```
import bcrypt from 'bcrypt'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValid = (user, password) => bcrypt.compareSync(password, user.password)

```

> > Creamos un archivo passport.config dentro de options donde se encontrarán los localStrategies de logueo y de registro

```
import passport from 'passport';
import local from 'passport-local'
import { users } from '../models/User.js';
import { createHash, isValid } from '../../utils.js';

const LocalStrategy = local.Strategy

export const initializePassport = () => {
    passport.use(
        'register',
        new LocalStrategy(
            {passReqToCallback: true},
            async (req, username, password, done) => {
                try {
                    let user = await users.findOne({username})
                    if (user) return done(null, false) //te envia un error (null) y la data(falso)
                    const newUser = {
                        username,
                        password: createHash(password), 
                        email: req.body.email, 
                        first_name: req.body.first_name, 
                        last_name: req.body.last_name,
                        age: req.body.age,
                    }
                    try {
                        let result = await users.create(newUser)
                        return done(null, result)
                    } catch (err) {
                        done(err)
                    }
                }
                catch (err) {
                    done(err)
                }
            }
        )
    )
    passport.serializeUser((user, done) => {
        done(null, user)
    })
    passport.deserializeUser( async (user, done) => {
        done(null, user);
    })

    passport.use(
        'login',
        new LocalStrategy(
            async(username, password, done) => {
                try {
                    let user = await users.findOne({username})
                    if (!user) return done(null, false)
                    if (!isValid(user, password)) return done(null, false)
                    return done(null,user)
                } catch(err) {
                    done(err)
                }
            }
        )
    )
}

```

> > En app.js guardamos los datos y las sesiones cada una en una base de datos. Debemos recordar iniciar la base de datos yendo al cmd como admin e ingresando mongod --dbpath "C:\Program Files\MongoDB\miBaseDeDatos"

 ```
 app.use(session({
    store: MongoStore.create({mongoUrl: 'mongodb://localhost:27017/backendSession'}),
    secret: 'c0d3r',
    resave: true,
    cookie: {maxAge: 60000},
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())
 ```

 > > En authRouter, agregaremos los middlewares de passport para el registro y logueo en el método POST de las rutas /login y /register. En la ruta /clearCookie tendremos un req.logout de passport, y además una autenticación en la ruta /logout para verificar que el usuario esté logueado. No utilizaremos más el middleware isAuth.

 ```
 import { Router } from "express";
import passport from "passport";
import path from 'path'

const router = Router()
const __dirname = path.resolve();

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/register/index.html'))
})

router.post('/register', passport.authenticate('register', 
{failureRedirect: '/auth/registerError'}), (req, res) => {
    req.session.user = req.body
    res.redirect('/products')   
})

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/login/index.html'))
})

router.post('/login', passport.authenticate('login',
{failureRedirect: '/auth/loginError'}), async (req, res) => {
    req.session.user = req.body
    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    if (req.isAuthenticated()) {
        let {username} = req.session.user
        res.render('logout', {username})
    } else {
        res.redirect('/auth/login')
    }
})

router.get('/clearCookies', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.clearCookie('user_sid')
        req.session.destroy()
        res.redirect('/auth/login')
    })
})

router.get('/loginError', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/loginError/index.html'))
})

router.get('/registerError', (req, res) => {
    res.sendFile(path.join(__dirname, './src/public/registerError/index.html'))
})
export default router
 ```

> > En el productRouter también utilizaremos el middleware isAuthenticated

```
router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        let products = await productManager.getProducts()
        let user = req.cookies?.user || req.session?.user
        res.render('dashboard', {user, products} )
    } else {
        res.redirect('/auth/login')
    }
}) 
```

> > Además al registrarnos podemos ver en la base de datos (entrando al cmd con mongosh) las bases de datos backend y backendSession. 

> Autenticación con Google

> > instalamos passport-google-oauth20. Vamos a console.cloud.google.com, donde creamos un nuevo proyecto. Una vez creado, vamos a Pantalla de consentimiento, hacemos click en Externos y luego a Crear. Ponemos el nombre de la aplicacion, nuestro email, y luego en informacion de contacto de vuelta ponemos nuestro email, finalmente Guardar y Continuar 3 veces, y por último Volver al Panel.
En Prueba hacemos click en Publicar mi Aplicacion.
Voy a Credenciales necesitamos un ID de clientes OAuth20. Hacemos click en Crear Credenciales y elegimos ID Cliente de OAuth. Elegimos Aplicacion Web. En URI de redireccionamiento ponemos como uri: http://localhost:8080/auth/google/callback. Ésto es para que cuando en el localhost elijamos autenticarnos con google, una vez que google haya verificado la cuenta, nos redirija a esa ruta que luego vamos a crear. Copiaremos esos datos en el archivo .env (GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET). En la pagina https://www.passportjs.org/packages/passport-google-oauth20/ tenemos que copiar el codigo en google.js En las variables GOOGLE_CLIENT_ID, debemos agregarle el process.env. Además debemos exportar la variable strategy. En el callbackURL debemos poner la que pusimos en google.cloud que era la de localhost:8080. Vemos que en el código está usando mongoDb donde guardan el id del usuario, pero vamos a consologuearlo en vez de guardarlo en mongo.

```
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv'

dotenv.config()

const strategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, cb) {
        console.log('hemos recibido datos de Google')
        console.log(profile)
        return cb(null, profile);
    });

export default strategy
```
> > De passport google utilizará el serialize y deserialize la contraseña. app.js:

```
import googleStrategy from './options/strategies/google.js'
passport.use(googleStrategy)
```

> > src/routes/authRouter.js

```
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

router.get('/google/callback', passport.authenticate('google', {failureRedirect: '/auth/loginError'}), (req, res) => {
    let username = req.user.displayName
    let first_name = req.user.name.givenName
    let last_name = req.user.name.familyName
    let email = req.user.emails.value
    let photoURL = req.user.photos.value
    req.session.user = {username, first_name, last_name, email, photoURL}
    res.redirect('/products')
})
```

> > En el scope le estamos diciendo a google que nos traiga toda la data: el perfil y el mail
Por último creamos el enlace a la ruta /auth/google en el login.html

```
<div><a href='/auth/google'>Sign in with Google</a></div>
```

> > Si ejecutamos npm run dev, veremos que nos podemos autenticar, y en consola veremos todos nuestros datos. 