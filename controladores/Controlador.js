
const Modelo = require('../modelo/Modelo');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Controlador {
    constructor() {}

    async logeo(email, contraseña) {

        try {

            const usuario = await Modelo.findOne({ email });
            if (!usuario) {
                return { "status": "error",
                    "mensaje": "El usuario no existe"
                };
            }

            // comparar contraseña con la ya almacenada
            const contraseñaAlmacenada = await bcrypt.compare(password, usuario.contraseña);
            if (!contraseñaAlmacenada) {
                return { "status": "error",
                    "mensaje": "Contraseña incorrecta"
                };
            }

            // generar token
            const token = jwt.sign({
                userId: usuario._id,
                email: usuario.email,
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return { "status": "success",
                "token": token
            };

        } catch (error) {

            console.log(error);
            return { "status": "error", 
                "message": "Error al iniciar sesión" 
            };
        }
    }

    validarToken(req, res, next) {

        const portadorDeToken = req.headers["authorization"];

        if (!portadorDeToken) {
            return res.status(401).json({
                message: "Token no existente"
            });
        }

        const token = portadorDeToken.startsWith("Bearer ") ? portadorDeToken.slice(7) : portadorDeToken;

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    message: "Token inválido"
                });
            }

            req.userId = decoded.userId;
            next();
        });
    }
}

module.exports = Controlador