const knex = require('knex')

class Contenedor {
    constructor(config, table) {
        this.db = knex(config)
        this.table = table

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

    insertData = async (product) => {
        await this.db(this.table).insert(product)
            .then(() => console.log('product inserted'))
            .catch(err => console.log(err))
    }
    getAll = async () => {
        let data = await this.db.from(this.table).select('*')
        return (JSON.parse(JSON.stringify(data)))
    }
}


module.exports = Contenedor
