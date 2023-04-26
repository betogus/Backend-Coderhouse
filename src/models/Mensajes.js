import knex from 'knex'

export default class Mensajes {
    constructor(config, table) {
        this.db = knex(config)
        this.table = table
        this.createTable()

    }
    createTable = async () => {
        await this.db.schema.createTable(this.table, table => {
                table.string('username');
                table.string('photo');
                table.string('message');
                table.string('timestamp');
            })
            .then(console.log('Table created!'))
            .catch(err => console.log('Ya existe la tabla'))
    }

    add = async (data) => {
        let timestamp = new Date().toLocaleString()
        let {message } = data
        let {username, photo} = data.user
        let chat = {username, photo, message, timestamp}
        await this.db(this.table).insert(chat)
            .then(() => console.log('chat inserted'))
            .catch(err => console.log(err))
    }
    getAll = async () => {
        let data = await this.db.from(this.table).select('*')
        let dataJson = JSON.parse(JSON.stringify(data))
        let newData = []
        for (let i = 0; i < dataJson.length; i++) {
            let user;
            let username = dataJson[i].username
            let photo = dataJson[i].photo
            let message = dataJson[i].message
            let timestamp = dataJson[i].timestamp
            user = {username, photo}
            newData.push({user,message, timestamp})
        }
        return (newData)
    }
}
