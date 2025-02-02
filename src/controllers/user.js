const {tokenSign} = require("../utils/handleJwt");
const { matchedData } = require('express-validator');
const {encrypt} = require("../utils/handlePassword");
const {compare} = require("../utils/handlePassword");
const usersModel = require("../models/User");
const {handleHttpError} = require("../utils/handleError");





exports.registerCtrl = async (req, res) => {
    try {
        
        const emailExists = await usersModel.findOne({ email: req.body.email });

        if (emailExists) {
            return res.status(400).send({ error: 'El correo ya está registrado' });
        }
       
        let data = matchedData(req);
        data.password = await encrypt(data.password);
        const dataUser = await usersModel.create(data);

        
       return  res.status(201).json({
            token: await tokenSign(dataUser),
            user: dataUser,
        });
        
    } catch (err) {
        console.log("Error en el registro:", err);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};




exports.loginCtrl = async (req, res) => {
    try {
        const user = await usersModel.findOne({ email: req.body.email }).select("password name role email");
        
        if(!user){
            handleHttpError(res, "USER_NOT_EXISTS");
            return;
        }
        
        const hashPassword = user.password;
        const check = await compare(req.body.password, hashPassword);
        if(!check){
            handleHttpError(res, "INVALID_PASSWORD");
            return;
        }
        
       
        return  res.status(200).json({
            token: await tokenSign(user),
            user
        });

       
        
    } catch(err){
        console.log(err);
        handleHttpError(res, "ERROR_LOGIN_USER");
    }
}



 
exports.UpdateUserCtrl = async (req, res) => {
  try {
    // Obtener el _id del usuario 
    const _id = req.user._id;  
    
    if (!_id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    const updates = req.body;

    // No se permite actualizar el 'role'
    if (updates.role) {
      return res.status(403).json({ error: "No se permite actualizar el rol del usuario." });
    }

    // Verificacion si el email ya está en uso
    if (updates.email) {
      const existingUser = await usersModel.findOne({ email: updates.email });
      if (existingUser && existingUser._id.toString() !== _id.toString()) {
        return res.status(400).json({ error: "El correo electrónico ya está en uso." });
      }
    }

    // Si se proporciona un nuevo password, encriptarlo
    if (updates.password) {
      updates.password = await encrypt(updates.password);
    }
    
        
    // Actualizar el usuario
    const user = await usersModel.findByIdAndUpdate(
      _id,
      updates,
      { new: true }
    ).select('-password'); // Excluir el password de la respuesta por seguridad :D

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    user.save()


    res.json({ message: "Usuario actualizado con éxito.", user });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario." });
  }
};

// Eliminar el usuario
exports.deleteUserCtrl = async (req, res) => {
  try {
 
    
    // Obtener el _id del usuario 
    const _id = req.user._id;  
    
    if (!_id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Eliminar el usuario
    const delateUser = await usersModel.findByIdAndDelete(_id);

    if (!delateUser) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json({ message: "Usuario eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario." });
  }
};