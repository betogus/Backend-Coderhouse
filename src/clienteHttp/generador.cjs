const faker = require('faker')

faker.locale = "es"

 const generarProducto = () => ({
    id: faker.datatype.number(),
    name: faker.commerce.productName(),
    precio100gr: faker.datatype.number({ min: 10, max: 50 }),
    precioKg: faker.datatype.number({ min: 150, max: 300 }),
    hayStock: faker.datatype.boolean(),
    categoryId: faker.datatype.number({ min: 1, max: 5 })
})

module.exports = generarProducto
