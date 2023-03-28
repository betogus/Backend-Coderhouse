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
