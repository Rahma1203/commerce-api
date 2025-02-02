const request = require('supertest');
const app = require('../app'); 


let token;

describe('POST /api/user/register', () => {
  it('should register a new user successfully', async () => {
    const newUser = {
      nombre: "Rahma",
      edad: 20,
      ciudad: "Soria",
      interests: ["Restaurante"],
      email: "40@test.com",
      permiteRecibirOfertas: false,
      password: "HolaMundo01"
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      nombre: "Rahma",
      edad: 20,
      ciudad: "soria",
      email: "40@test.com",
      interests: ["Restaurante"],
      permiteRecibirOfertas: false
    });
  }); 

  it('should return an error if email already exists', async () => {
    const newUser = {
      nombre: "Rahma",
      edad: 20,
      ciudad: "Soria",
      interests: ["Restaurante"],
      email: "40@test.com", 
      permiteRecibirOfertas: false,
      password: "HolaMundo01"
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(newUser)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400); 
    expect(response.body.error).toBe('El correo ya está registrado');
  });
});





// Prueba unitaria para login de usuario
describe('POST /api/user/login', () => {
  it('should login a user successfully and return a token', async () => {
    const loginData = {
      email: '40@test.com',
      password: 'HolaMundo01',
    };

    const response = await request(app)
      .post('/api/user/login')
      .send(loginData)
      .set('Content-Type', 'application/json');

    token = response.body.token;
    
    
    expect(response.status).toBe(200);

   
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error if the email or password is incorrect', async () => {
    const loginData = {
      email: '40@test.com',
      password: 'IncorrectPassword',  // Contraseña incorrecta
    };

    const response = await request(app)
      .post('/api/user/login')
      .send(loginData)
      .set('Content-Type', 'application/json');
    
   
    expect(response.status).toBe(400);

    
    expect(response.body.error).toBe("INVALID_PASSWORD");
  });
});

// Prueba unitaria para editar un usuario
describe('PUT /api/user/update', () => {
  it('should edit a user successfully', async () => {
    const userData = {
      nombre: "Rahma",
      edad: 25,
      ciudad: "Soria",
      email: "40@test.com",
      interests: ["Restaurante"],
      permiteRecibirOfertas: false,
      password: "HolaMundo01"
    };


   
    const response = await request(app)
      .put('/api/user/update')
      .set('Authorization', `Bearer ${token}`) 
      .set('Content-Type', 'application/json')
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', "Usuario actualizado con éxito.");
  });

  it('should return an error if no token is provided', async () => {
    const response = await request(app)
      .put('/api/user/update')
      .set('Content-Type', 'application/json')
      .send({
        nombre: "Rahma",
        edad: 25
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', "Token no proporcionado");
  });
});


