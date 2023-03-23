import mongoose from 'mongoose'

mongoose.set("strictQuery", false); //Ésto es por una incopatibilidad de versiones

export default class ContenedorMongoDB {
    constructor(model, config) {
        this.model = model
        this.mongoose = mongoose.connect(config.url)
            .then(() => {
                console.log("Conectado a la base de datos de mongo")
            })
            .catch((err) => {
                console.log(err)
            })
    }

    add = async (data) => {
        try {
            await this.model.create(data)
            return {message: "Se agregó con éxito"}
        } catch (err) {
            return {
                err
            }
        }
    }

    getAll = async () => {
        let datas = await this.model.find({})
        if (datas.length === 0) return {
            message: "No hay datos"
        }
        return datas
    }

    getById = async (id) => {
        try {
            let data = await this.model.findOne({_id: id})
            if (!data) return { message: "No hubo coincidencias" }
            return data
        } catch (err) {
            return { message: "No hubo coincidencias" }
        }

    }

    delete = async (id) => {
        try {
            await this.model.deleteOne({_id: id})
            return {message: "Se eliminó con éxito"}
        } catch (err) {
            return {message: "No hubo coincidencias"}
        }
    }
    update = async (id, item) => {
        try {
            await this.model.findByIdAndUpdate(id, { $set: {...item} }, { new: true })
            return { message: "Dato actualizado con éxito"  }
        } catch (err) {
            return { message: "No hubo coincidencias" }
        }
    }
}