# Desafio 15

## Servidor con balance de carga

**Consigna:**
Tomando con base el proyecto que vamos realizando, agregar un parámetro más en
la ruta de comando que permita ejecutar al servidor en modo fork o cluster. Dicho
parámetro será 'FORK' en el primer caso y 'CLUSTER' en el segundo, y de no
pasarlo, el servidor iniciará en modo fork.
Agregar en la vista info, el número de procesadores presentes en el servidor.
Ejecutar el servidor (modos FORK y CLUSTER) con nodemon verificando el número de procesos tomados por node.

> > Modificamos el yargs.cjs de tal manera que me defina los parámetros port y modo que le vayamos a pasar por la terminal al levantar la app

```
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
        default: 'fork'
    })
    .argv;

if (argv.modo === 'cluster') {
    console.log('Iniciando en modo cluster...');
    MODO = "cluster"
} else {
    console.log('Iniciando en modo fork...')
    MODO = 'fork'
}

PORT = argv.port
console.log(`Puerto: ${argv.port}`);

yargs.parse()

module.exports = {PORT, MODO}
```

> > Modificamos el app.js de tal manera que se creen los workers cuya cantidad dependerá de si especificamos que sea en modo FORK (1 proceso) o modo CLUSTER (tantos procesos como procesadores lógicos haya en el CPU). En cluser.on('exit') significa que si muere un proceso, automáticamente me creará otro. Además, agregamos a la ruta /info, la cantidad de procesadores presentes en la cpu.

