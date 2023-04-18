export const isAuth = (req, res, next) => {
    if (req.session?.user && req.cookies?.user_sid) return next()
    else res.redirect("/auth/login")
}

import { createTransport } from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()


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

export const twilioMsg = async (req, res, next) => {
    const client = twilio(process.env.TWILIO_ACCOUNT, process.env.TWILIO_TOKEN)
    try {
        const message = await client.messages.create({
            body: `Su registro fue exitoso! Su usuario es ${user.username} y su contraseña es ${user.password}`,
            from: '+12762959575', //ponemos el numero generado en la pagina
            to: `${user.phone}` //ej +543512811582
        })
        console.log(message)
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

import { users } from "../models/User.js";;
import twilio from 'twilio'


export async function enviarEmail(userId, productosEnElCarrito)  {
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
        /* if (user.phone) {
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
        }  */
    })
    
}