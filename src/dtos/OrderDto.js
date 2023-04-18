export default class OrderDTO {
    constructor(order) {
        this.username = order.username,
        this.timestamp = order.timestamp,
        this.products = []
        this.addProduct(order)
    }

    addProduct(order) {
        if (order?.products?.length) {
            for (let i = 0; i < order.products.length; i++) {
                let product = order.products[i]
                this.products.push({name: product.name, price: product.precioKg})
            }
        }

    }
}