import {Schema, model} from 'mongoose'

const schema = new Schema({
    id: {type: Number},
    name: { type: String, required: true, max: 100 },
    precio100gr: { type: Number, required: true }, 
    precioKg: { type: Number, required: true },
    hayStock: {type: Boolean, required: true},
    categoryId: {type: Number, required: true, min: 1, max: 5}
}, {
    timestamps: true
})

export const ProductModel = model('Products', schema)
export const CartModel = model('Carts', schema)
