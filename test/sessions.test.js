import * as chai from "chai";
import supertest from "supertest";
import app from "../src/app.js"

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

function generateRandomEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
  let username = '';
  let domain = '';
  for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) {
      username += chars[Math.floor(Math.random() * chars.length)];
  }
  for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
      domain += chars[Math.floor(Math.random() * chars.length)];
  }
  const email = `${username}@${domain}.com.ar`;
  return email;
}

describe("test users", () => {
  describe("test user endpoints", function () {
    
    it("el endpoint POST /signup debe permitir el registro", async () => {
      let randomMail = generateRandomEmail()
      const userMock = {
        first_name: 'Jhon',
        last_name: 'Doe',
        email: generateRandomEmail(),
        age: 34,
        password: "password123"
      };

      const { statusCode, headers, body } = await requester.post("/api/sessions/signup").send(userMock);

      expect(statusCode).to.equal(302);
      expect(headers.location).to.equal('/login');
    });

    it("el endpoint POST /login debe verificar que la contraseña sea válida", async () => {
      const userMock = {
        email: 'tester@user.com.ar',
        password: 'pass123'
      };

      const { statusCode, body } = await requester.post("/api/sessions/login").send(userMock);

      expect(statusCode).to.equal(302);
    });

    it('el endpoint POST /login no debe permitir iniciar sesión con un email no registrado', async () => {
      const userMock = {
        email: 'tester@user.com',
        password: 'pass123'
      };

      const { statusCode, body } = await requester.post("/api/sessions/login").send(userMock);

      expect(statusCode).to.equal(401);
    });
});})