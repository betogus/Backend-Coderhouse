import fs from 'fs'

export default class ContenedorArchivo {
    constructor(path) {
        this.pathToFile = path
    }
    async add(obj) {
        const data = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const dataJs = JSON.parse(data)

        if (fs.existsSync(this.pathToFile)) {
            if (dataJs.length) {
                try {
                    let id = dataJs[dataJs.length - 1].id + 1
                    let data = obj
                    data.id = id
                    dataJs.push(data)
                    await fs.promises.writeFile(this.pathToFile, JSON.stringify(dataJs, null, 2))
                    return `Se agregó con éxito`
                } catch {
                    return 'Error al sobreescribir el archivo ' + this.pathToFile
                }
            } else {
                try {
                    let id = 1
                    let data = obj
                    data.id = id
                    console.log(data)
                    await fs.promises.writeFile(this.pathToFile, `[${JSON.stringify(data, null, 2)}]`)
                    return "Se agregó con éxito"
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
                const datas = await fs.promises.readFile(this.pathToFile, 'utf-8')
                const dataJs = JSON.parse(datas)
                const data = dataJs.find(item => item.id === parseInt(id))
                if (data.id === undefined) return "No hay coincidencias en el archivo " + this.pathToFile
                return data
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
                const datas = await fs.promises.readFile(this.pathToFile, 'utf-8')
                const dataJs = JSON.parse(datas)

                if (dataJs === []) return "No hay datos en el archivo " + this.pathToFile
                return dataJs
            } catch {
                return "No se pudieron mostrar los datos"
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }
    }
    async delete(id) {
        const datas = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const dataJs = JSON.parse(datas)
        if (fs.existsSync(this.pathToFile)) {
            if (dataJs.length) {
                try {
                    const data = dataJs.find(item => item.id === parseInt(id))
                    if (data.id === undefined) return "No hay coincidencias en el archivo " + this.pathToFile
                    let newProducts = dataJs.filter(item => item.id !== parseInt(id))
                    await fs.promises.writeFile(this.pathToFile, JSON.stringify(newProducts, null, 2))
                    return 'Se eliminó con éxito'
                } catch {
                    return 'No hay coincidencias '
                }
            } else {
                return "No existe el archivo " + this.pathToFile + " o no hay datos cargados"
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }

    }

    async deleteAll() {
        const datas = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const dataJs = JSON.parse(datas)
        if (fs.existsSync(this.pathToFile)) {
            if (dataJs.length) {
                try {
                    await fs.promises.writeFile(this.pathToFile, "[]")
                    return 'Se eliminaron con éxito'
                } catch {
                    return 'No se pudieron eliminar los datos'
                }
            } else {
                return "No hay datos cargados"
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }

    }
    async update(id, obj) {
        const datas = await fs.promises.readFile(this.pathToFile, 'utf-8')
        const dataJs = JSON.parse(datas)
        if (fs.existsSync(this.pathToFile)) {
            if (dataJs.find(item => item.id === parseInt(id))) {
                try {
                    let newdatas = dataJs.filter(item => item.id !== parseInt(id))
                    let data = obj
                    data.id = parseInt(id)
                    newdatas.push(data)
                    await fs.promises.writeFile(this.pathToFile, JSON.stringify(newdatas, null, 2))
                    return `Se modificó con éxito`
                } catch {
                    return 'Error al sobreescribir el archivo ' + this.pathToFile
                }
            } else {
                return 'No hay coincidencias'
            }
        } else {
            return "No existe el archivo " + this.pathToFile
        }
    }
}