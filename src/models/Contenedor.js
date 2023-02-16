const fs = require('fs')

class Contenedor {
    constructor(path) {
        this.pathToFile = path
    }
    async save(obj) {
        const productos = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const productosJs = JSON.parse(productos)

        if (fs.existsSync(this.pathToFile)) {
            if (productosJs.length) {
                try {
                    let id = productosJs[productosJs.length - 1].id + 1
                    let producto = obj
                    producto.id = id
                    productosJs.push(producto)
                    await fs.promises.writeFile(this.pathToFile, JSON.stringify(productosJs, null, 2))
                    return `Se agregó con éxito. El id del producto es ${id}`
                } catch {
                    return 'Error al sobreescribir el archivo ' + this.pathToFile
                }
            } else {
                try {
                    let id = 1
                    let producto = obj
                    producto.id = id
                    await fs.promises.writeFile(this.pathToFile, `[${JSON.stringify(producto, null, 2)}]`)
                    return "Se agregó con éxito. El id del producto es 1"
                } catch {
                    return 'Error al crear el archivo ' + this.pathToFile
                }
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }

    }

    async getById(id) {
        if (fs.existsSync(this.pathToFile)) {
            try {
                const productos = await fs.promises.readFile(this.pathToFile, 'utf-8')
                const productosJs = JSON.parse(productos)
                const producto = productosJs.find(item => item.id === id)
                if (producto.id === undefined) return "No hay coincidencias en el archivo " + this.pathToFile
                return producto
            } catch {
                return "No hay coincidencias en el archivo " + this.pathToFile
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }
    }

    async getAll() {
        if (fs.existsSync(this.pathToFile)) {
            try {
                const productos = await fs.promises.readFile(this.pathToFile, 'utf-8')
                const productosJs = JSON.parse(productos)

                if (productosJs === []) return "No hay productos en el archivo " + this.pathToFile
                return productosJs
            } catch {
                return "No se pudieron mostrar los productos"
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }
    }
    async deleteById(id) {
        const productos = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const productosJs = JSON.parse(productos)
        if (fs.existsSync(this.pathToFile)) {
            if (productosJs.length) {
                try {
                    const producto = productosJs.find(item => item.id === id)
                    if (producto.id === undefined) return "No hay coincidencias en el archivo " + this.pathToFile
                    let newProducts = productosJs.filter(item => item.id !== id)
                    await fs.promises.writeFile(this.pathToFile, JSON.stringify(newProducts, null, 2))
                    return 'Se eliminó con éxito'
                } catch {
                    return 'No existe el producto '
                }
            } else {
                return "No existe el archivo " + this.pathToFile + " o no hay productos cargados"
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }

    }

    async deleteAll() {
        const productos = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const productosJs = JSON.parse(productos)
        if (fs.existsSync(this.pathToFile)) {
            if (productosJs.length) {
                try {
                    await fs.promises.writeFile(this.pathToFile, "[]")
                    return 'Se eliminaron con éxito'
                } catch {
                    return 'No se pudieron eliminar los productos'
                }
            } else {
                return "No hay productos cargados"
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }

    }
    async modifyById(id, obj) {
        const productos = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const productosJs = JSON.parse(productos)
        if (fs.existsSync(this.pathToFile)) {
            if (productosJs.find(item => item.id === id)) {
                try {
                    let newProductos = productosJs.filter(item => item.id !== id)
                    let producto = obj
                    producto.id = id
                    newProductos.push(producto)
                    await fs.promises.writeFile(this.pathToFile, JSON.stringify(newProductos, null, 2))
                    return `Se modificó con éxito. El id del producto es ${id}`
                } catch {
                    return 'Error al sobreescribir el archivo ' + this.pathToFile
                }
            } else {
                return 'No existe un producto con ese id'
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }
    }
}


module.exports = Contenedor