#Desafío 16

## LOGGERS, GZIP y ANÁLISIS DE PERFORMANCE

**Consigna:**
Incorporar al proyecto de servidor de trabajo la compresión gzip.
Verificar sobre la ruta /info con y sin compresión, la diferencia de cantidad de bytes devueltos en un caso y otro.

> Solución:

> > Ejecutamos la base de datos de mongo desde el cmd:

```
Ejemplo: mongod --dbpath “C:\Program Files\MongoDB\miBaseDeDatos” 
```

> > Primero ejecutamos la app sin el compresor para verificar el tamaño del cuerpo de respuesta yendo al http://localhost:8080/info, dentro de herramientas de desarrolladores y luego a la pestaña aplicaciones. Arroja 1,8Kb

```
node app.js
```

> > Instalamos el compresor Gzip:

```
npm i compression
```

> > Importamos e inicializamos la librería en el archivo app.js

```
import compression from 'compression'
app.use(compression())
```

> > Ejecutamos con node la app, y veremos yendo a las herramientas de desarrollador, a redes y viendo el archivo que el tamaño ahora es de 1.3Kb. Podemos asignarle un level al compression. El nivel -1 es el que está por defecto. En 0 no comprime, y en 9 es la mayor compresión.

```
app.use(compression({
        level: 9
    }))
```

> > Sin el compression, vemos que el archivo pesa 2Kb.

**Consigna:**
Luego implementar loggueo (con alguna librería vista en clase) que registre lo siguiente:
* Ruta y método de todas las peticiones recibidas por el servidor (info)
* Ruta y método de las peticiones a rutas inexistentes en el servidor (warning)
* Errores lanzados por las apis de mensajes y productos, únicamente (error)
* Considerar el siguiente criterio:
* Loggear todos los niveles a consola (info, warning y error)
* Registrar sólo los logs de warning a un archivo llamada warn.log
* Enviar sólo los logs de error a un archivo llamada error.log

> Solucion

> > Utilizaremos la librería winston

```
npm i winston
```

> > Creamos una carpeta llamada winston dentro de src donde configuramos los logs

```
import winston from 'winston'

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './src/winston/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './src/winston/warning.log',
            level: 'warn',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

```

> > Para el caso en que la ruta no exista, agregaremos al final de todas las rutas lo siguiente:

```
//RUTAS NO DEFINIDAS

       app.use((req, res, next) => {
           logger.warn(`Ruta no encontrada: ${req.originalUrl}`);
           res.status(404).send("Ruta no encontrada");

       });
```

> > En el archivo api.js importamos el logger y modificamos los console.log que son debido a errores por logger.error:

```
Ejemplo:

getAllProducts(file){
       let productos;
        try {
        let data = fs.readFileSync(file, 'utf8');
        productos = data.length > 0 ? JSON.parse(data) : [] ; 
       } catch(err) {
        logger.error('Error en la lectura del archivo', err)
       }
       return productos
    }
```

> > Para loguear todos los niveles a consola:

```
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

```


**Consigna:**
Vamos a trabajar sobre la ruta '/info', en modo fork, agregando ó extrayendo un console.log de la información colectada antes de devolverla al cliente. Además desactivaremos el child_process de la ruta '/randoms'
Para ambas condiciones (con o sin console.log) en la ruta '/info' OBTENER:
1) El perfilamiento del servidor, realizando el test con --prof de node.js. Analizar los resultados obtenidos luego de procesarlos con --prof-process. 
Utilizaremos como test de carga Artillery en línea de comandos, emulando 50 conexiones concurrentes con 20 request por cada una. Extraer un reporte con los resultados en archivo de texto.
2) El perfilamiento del servidor con el modo inspector de node.js --inspect. Revisar el tiempo de los procesos menos performantes sobre el archivo fuente de inspección.


> Solucion

> > Instalamos artillery si es que no lo tenemos

```
npm i -g artillery
```

> > Ejecutamos la app en modo fork como profiler

```
node --prof app.js
```

> > Luego, ingresamos lo siguiente en otra terminal:

```
artillery quick --count 20 -n 50 "http://localhost:8080/info" > info-profiling--bloq.txt
```

> > Podemos ver el resultado de info-profiling--bloq.txt al cortar la ejecución de node. Ejecutamos el siguiente comando sobre el archivo isolate que se creó:

```
node --prof-process isolate-000001B835560900-4372-v8.log > info-profiling--prof.txt
```

> > En el archivo info-profiling--bloq que se creó, vemos el summary:

```
[Summary]:
   ticks  total  nonlib   name
      7    0.1%  100.0%  JavaScript
      0    0.0%    0.0%  C++
      3    0.0%   42.9%  GC
   7194   99.9%          Shared libraries
   
```

> > el número de ticks que se muestran en el registro de perfil indica cuántas muestras de rendimiento se tomaron durante la ejecución de la aplicación. Cuanto más alto sea el número de ticks, más detallado será el perfil de rendimiento y más información se podrá obtener para optimizar el rendimiento de la aplicación.


> > Ahora realizamos el mismo proceso con node inspect

```
node --inspect app.js
```

> > En el browser ponemos la siguiente url: chrome://inspect. Vamos a Open dedicated DevTools for Node. Vamos a la pestaña Profiler, seleccionamos el archivo 

> > en otra terminal ponemos:
```
artillery quick --count 20 -n 50 "http://localhost:8080/info" > info-profiling--inspect.txt
```

> > En el Node Debugger veremos el informe, donde seleccionamos el proceso sincrónico y veremos el archivo app.js diciendote cuánto demora cada proceso en ejecutarse.