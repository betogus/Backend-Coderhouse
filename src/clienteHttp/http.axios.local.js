import axios from "axios"
import generarProducto from "./generador.cjs"

/* GET  */
export const axiosGetProducts = async () => {
    try {
        const response = await axios.get('http://localhost:8080/products')
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//axiosGetProducts()

/* POST */


//una manera:
/* let userRegister = {
    username: "Benja",
    address: "Calle falsa 123",
    age: 28,
    phone: "123123123",
    email: "gus@hotmail.com",
    password: "123"
} */

//otra manera:
let product = generarProducto()

export const axiosPostProduct = async () => {
    try {
        const response = await axios.post('http://localhost:8080/products', product)
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//axiosPostProduct()

