# Desafio 19

## Tercera entrega del proyecto final

**

> Base de datos

> > Utilizamos mongoose. Ejecutamos como administrador la base de datos con el cmd


```
mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> Consigna

> > Dividir en capas el proyecto entregable con el que venimos trabajando
(entregable clase 16: loggers y profilers), agrupando apropiadamente las capas de ruteo,
controlador, lógica de negocio y persistencia.
Considerar agrupar las rutas por funcionalidad, con sus controladores, lógica de negocio con
los casos de uso, y capa de persistencia.
La capa de persistencia contendrá los métodos necesarios para atender la interacción de la
lógica de negocio con los propios datos.

> A tener en cuenta

> > Cuando queremos que del service le envíe al controller un status, debemos generar una promise, y desde el controller usar un .then para recibirlo. El service queda de la siguiente manera:

```
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
    }) 
}
```

> > Y el controller:

```
export const postCart = async (req, res) => {
    const userId = req.session.passport?.user;
    if (userId) {
        let productosEnElCarrito = (req.body)
        enviarEmail(userId, productosEnElCarrito)
        .then(status => {
            res.status(status).send()
        })
    } else {
        res.redirect('/auth/login')
    }
}
```

