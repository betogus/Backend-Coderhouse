> > Instalamos yargs. En el archivo yargs.cjs (debe ser extension .cjs para que funcione):

const yargs = require('yargs')

yargs.command({
    command: 'port',
    describe: "Definimos el puerto de escucha del servidor (Por defecto será el 8080)",
    builder: {
        port: {
            describe: "Puerto de escucha del servidor",
            demandOption: false,
            type: "number",
        },
    },
    handler: function (argv) {
        const port = argv.port;
        if (!Number.isInteger(port)) {
            console.log({
                error: "El puerto debe ser un número entero.",
            });
            process.exit(-5);
        }
        return port;
    },
})

module.exports = yargs

```

> > En app.js:

```
import yargs from './yargs.cjs'
const args = yargs.parse();
const port = args.port || 8080;
const server = app.listen(port, () => console.log('Server Up at port ', port))
```

> > Además creamos la ruta /info

```
app.get('/info', (req, res) => {
    let info = {
        argumentosDeEntrada: process.argv[3]?.slice(8) || "nulo",
        plataforma: process.platform,
        versionNodeJs: process.version,
        memoriaUsada: process.memoryUsage(),
        pathDeEjecucion: process.execPath,
        processId: process.pid,
        carpetaDelProyecto: process.cwd()
    }
    res.render('info', {
        info
    })
})
```

> > Ahora para el uso de fork. Creamos el archivo random.js

```
const cant = process.argv[2];

function random(cant) {
    let cantidad = cant === undefined ? cant : 1000000;
    let randomArray = [];
    for (let i = 0; i < cantidad; i++) {
        let newNumber = Math.random()
        newNumber = parseInt(newNumber * 1000)
        randomArray.push(newNumber)
    }
    return randomArray
}
process.send(random(cant))
```

> > Creamos un apiRouther

```
import express from 'express'
import { fork } from 'child_process' 

const router = express.Router()

router.get('/', (req, res) => {
    const result = fork('./src/random.js', [req.query.cant])
    result.on('message', data => {
        res.render('random', {
            data
        })
    })

})

export default router
```
> > Creamos el random.handlebars y finalmente importamos el router en app.js

```
import apiRouter from './routes/apiRouther.js'
app.use('/api/randoms', apiRouter)
```