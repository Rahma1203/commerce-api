const request = require('supertest');
const app = require('../app');
const path = require('path');


let token;
let comercioToken;
let tokenUser;




beforeAll(async () => {
    
    const loginData2 = {
        email: '2@test.com',
        password: 'HolaMundo01',
    };

    const loginResponse2 = await request(app)
        .post('/api/user/login')
        .send(loginData2)
        .set('Content-Type', 'application/json');

    tokenUser = loginResponse2.body.token;

})  

beforeAll(async () => {
  // Obtener el token del usuario
  const loginData = {
    email: '3@test.com',
    password: 'HolaMundo01',
  };

  const loginResponse = await request(app)
    .post('/api/user/login')
    .send(loginData)
    .set('Content-Type', 'application/json');

  token = loginResponse.body.token; // El token del usuario
});

beforeAll(async () => {
  // Obtener el token de comercio
  const comercioResponse = await request(app)
    .get('/api/commerces/ABT2345')
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json');

 console.log("Respuesta del comercio:", comercioResponse.body); // Verificar contenido
  comercioToken = comercioResponse.body.token; 
});

describe('POST /api/webpages', () => {
  it('Debe crear una página web cuando se envía un token válido', async () => {
    const response = await request(app)
      .post('/api/webpages')
      .set('Authorization', `Bearer ${comercioToken}`)
      .set('Content-Type', 'application/json')
      .send({
        ciudad: 'Lugo',
        actividad: 'Servicio',
        titulo: 'Servicio Ejemplo',
        resumen: 'Servicio al mejor precio',
        textos: [],
        imagenes: []
      });

      console.log("Respuesta de la API:", response.body);

    expect(response.status).toBe(201); 
    expect(response.body.pagina).toHaveProperty('_id');
    expect(response.body.pagina.ciudad).toBe('lugo');

  });

  it('Debe devolver un error 401 si no se envía el token', async () => {
    const response = await request(app)
      .post('/api/webpages')
      .set('Content-Type', 'application/json')
      .send({
        ciudad: 'Lugo',
        actividad: 'Servicio',
        titulo: 'Servicio Ejemplo',
        resumen: 'Servicio al mejor precio',
        textos: [],
        imagenes: []
      });

    expect(response.status).toBe(401); 
    expect(response.body.error).toBe('Token no proporcionado'); 
  });
});



// ACTUALIZAR PAGINA WEB

describe('PUT /api/webpages', () => {

    it('Debe actualizar la página web con datos válidos', async () => {
        const response = await request(app)
            .put('/api/webpages')
            .set('Authorization', `Bearer ${comercioToken}`)
            .set('Content-Type', 'application/json')
            .send({
                ciudad: 'Soria',
                actividad: 'Restaurante',
                titulo: 'Restaurante Ejemplo Actualizado',
                resumen: 'Actualización del restaurante con nuevos platos.',
                textos: [],
                imagenes: []
            });

        expect(response.status).toBe(200); 
        expect(response.body.pagina.ciudad).toBe('soria');
        expect(response.body.pagina.actividad).toBe('restaurante');
        expect(response.body.pagina.titulo).toBe('Restaurante Ejemplo Actualizado');
        expect(response.body.pagina.resumen).toBe('Actualización del restaurante con nuevos platos.');
    });

});


// ESCRIBIR TEXTOS

