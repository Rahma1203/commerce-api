const { verifyToken } = require('../utils/handleJwt'); 

exports.authMiddleware = async (req, res, next) => {
  try {
     console.log("token:", req.headers.authorization);
    // Obtener el token del header Authorization
    const token = req.headers.authorization?.split(' ')[1]; // Formato: "Bearer <token>"
    
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
 
    console.log("Token recibido:", token);
    // Verificar y decodificar el token
    const decoded = verifyToken(token);
    console.log("Token decodificado:", decoded); 
    
    if (!decoded) {
      return res.status(401).json({ error: "Error de autenticación" });
   }
   

    // Agregar la información del usuario decodificada a req.user
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Error de autenticación" });
  }
};






