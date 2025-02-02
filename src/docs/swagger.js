const swaggerJsdoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Comercios API",
            version: "0.1.0",
            description: "API para gestión de comercios, usuarios y páginas web",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Rahma",
                email: "rfellah725@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
            schemas: {
                Comercio: {
                    type: "object",
                    required: ["nombre", "cif", "direccion", "email", "tel", "idPagina"],
                    properties: {
                        nombre: { 
                            type: "string",
                            example: "Tienda de Ejemplo"
                        },
                        cif: { 
                            type: "string",
                            unique: true,
                            example: "B12345678"
                        },
                        direccion: { 
                            type: "string",
                            example: "Calle Principal 123"
                        },
                        email: { 
                            type: "string",
                            format: "email",
                            unique: true,
                            example: "contacto@tienda.com"
                        },
                        tel: { 
                            type: "string",
                            example: "666123456"
                        },
                        idPagina: { 
                            type: "number"
                        },
                        archivado: { 
                            type: "boolean",
                            default: false
                        },
                        webPageId: {
                            type: "string",
                            description: "ID de referencia a PaginaWeb"
                        }
                    }
                },
                Usuario: {
                    type: "object",
                    required: ["ciudad", "email", "password"],
                    properties: {
                        nombre: { 
                            type: "string",
                            example: "Juan Pérez"
                        },
                        edad: { 
                            type: "number",
                            example: 30
                        },
                        ciudad: { 
                            type: "string",
                            example: "Madrid"
                        },
                        email: { 
                            type: "string",
                            format: "email",
                            unique: true,
                            example: "juan@ejemplo.com"
                        },
                        password: {
                            type: "string",
                            format: "password",
                            description: "Contraseña hasheada",
                            example: "********"
                        },
                        interests: { 
                            type: "array",
                            items: { 
                                type: "string"
                            },
                            default: [],
                            example: ["deportes", "tecnología"]
                        },
                        permiteRecibirOfertas: { 
                            type: "boolean",
                            default: false
                        },
                        role: { 
                            type: "string",
                            enum: ["user", "admin"],
                            default: "user"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                Review: {
                    type: "object",
                    required: ["user", "puntuacion", "comentario"],
                    properties: {
                        user: {
                            type: "string",
                            description: "ID de referencia al usuario"
                        },
                        puntuacion: {
                            type: "number",
                            minimum: 0,
                            maximum: 5
                        },
                        comentario: {
                            type: "string"
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time"
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time"
                        }
                    }
                },
                PaginaWeb: {
                    type: "object",
                    required: ["ciudad", "actividad", "titulo", "resumen", "textos"],
                    properties: {
                        ciudad: { 
                            type: "string",
                            example: "madrid"
                        },
                        actividad: { 
                            type: "string",
                            example: "restauración"
                        },
                        titulo: { 
                            type: "string",
                            example: "Restaurante El Sabor"
                        },
                        resumen: { 
                            type: "string",
                            example: "Cocina tradicional de calidad"
                        },
                        textos: { 
                            type: "array",
                            items: { 
                                type: "string"
                            },
                            example: ["Bienvenidos a nuestro restaurante"]
                        },
                        imagenes: { 
                            type: "array",
                            items: { 
                                type: "string"
                            },
                            default: [],
                            example: ["imagen1.jpg", "imagen2.jpg"]
                        },
                        resenas: {
                            type: "object",
                            properties: {
                                puntuacion: { 
                                    type: "number",
                                    default: 0
                                },
                                resenas: {
                                    type: "array",
                                    items: {
                                        $ref: '#/components/schemas/Review'
                                    }
                                }
                            }
                        },
                        archivado: { 
                            type: "boolean",
                            default: false
                        }
                    }
                },
                Error: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string"
                        },
                        code: {
                            type: "number"
                        }
                    }
                }
            }
        }
    },
    apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);