describe('PATCH /api/webpages/updateText', () => {
   

    it('Debe actualizar los textos de la página web con un token válido', async () => {
        const response = await request(app)
            .patch('/api/webpages/updateText')
            .set('Authorization', `Bearer ${comercioToken}`)
            .set('Content-Type', 'application/json')
            .send({
                textos: ['Text1']
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Texto subido con éxito.');
        expect(response.body.data.textos).toContain("Text1");
 
    });


    


});	

//ARCHIVAR PAGINA

describe('PATCH /api/webpages/archive', () => {

    it('Debe archivar la página web correctamente con un token válido', async () => {
        const response = await request(app)
            .patch('/api/webpages/archive')
            .set('Authorization', `Bearer ${comercioToken}`)
            .set('Content-Type', 'application/json')
            .send({ archivado: true });

        console.log("Respuesta de la API:", response.body);

        expect(response.status).toBe(200); // Código de éxito esperado
        expect(response.body.message).toBe('Página archivada exitosamente.');
        expect(response.body.paginaArchivada.archivado).toBe(true);

    });

});


// Obtener interesados 

describe('GET /api/webpages/interests', () => {
    

    it('Debe devolver los interesados correctamente', async () => {
        const response = await request(app)
            .get('/api/webpages/interests/ciudad/Soria')
            .set('Authorization', `Bearer ${comercioToken}`)
            .set('Content-Type', 'application/json');

        console.log("Respuesta de la API:", response.body);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Usuarios interesados obtenidos con éxito.');
        expect(response.body).toHaveProperty('usuarios');
        expect(response.body.usuarios).toBeInstanceOf(Array);
 
    });
});


// OBTENER UNA PAGINA WEB
describe('GET /api/webpages/:webPageId', () => {
  it('Debe obtener una página web correctamente con un ID válido', async () => {
      const webPageId = '679e9358000d514c1213324a'; 
      
      const response = await request(app)
          .get(`/api/webpages/${webPageId}`)
          .set('Content-Type', 'application/json');

      console.log("Respuesta de la API:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body._id).toBe(webPageId);
      
  });
  
});

// OBTENER TODAS LAS PAGINAS WEB
describe('GET /api/webpages', () => {
  it('Debe obtener todas las páginas web correctamente', async () => {
      const response = await request(app)
          .get('/api/webpages')
          .set('Content-Type', 'application/json'); 

      console.log("Respuesta de la API:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
  });
});

// Obtener todas las paginas por scoring

describe('GET /api/webpages', () => {
  it('Debe obtener todas las páginas web correctamente', async () => {
      const response = await request(app)
          .get('/api/webpages?puntuacion=true')
          .set('Content-Type', 'application/json'); 

      console.log("Respuesta de la API:", response.body);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
     
  });
});


// OBTENER PAGINA POR CIUDAD

describe('GET /api/webpages/ciudad/:ciudad', () => {
  it('Debe obtener todas las páginas web por ciudad correctamente', async () => {
      const response = await request(app)      
          .get('/api/webpages/ciudad/Lugo')
          .set('Content-Type', 'application/json'); 

      console.log("Respuesta de la API:", response.body);

      expect(response.status).toBe(200);  
      expect(response.body).toBeInstanceOf(Array);    
  });
});


// OBTENER PAGINA POR ACTIVIDAD Y CIUDAD

describe('GET /api/webpages/ciudad/:ciudad/actividad/:actividad', () => {
  it('Debe obtener todas las páginas web por ciudad y actividad correctamente', async () => {
      const response = await request(app)      
          .get('/api/webpages/ciudad/Soria/actividad/restaurante')
          .set('Content-Type', 'application/json'); 

      console.log("Respuesta de la API:", response.body);

      expect(response.status).toBe(200);  
      expect(response.body).toBeInstanceOf(Array);    
  });
})


// Usuario sube reseña

describe('PATCH /api/webpages/createReview/:webPageId', () => {
  it('Debe crear una reseña correctamente', async () => {
    const webPageId = '679e9358000d514c1213324a';

    const response = await request(app)
      .patch(`/api/webpages/createReview/${webPageId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tokenUser}`)
      .send({
        puntuacion: 2,
        comentario: 'Excelente servicio 2'
      });

    console.log("Respuesta de la API:", response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('pagina'); 
    expect(response.body.pagina).toHaveProperty('resenas'); 
    
    expect(response.body.pagina.resenas.puntuacion).toBe(2);
    expect(response.body.pagina.resenas.resenas[0].comentario).toBe('Excelente servicio 2');
  });
});