```
const app = express()
const NUM_CPUS = os.cpus().length
let puerto = PORT || 8080;
if (MODO === "cluster" && cluster.isPrimary) {
    console.log(`Proceso principal ${process.pid} está corriendo`)
    for (let i = 0; i < NUM_CPUS; i++) {
        cluster.fork()
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Proceso ${worker.process.pid} murió`)
    })
} else {
    app.listen(puerto, () => {
        console.log(`Iniciando servidor en puerto ${puerto}`)
    })
    ...
    ...
    app.get('/info', (req, res) => {
        let info = {
            argumentosDeEntrada: process.argv[3]?.slice(8) || "nulo",
            plataforma: process.platform,
            versionNodeJs: process.version,
            memoriaUsada: process.memoryUsage(),
            pathDeEjecucion: process.execPath,
            processId: process.pid,
            carpetaDelProyecto: process.cwd(),
            cantidadDeProcesos: os.cpus().length
        }
        res.render('info', {
            info
        })
    })
}
```
> > Modificamos el info.handlebars para que tenga en cuenta la cantidad de procesadores

```
<div id="container">
    <div id="title">
        <h1>INFO</h1>
        <div>
            <p>Argumentos de entrada: {{info.argumentosDeEntrada}}</p>
            <p>Plataforma: {{info.plataforma}}</p>
            <p>Versión de Node JS: {{info.versionNodeJs}}</p>
            <p>Memoria Usada:</p>
            {{#each info.memoriaUsada}}
            <p class="indent">{{@key}}: {{this}}</p>
            {{/each}}
            <p>Path de Ejecución: {{info.pathDeEjecucion}}</p>
            <p>Id del proceso: {{info.processId}}</p>
            <p>Carpeta del proyecto: {{info.carpetaDelProyecto}}</p>
            <p>Cantidad de procesadores: {{info.cantidadDeProcesos}}</p>
        </div>
    </div>
</div>
```
> > Ejecutamos la base de datos de mongo desde el cmd:

```
mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos”
```

> > Probamos de correr la app en modo fork

```
node src/app.js --port=8080
```

> > En el cmd veremos el pid del procesador con el comando tasklist /fi "imagename eq node.exe"

```
Nombre de imagen               PID Nombre de sesión Núm. de ses Uso de memor
========================= ======== ================ =========== ============
node.exe                     12992 Console                    5    78.836 KB
```

> > Cortamos la ejecución y ahora probamos en modo cluster

```
node src/app.js --port=8080 --modo=cluster
```

> > Vamos al cmd y ejecutamos el comando tasklist /fi "imagename eq node.exe"

```
Nombre de imagen               PID Nombre de sesión Núm. de ses Uso de memor
========================= ======== ================ =========== ============
node.exe                      8436 Console                    5    56.196 KB
node.exe                      4564 Console                    5    56.076 KB
node.exe                      9172 Console                    5    56.424 KB
node.exe                     11468 Console                    5    56.760 KB
node.exe                       916 Console                    5    56.276 KB
node.exe                     11348 Console                    5    56.348 KB
node.exe                     10408 Console                    5    56.856 KB
node.exe                     12064 Console                    5    56.740 KB
node.exe                      9544 Console                    5    56.160 KB
```

> > Ejecutar la app con pm2 en modo fork y cluster

```
Modo fork:
pm2 start src/app.js
┌─────┬────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ app    │ default     │ 1.0.0   │ fork    │ 9540     │ 3s     │ 0    │ online    │ 0%       │ 48.0mb   │ Usuario  │ disabled │
└─────┴────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
Matamos el proceso con pm2 delete all 

Modo cluster:
pm2 start -i max src/app.js
┌─────┬────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ app    │ default     │ 1.0.0   │ cluster │ 3764     │ 3s     │ 0    │ online    │ 0%       │ 31.9mb   │ Usuario  │ disabled │
│ 1   │ app    │ default     │ 1.0.0   │ cluster │ 7976     │ 3s     │ 0    │ online    │ 0%       │ 31.0mb   │ Usuario  │ disabled │
│ 2   │ app    │ default     │ 1.0.0   │ cluster │ 7076     │ 3s     │ 0    │ online    │ 0%       │ 31.4mb   │ Usuario  │ disabled │
│ 3   │ app    │ default     │ 1.0.0   │ cluster │ 6804     │ 2s     │ 0    │ online    │ 0%       │ 31.2mb   │ Usuario  │ disabled │
│ 4   │ app    │ default     │ 1.0.0   │ cluster │ 5976     │ 2s     │ 0    │ online    │ 0%       │ 31.2mb   │ Usuario  │ disabled │
│ 5   │ app    │ default     │ 1.0.0   │ cluster │ 3308     │ 2s     │ 0    │ online    │ 0%       │ 30.7mb   │ Usuario  │ disabled │
│ 6   │ app    │ default     │ 1.0.0   │ cluster │ 9624     │ 2s     │ 0    │ online    │ 0%       │ 28.6mb   │ Usuario  │ disabled │
│ 7   │ app    │ default     │ 1.0.0   │ cluster │ 22620    │ 1s     │ 0    │ online    │ 0%       │ 30.6mb   │ Usuario  │ disabled │
└─────┴────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

**Consigna:**
Configurar Nginx para balancear cargas de nuestro servidor de la siguiente manera:
Redirigir todas las consultas a /api/randoms a un cluster de servidores escuchando en el puerto 8081. El cluster será creado desde node utilizando el módulo nativo cluster.
El resto de las consultas, redirigirlas a un servidor individual escuchando en el puerto 8080.
Verificar que todo funcione correctamente.
Luego, modificar la configuración para que todas las consultas a /api/randoms sean redirigidas a
un cluster de servidores gestionado desde nginx, repartiéndolas equitativamente entre 4
instancias escuchando en los puertos 8082, 8083, 8084 y 8085 respectivamente.


> > En el cmd vamos a la ruta donde está el archivo descargado de nginx: cd C:\Users\Usuario\Desktop\Gustavo Dell\GUS\Programacion\CoderHouse\Backend\Clase 30\nginx-1.22.1 y luego le damos a start nginx.exe

> > Ejecutamos con node como en la consigna anterior, pero utilizando el siguiente código en el archivo nginx.conf (recordar recargar nginx con el comando nginx -s reload y guardar el archivo en la carpeta correspondiente a nginx):

```

worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    upstream node_app {
        server localhost:8080;
    }

    upstream api_randoms {
        server localhost:8081;
    }
    
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   "C:\Users\Usuario\Desktop\Gustavo Dell\GUS\Programacion\CoderHouse\Backend\prueba\myproject";
            index  index.html index.htm;
            proxy_pass http://node_app;    
        }


        location /api/randoms {
            index  index.html index.htm;
            proxy_pass http://api_randoms;
        }



        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}

```

> > Redirigimos a un cluster de servidores. Modificamos el archivo nginx.conf con el siguiente código:

```

worker_processes  1;

events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    upstream node_app {
        server localhost:8080;
    }

    upstream api_randoms {
        server localhost:8082;
        server localhost:8083;
        server localhost:8084;
        server localhost:8085;
    }

    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;

        location / {
            root   "C:\Users\Usuario\Desktop\Gustavo Dell\GUS\Programacion\CoderHouse\Backend\Clase 8\desafio4";
            index  index.html index.htm;
            proxy_pass http://node_app;    
        }


        location /api/randoms {
            index  index.html index.htm;
            proxy_pass http://api_randoms;
        }



        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

}
