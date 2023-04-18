import knex from 'knex'

export default class ContenedorMySQL {
    constructor(config, table) {
        this.db = knex(config)
        this.table = table
        this.createTable()
    }

    createTable = async () => {
        await this.db.schema.createTable(this.table, table => {
                table.increments('id');
                table.string('title');
                table.decimal('price');
                table.string('thumbnail');
            })
            .then(console.log('Table created!'))
            .catch(err => console.log('Ya existe la tabla'))
    }

    add = async (product) => {
        try {
            await this.db(this.table).insert(product)
            return {message: 'product inserted'}
        } catch (err) {
            return {err}
        }
    }
    getAll = async () => {
        try {
            let data = await this.db.from(this.table).select('*')
            if (data.length === 0) return {message: "No hay datos"}
            return (JSON.parse(JSON.stringify(data)))
        } catch (err) {
            return {err}
        }
    }

    getById = async(id) => {
        try {
            let data = await this.db.from(this.table).select("*").where({id: id})
             if (data.length === 0) return {message: "No hay datos"}
            return (JSON.parse(JSON.stringify(data)))
        } catch(err) {
            return {err}
        }
        
    }

     getByUsername = async (username) => {
         try {
             let data = await this.db.from(this.table).select("*").where({
                 username: username
             })
             if (data.length === 0) return {
                 message: "No hay datos"
             }
             return (JSON.parse(JSON.stringify(data)))
         } catch (err) {
             return {
                 err
             }
         }

     }

    update = async (id, obj) => {
        try {
            await this.db.from(this.table).select("*").where({id}).update(obj)
            return {message: "Se actualizó con éxito"}
        } catch(err) {
            return {err}
        }
    }

    delete = async (id) => {
        try {
            await this.db.from(this.table).select('*').where({id}).delete()
            return {message: "Se eliminó con éxito"}
        } catch(err) {
            return {err}
        }
    }
}



