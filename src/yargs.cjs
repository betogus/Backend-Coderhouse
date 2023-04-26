const yargs = require('yargs');
let PORT;
let MODO;
const argv = yargs
    .option('port', {
        alias: 'p',
        describe: 'Puerto en el que se iniciará la aplicación',
        type: 'number',
        default: 8080
    })
    .option('modo', {
        alias: 'm',
        describe: 'Modo de inicio de la aplicación',
        type: 'string',
        choices: ['fork', 'cluster'],
        
    })
    .argv;

if (argv.modo === 'cluster') {
    MODO = "cluster"
} else if (argv.modo === "fork") {
    MODO = 'fork'
}

PORT = argv.port

yargs.parse()

module.exports = {PORT, MODO}