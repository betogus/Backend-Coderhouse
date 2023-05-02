
import { users} from "../models/User.js";;
import twilio from 'twilio'
import jwt  from "jsonwebtoken";
import { createHash, isValid } from "../../utils.js";
import {  createTransport } from "nodemailer";
import dotenv from 'dotenv'


dotenv.config()

export const isAuth = ((req, res, next) => {
    const auth = req.cookies?.token || req.session?.token
    if (!auth || auth === null) {
        return res.redirect('/auth/login')
    }
    let token = auth
    jwt.verify(token, 'c0d3r', (error, decoded) => {
        if (error) return res.redirect('/auth/login')
        else req.user = decoded.user
    })
    next()
})

export const generarToken = (user) => {
    let {username} = user
    let token = jwt.sign({username}, 'c0d3r', {
        expiresIn: '24h'
    })
    return token
}

export const authPostRegisterMiddleware = async (req, res, next) => {
    let username = req.body.username
    let user = await users.findOne({username})
    if (!user) {
        const newUser = {
            username: req.body.username,
            password: createHash(req.body.password),
            email: req.body.email,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            address: req.body.address,
            phone: req.body.phone,
            photo: req.file.filename
        }
        await users.create(newUser)
        const accessToken = generarToken(req.body)
        req.session.user = newUser
        res.cookie('user', newUser)
        req.session.token = accessToken
        res.cookie('token', accessToken)
        next()
    } 
    else {
        res.redirect('/auth/registerError')
    } 
}

export const authPostLoginMiddleware = async (req, res, next) => {
    let {username, password} = req.body
    let user = await users.findOne({username})
    if (!user || !isValid(user, password)) {
      return res.redirect('/auth/loginError');
    }
    req.session.user = user
    res.cookie('user', user)
    const accessToken = generarToken(req.body)
    req.session.token = accessToken
    res.cookie('token', accessToken)
    next()
}



export const isAdmin = (req, res, next) => {
    if (process.env.ADMIN !== "true") {
        res.status(401).send('No tiene los permisos necesarios')
    } else {
        next()
    }
}

export const transporter = createTransport({
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


export const validateFields = async (req, res, next) => {
    let user = req.body
    user.photo = req.file.filename
    if (!user.username || !user.password || !user.email || !user.first_name || !user.last_name || !user.address || !user.age || !user.phone || !user.photo) {
        res.redirect('/auth/registerError')
    } else if (user.phone.length !== 7 || !isNaN(user.age)) {
        res.redirect('/auth/registerError')
    } else {
        next()
    }
}



export async function enviarEmail(userId, productosEnElCarrito) {
    const user = await users.findById(userId);
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

    return new Promise((resolve, reject) => {
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
                reject('Error al enviar el correo electrónico');
            } else {
                console.log('Correo electrónico enviado: ' + info.response);
                resolve(200)
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

}



export const validateApi = (req, res, next) => {
    let product = req.body;
    console.log(`Validando producto: ${JSON.stringify(product)}`);

    const errors = [];

    if (!product.name || typeof product.name !== "string") {
        errors.push(`- El nombre es inválido: ${product.name}`);
    }

    if (!product.id || typeof product.id !== "number") {
        errors.push(`- El ID es inválido: ${product.id}`);
    }

    if (
        !product.precioKg ||
        typeof product.precioKg !== "number" ||
        product.precioKg <= 0
    ) {
        errors.push(`- El precio por kg es inválido: ${product.precioKg}`);
    }

    if (
        !product.precio100gr ||
        typeof product.precio100gr !== "number" ||
        product.precio100gr <= 0
    ) {
        errors.push(`- El precio por 100 gramos es inválido: ${product.precio100gr}`);
    }

    if (typeof product.hayStock !== "boolean") {
        errors.push(`- El valor de stock es inválido: ${product.hayStock}`);
    }

    if (
        !product.categoryId ||
        typeof product.categoryId !== "number" ||
        !Number.isInteger(product.categoryId) ||
        product.categoryId < 1 ||
        product.categoryId > 5
    ) {
        errors.push(`- El ID de categoría es inválido: ${product.categoryId}`);
    }

    if (errors.length > 0) {
        console.log(`Errores de validación:\n${errors.join("\n")}`);
        return res.status(400).send({
            message: "Error en la validación",
        });
    }

    console.log("El producto ha pasado la validación");
    next();
};