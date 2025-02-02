const request = require('supertest');
const app = require('../app'); 

let token;
let cif = 'ABI2345'
  
// Previo a todas las pruebas, obtenemos un token válido
beforeAll(async () => {
  const loginData = {
    email: '3@test.com',  
    password: 'HolaMundo01',
  };

  const loginResponse = await request(app)
    .post('/api/user/login')
    .send(loginData)
    .set('Content-Type', 'application/json');

  token = loginResponse.body.token; 
});


describe('POST /api/commerces', () => {
  
  
    it('should create a commerce successfully with a valid token', async () => {
      const commerceData = {
        nombre: "Comercio Ejemplo",
        cif: "ABI2345",
        direccion: "Calle Falsa 123",
        email: "contacto1@comercioejemplo.com",
        tel: "123056789",
        idPagina: 1,
      };
  
      const response = await request(app)
        .post('/api/commerces')
        .set('Authorization', `Bearer ${token}`)  
        .set('Content-Type', 'application/json')
        .send(commerceData);
  
      
      expect(response.status).toBe(200);
  
      // Verificar que la respuesta contenga los datos del comercio creado
      expect(response.body).toMatchObject({
        message: "Comercio creado con éxito",
        commerce: {
          nombre: "Comercio Ejemplo",
          cif: "ABI2345",
          direccion: "Calle Falsa 123",
          email: "contacto1@comercioejemplo.com",
          tel: "123056789",
          idPagina: 1,
        }
      });
      
      
      expect(response.body).toHaveProperty('message', 'Comercio creado con éxito');
    });
  
    it('should return an error if no token is provided', async () => {
      const commerceData = {
        nombre: "Comercio Ejemplo",
        cif: "ABI2345",
        direccion: "Calle Falsa 123",
        email: "contacto1@comercioejemplo.com",
        tel: "123056789",
        idPagina: 1,
      };
  
      const response = await request(app)
        .post('/api/commerces')
        .set('Content-Type', 'application/json')
        .send(commerceData);
  
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token no proporcionado');
    });
  });

  
  //Obtener comercio por CIF
  describe('GET /api/commerces/:cif', () => {
  
    it('should return commerce data with a valid token', async () => {
      const response = await request(app)
          .get(`/api/commerces/${cif}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('commerce');
      expect(response.body.commerce).toHaveProperty('cif', cif);
  });

  it('should return an error if no token is provided', async () => {
      const response = await request(app)
          .get(`/api/commerces/${cif}`)
          .set('Content-Type', 'application/json');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token no proporcionado');
  });

  it('should return 404 if commerce does not exist', async () => {
      const response = await request(app)
      .get(`/api/commerces/Noexiste`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message',"Comercio no encontrado.")
  });
});


// Obtener todos los comercios
 
describe('GET /api/commerces', () => {

  it('should return a list of commerces with a valid token', async () => {
    const response = await request(app)
      .get('/api/commerces')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); 
    expect(response.body.length).toBeGreaterThan(0); 
  });
});

describe('GET /api/commerces (Token Error Cases)', () => {

  it('should return an error if no token is provided', async () => {
    const response = await request(app)
      .get('/api/commerces')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token no proporcionado');
  });

  
});

// Obtener los comercios ordenados 

describe('GET /api/commerces', () => {
  it('should return a list of commerces ordered by CIF', async () => {
    const response = await request(app)
      .get('/api/commerces?sort=cif')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(200);
    
    // Verificar que la respuesta contenga un array de comercios
    expect(Array.isArray(response.body)).toBe(true);

   
  });

  it('should return an error if no token is provided', async () => {
    const response = await request(app)
      .get('/api/commerces?sort=cif')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token no proporcionado');
  });

 
});


// ACTUALIZAR EL COMERCIO

describe('PUT /api/commerces/update/:cif', () => {
  it('should update commerce data successfully with a valid token', async () => {
    const updatedData = {
      direccion: "Avenida Siempre Viva 745",
      tel: "987654321",
    };

    const response = await request(app)
      .put(`/api/commerces/update/${cif}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(updatedData);

    expect(response.status).toBe(200);
    
    
    expect(response.body).toHaveProperty('message', 'Comercio actualizado con éxito');
    
    // Verificar que los datos se hayan actualizado correctamente
    expect(response.body.commerce).toMatchObject({
      direccion: updatedData.direccion,
      tel: updatedData.tel,
    });
  });

  it('should return an error if no token is provided', async () => {
    const updatedData = {
      direccion: "Avenida Siempre Viva 745",
      tel: "987654321",
    };

    const response = await request(app)
      .put(`/api/commerces/update/${cif}`)
      .set('Content-Type', 'application/json')
      .send(updatedData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token no proporcionado');
  });

  it('should return an error if the token is invalid', async () => {
    const updatedData = {
      direccion: "Avenida Siempre Viva 745",
      tel: "987654321",
    };

    const invalidToken = 'invalidTokenExample';
    const response = await request(app)
      .put(`/api/commerces/update/${cif}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .set('Content-Type', 'application/json')
      .send(updatedData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Error de autenticación');
  });

  it('should return an error if the commerce does not exist', async () => {
    const nonExistentCif = 'NONEXISTENTCIF';
    const updatedData = {
      direccion: "Avenida Siempre Viva 745",
      tel: "987654321",
    };

    const response = await request(app)
      .put(`/api/commerces/update/${nonExistentCif}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(updatedData);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Comercio no encontrado.');
  });
});


// BORRAR COMERCIO LÓGICAMENTE

describe('DELETE /api/commerces/:cif', () => {
  
  it('should logically delete a commerce with a valid token', async () => {
    const response = await request(app)
      .delete(`/api/commerces/${cif}?tipo=logico`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Borrado lógico exitoso.');
  });

  it('should return 404 if commerce does not exist', async () => {
    const response = await request(app)
      .delete('/api/commerces/NO_EXISTE?tipo=logico')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Comercio no encontrado.');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .delete(`/api/commerces/${cif}?tipo=logico`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token no proporcionado');
  });

});

// BORRADO FÍSICO

describe('DELETE /api/commerces/:cif', () => {
  
  it('should logically delete a commerce with a valid token', async () => {
    const response = await request(app)
      .delete(`/api/commerces/${cif}?tipo=fisico`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Borrado físico exitoso.');
  });

  it('should return 404 if commerce does not exist', async () => {
    const response = await request(app)
      .delete('/api/commerces/NO_EXISTE?tipo=fisico')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Comercio no encontrado.');
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app)
      .delete(`/api/commerces/${cif}?tipo=logico`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Token no proporcionado');
  });

});