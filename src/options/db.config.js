const configMySQL = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'pruebamysql'
    }
}

const configSqlite = {
    client: 'sqlite3',
    connection: {
        filename: './src/database/ecommerce/db.sqlite'
    },
    useNullAsDefault: true
}



module.exports = {configMySQL, configSqlite}