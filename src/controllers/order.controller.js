import OrderDTO from "../dtos/OrderDto.js"
import { enviarEmail } from "../middlewares/middlewares.js"
import { orderService } from "../services/order.service.js"

export const getOrderById = async (req, res) => {
    if (req.isAuthenticated()) {
        let {username} = req.session.user
        let orders = await orderService.getOrdersByUsername(username)
        let ordersDTO = []
        for (let i = 0; i < orders.length; i++) {
            let orderDTO = new OrderDTO(orders[i])
            ordersDTO.push({...orderDTO})
        } 
        res.render('order', {orders: ordersDTO})
    } else {
        res.redirect('/auth/login')
    }
    
}

export const postOrder = async (req, res) => {
    const userId = req.session.passport?.user;
    if (userId) {
        let products = req.body
        let order = {products, username: userId.username, id:userId._id}
        try {
            await orderService.addOrder(order)
            await enviarEmail(userId, products)
            res.status(200).send()
        } catch (err) {
            res.status(500).send()
        }
       
    } else {
        res.redirect('/auth/login')
    }
}