import { users } from "../models/User.js";
import { transporter } from "../middlewares/middlewares.js";
import twilio from 'twilio'
import dotenv from 'dotenv'


dotenv.config()

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