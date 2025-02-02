

// La librería nodemailer para enviar correos y la librería googleapis para interactuar con la API de Google
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;
// Función asíncrona que crea un transporter de nodemailer para enviar correos usando OAuth2
const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,  // Secreto del cliente obtenido de la consola de Google
        process.env.REDIRECT_URI // URI de redirección registrada en Google (por ejemplo, http://localhost)
    );

  
// Establecemos las credenciales del cliente OAuth2, en este caso el Refresh Token, que permite obtener un nuevo Access Token cuando expire
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN // El Refresh Token previamente obtenido de Google al autorizar la app

    });
// Usamos el Refresh Token para obtener un Access Token (token de acceso temporal) válido
    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {

            if (err) {
                reject("Failed to create access token."); // Si ocurre un error, se rechaza la promesa
            }

            resolve(token); // Si no hay error, se resuelve la promesa con el Access Token

        });

    });
// Creamos un transporter de nodemailer para enviar correos utilizando Gmail como servicio y la autenticación de OAuth2
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,  // El correo electrónico desde el cual se enviarán los correos
            accessToken,
            clientId: process.env.CLIENT_ID, // El Client ID de nuestra aplicación
            clientSecret: process.env.CLIENT_SECRET,  // El Client Secret de la aplicación
            refreshToken: process.env.REFRESH_TOKEN // El Refresh Token utilizado para renovar el Access Token
        }

    });

     // Retornamos el transporter creado, que ya está configurado para enviar correos utilizando la autenticación de Google
    return transporter;

};

// Función para enviar un correo utilizando el transporter creado
const sendEmail = async (emailOptions) => {
    try {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions); 
    } catch (e) {
    
    console.log(e)
    
    }
    
    };
    
    module.exports = { sendEmail }