import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js'; // Ajusta la ruta según sea necesario

function generateRandomCode(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

describe('Productos API', function() {
  let cookie;
  let createdProductId;

  before(async function() {
    // Autenticar y obtener la cookie
    const response = await request(app)
      .post('/api/sessions/login') // Ajusta la ruta de login según tu configuración
      .send({
        email: 'tr.ezequiel@gmail.com',
        password: '123456' // Usa credenciales válidas para obtener la cookie
      });

    // Obtén la cookie del encabezado 'set-cookie'
    cookie = response.headers['set-cookie']; // Obtiene todas las cookies
  });

  it('Debería obtener todos los productos', async function() {
    const response = await request(app)
      .get('/products') // Ajusta la ruta según sea necesario
      .set('Cookie', cookie); // Incluye la cookie en la solicitud

    expect(response.status).to.equal(200);
    // Realiza las demás comprobaciones necesarias
  });

  it('Debería crear un nuevo producto', async function() {
    const randomCode = generateRandomCode(); // Generar un código aleatorio
    const response = await request(app)
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
        status: true
      });

    createdProductId = response.body.payload._id; // Suponiendo que el servidor devuelve el ID del producto en la respuesta

    expect(response.status).to.equal(200);
  });

  it('Debería obtener un producto por ID', async function() {
    const response = await request(app)
      .get(`/products/${createdProductId}`) // Ajusta la ruta según sea necesario
      .set('Cookie', cookie); // Incluye la cookie en la solicitud

    expect(response.status).to.equal(200);
  });

  it('Debería actualizar un producto', async function() {
    const response = await request(app)
      .put(`/products/${createdProductId}`) // Ajusta la ruta según sea necesario
      .set('Cookie', cookie) // Incluye la cookie en la solicitud
      .send({
        title: 'Nuevo Producto 1515',
        description: 'Descripción del nuevo producto',
        price: 100,
        thumbnail: [],
        code: 'lalaaaaaaasssaaa',
        stock: 50,
        category: "PRUEBAS",
        status: true
      });

    expect(response.status).to.equal(200);
  });

  it('Debería eliminar un producto', async function() {
    this.timeout(5000); // Aumentar el tiempo de espera a 5 segundos
    const response = await request(app)
      .delete(`/products/${createdProductId}`) // Ajusta la ruta según sea necesario
      .set('Cookie', cookie); // Incluye la cookie en la solicitud

    expect(response.status).to.equal(200);
  });
});
