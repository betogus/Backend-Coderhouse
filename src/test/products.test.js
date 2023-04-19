import supertest from 'supertest'
import { expect } from 'chai'
import generarProducto from '../clienteHttp/generador.cjs'

const request = supertest('http://localhost:8080/products')

describe('test Products', () => {
    describe('GET', () => {
        it('Debe verificar que no devuelva un array vacío', async () => {
            let producto = generarProducto()
            await request.post('/').send(producto)
            let res = await request.get('/')
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.not.empty;
        })
    })
})
describe('POST', () => {
    it('Verificamos que el producto se añadió con éxito si éste cumple con todos los campos', async () => {
        let producto = generarProducto()
        let res = await request.post('/').send(producto)
        expect(res.status).to.equal(201);

    })
})

