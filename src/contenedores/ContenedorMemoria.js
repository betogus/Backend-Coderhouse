export default class ContenedorMemoria {
    constructor() {
        this.array = []
    }

    add(obj) {
        if (this.array.length === 0) {
            obj.id = 1
        } else {
            obj.id = this.array[this.array.length-1].id+1
        }
        this.array.push(obj)
        return {message: "Se agregó con éxito"}
    }

    getById(id) {
        let data = this.array.find(item => item.id === parseInt(id))
        if (!data) return {message: "No hay coincidencias"}
        return data
    }

    getAll() {
        if (this.array.length === 0) return {message: "No hay datos"}
        return this.array
    }
    delete(id) {
        let data = this.array.find(item => item.id === parseInt(id))
        if (!data) return {message: "No hay coincidencias"}
        let newArray = this.array.filter(item => item.id != parseInt(id))
        this.array = newArray
        return {message: "Se eliminó con éxito"}
    }
    update(id, obj) {
        let newId = parseInt(id)
        let data = this.array.find(item => item.id === parseInt(id))
        if (!data) return {message: "No hay coincidencias"}
        data = {...obj, id: newId}
        let newArray = this.array.filter(item => item.id != parseInt(id))
        newArray.push(data)
        this.array = newArray
        return {message: "Se actualizó con éxito"}
    }


}