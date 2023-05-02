import OrderDTO from "../dtos/OrderDto.js"
import { enviarEmail } from "../middlewares/middlewares.js"
import { orderService } from "../services/order.service.js"

export const getOrderById = async (req, res) => {
    let {username} = req.cookies.user || req.session.user
    let orders = await orderService.getOrdersByUsername(username)
    let ordersDTO = []
    for (let i = 0; i < orders.length; i++) {
        let orderDTO = new OrderDTO(orders[i])
        ordersDTO.push({...orderDTO})
    } 
    res.render('order', {orders: ordersDTO})
}

export const postOrder = async (req, res) => {
    const userId = req.cookies.user || req.session.user;
    if (userId) {
        let products = req.body
        let order = {products, username: userId.username, id:userId._id}
        try {
            await orderService.addOrder(order)
            await enviarEmail(userId, products)
            res.status(200).send()
        } catch (err) {
            let title = "Order Error"
            let detail = "Error al querer confirmar la compra"
            res.render('error.ejs', {title, detail})
        }    
    } else {
        res.redirect('/auth/login')
    }
}