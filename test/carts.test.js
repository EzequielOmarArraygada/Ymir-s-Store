import { expect } from "chai";
import request from "supertest";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import app from '../src/app.js'; // Ajusta la ruta según sea necesario

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mongooseUrl = process.env.MONGO_URL;

function generateRandomCode(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

describe("test carts", function () {
  let cookie;
  let cartId;
  let productId;
  let randomCode = generateRandomCode(); // Generar un código aleatorio

  before(async function () {

    try {
      // Conectar a la base de datos
      await mongoose.connect(mongooseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      // Autenticar y obtener la cookie
      const response = await request(app)
        .post('/api/sessions/login')
        .send({
          email: 'tr.ezequiel@gmail.com',
          password: '123456' // Usa credenciales válidas para obtener la cookie
        });

      // Obtén la cookie del encabezado 'set-cookie'
      cookie = response.headers['set-cookie'];

      const createProductResponse = await request(app)
      .post('/products') // Ajusta la ruta según sea necesario
      .set('Cookie', cookie) // Incluye la cookie en la solicitud
      .send({
        title: randomCode,
        description: 'Descripción del nuevo producto',
        price: 100,
        thumbnail: [],
        code: randomCode,
        stock: 50,
        category: "PRUEBAS",
        status: true });

      // Verificar si se creó correctamente el producto
      productId = createProductResponse.body.payload._id;

      if (!productId) {
        throw new Error("Failed to create product");
      }

      // Crear un carrito de prueba
      const createCartResponse = await request(app)
        .post("/api/carts")
        .set('Cookie', cookie);

      cartId = createCartResponse.body.payload._id;

      if (!cartId) {
        throw new Error("Failed to create cart");
      }

      const second = await request(app)
      .post('/api/sessions/login')
      .send({
        email: 'prueba@prueba.com',
        password: '123' // Usa credenciales válidas para obtener la cookie
      });

    // Obtén la cookie del encabezado 'set-cookie'
    cookie = second.headers['set-cookie'];

      // Agregar el producto al carrito
         await request(app)
        .post(`/api/carts/${cartId}/${productId}`)
        .set('Cookie', cookie)
        .send();


    } catch (error) {
      console.error("Error during setup:", error);
      throw error; // Propaga el error para que las pruebas fallen correctamente
    }
  });

  it("el endpoint POST /carts debe crear un carrito correctamente", async function () {
    const response = await request(app)
      .post("/api/carts")
      .set('Cookie', cookie)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("result", "success");
    expect(response.body.payload).to.have.property("_id");
  });

  it("el endpoint POST /carts/:cid/:pid debe agregar un producto al carrito correctamente", async function () {

    const response = await request(app)
      .post(`/api/carts/${cartId}/${productId}`)
      .set('Cookie', cookie)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("result", "success");
  });

  it("el endpoint DELETE /carts/:cid debe eliminar todos los productos de un carrito correctamente", async function () {
    const response = await request(app)
      .delete(`/api/carts/${cartId}`)
      .set('Cookie', cookie)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("result", "success");
    expect(response.body.payload).to.equal("Todos los productos fueron eliminados del carrito exitosamente");
  });
});
