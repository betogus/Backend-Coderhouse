export default class ContenedorFirebase {
    constructor(collection, config) {
        this.collection = collection
        this.db = config.firestore()
    }

    async getAll() {
        if (!this.collection) return {message: "No existe la BD"}
        const datas = await this.db.collection(this.collection).get()
        if (datas.length === 0) return {message: "No hay datos"}
        return datas.docs.map(doc => ({...doc.data(), id: doc.id}))
    }

    async getById(id) {
        if (!this.collection) return {message: "No existe la BD"}
        const data = await this.db.collection(this.collection).doc(id).get()
        if (!data) return {message: "No hay datos"}
        return {...data.data(), id:data.id}
    }

    async getByUsername(username) {
        if (!this.collection) return {message: "No existe la BD"}
        const querySnapshot = await this.db.collection(this.collection).where('username', "==", username).get()
        if (querySnapshot.empty) return { message: "No hay datos" }
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        return data;
    }

    async add(item) {
        try {
            let timestamp = new Date().toLocaleString()
            const data = JSON.parse(JSON.stringify(item))
            const datas = this.db.collection(this.collection)
            await datas.add({...data, timestamp})
            return {...data, timestamp}
        } catch (err) {
            return {message: err}
        }
    }

    async update(id, item) {
        if (!this.collection) return {message: "No existe la BD"}
        let timestamp = new Date().toLocaleString()
        const data = this.db.collection(this.collection).doc(id)
        if (!data) return {message: "No hay datos"}
        else {
            await data.update(JSON.parse(JSON.stringify({...item, timestamp})))
            return { message: 'Se actualizó con éxito'}
        }
    }

    async delete(id) {
        const doc = this.db.collection(this.collection).doc(id)
        const result = await doc.get()
        if (result.exists) {
            await doc.delete()
            return { message: "Se eliminó con éxito" }
        } else return { message: 'Dato no encontrado' }
    }
}

