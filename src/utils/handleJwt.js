const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = (user) => {
    console.log("user:", user);
    return jwt.sign({_id: user._id, role: user.role}, JWT_SECRET, {expiresIn: "2h"});
};

const tokenCommerce = (cif) => {
    return jwt.sign({cif: cif.cif}, JWT_SECRET, {expiresIn: "2h"});
};

const verifyToken = (tokenJwt) => {
    try {
        return jwt.verify(tokenJwt, JWT_SECRET);
    } catch (err) {
        console.error("Error verificando el token JWT:", err);
        return null;
    }
};

module.exports = {tokenSign, verifyToken, tokenCommerce};
