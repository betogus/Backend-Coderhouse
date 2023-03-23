import {Schema, model} from 'mongoose'

const schema = new Schema({
    title: { type: String, required: true, max: 100 },
    thumbnail: { type: String, required: true }, 
    price: { type: Number, required: true, max: 120 },
}, {
    timestamps: true
})

export const ProductModel = model('Products', schema)
