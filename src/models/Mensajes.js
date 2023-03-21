const knex = require('knex')

class Mensajes {
    constructor(config, table) {
        this.db = knex(config)
        this.table = table

    }
    createTable = async () => {
        await this.db.schema.createTable(this.table, table => {
                table.increments('id');
                table.string('email');
                table.string('message');
                table.string('date');
            })
            .then(console.log('Table created!'))
            .catch(err => console.log('Ya existe la tabla'))
    }

    insertData = async (chat) => {
        await this.db(this.table).insert(chat)
            .then(() => console.log('chat inserted'))
            .catch(err => console.log(err))
    }
    getAll = async () => {
        let data = await this.db.from(this.table).select('*')
        return (JSON.parse(JSON.stringify(data)))
    }
}


module.exports = Mensajes
