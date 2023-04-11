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
export default router