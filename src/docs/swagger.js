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
                    scheme: "bearer"
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
                            example: "contacto@tienda.com" 
                        },
                        tel: { 
                            type: "string", 
                            example: "666123456" 
                        },
                        idPagina: { 
                            type: "number", 
                            example: 1 
                        },
                        archivado: { 
                            type: "boolean", 
                            default: false 
                        }
                    }
                },
                Usuario: {
                    type: "object",
                    required: ["name", "email", "password"],
                    properties: {
                        name: { 
                            type: "string", 
                            example: "Juan Pérez" 
                        },
                        email: { 
                            type: "string", 
                            example: "juan@ejemplo.com" 
                        },
                        age: { 
                            type: "number", 
                            example: 30 
                        },
                        interests: { 
                            type: "array", 
                            items: { 
                                type: "string" 
                            },
                            example: ["deportes", "tecnología"] 
                        },
                        allowsReceivingOffers: { 
                            type: "boolean", 
                            example: true 
                        },
                        role: { 
                            type: "string", 
                            enum: ["user", "admin"], 
                            default: "user" 
                        }
                    }
                },
                PaginaWeb: {
                    type: "object",
                    required: ["ciudad", "actividad", "titulo", "resumen", "textos"],
                    properties: {
                        ciudad: { 
                            type: "string", 
                            example: "Madrid" 
                        },
                        actividad: { 
                            type: "string", 
                            example: "Restauración" 
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
                            example: ["http://localhost:3000/file-1729712181823.jpg"] 
                        },
                        resenas: {
                            type: "object",
                            properties: {
                                puntuacion: { 
                                    type: "number", 
                                    example: 4.5 
                                },
                                numeroPuntuaciones: { 
                                    type: "number", 
                                    example: 10 
                                },
                                resenas: { 
                                    type: "array", 
                                    items: { 
                                        type: "string" 
                                    },
                                    example: ["Excelente servicio"] 
                                }
                            }
                        },
                        archivado: { 
                            type: "boolean", 
                            default: false 
                        }
                    }
                }
            },
        },
    },
    apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);