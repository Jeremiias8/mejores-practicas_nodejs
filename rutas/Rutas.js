const express = require('express');
const router = express.Router();

const Modelo = require('../modelo/Modelo');
const bcrypt = require('bcrypt');
const Controlador = require('../controladores/Controlador');
const controlador = new Controlador();

router.get('/ruta-test', (req, res) => {

    res.status(200).send({ 
        messsage: 'ruta aprobada desde el server con NodeJS.' 
    });
});

router.get('/obtener-modelo', controlador.validarToken, 
async (req, res) => {

    let usuarios = await Modelo.find();
    res.json(usuarios);

    res.status(200).send({
        message: 'se envío el model necesario.',
        Modelo
    });
});

// obtener modelo mediante ID
router.get('/obtener-modelo/:id', async (req, res) => {

    let id = req.params.id;
    let usuariosPorId = await Modelo.findById(id);
    res.json(usuariosPorId);

    // obtención mediante Email
    const query = Modelo.where({ email: email });
    const usuarioPorEmail = await query.findOne();

});

// crear nuevo modelo
router.post('/modelo', async (req, res) => {

    const contraseñaHasheada = await bcrypt.hash(req.body.contraseña, 10);

    let usuario = Modelo({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        contraseña: req.body.password,
        id: contraseñaHasheada
    });

    usuario.save().then((resultado) => {
        res.send(resultado);
    }).catch((err) => {

        if (err.code == 11000) {
            res.send({
                "status": "error", 
                "message": "El correo ya ha sido registrado"
            });
        } else {

            res.send({ "status": "error",
                "message": err.message
            });
        }

    });

});

// actualizar modelo
router.patch('/modelo/:id', (req, res) => {

    // objetivo: actualizar usuario existente en la BBDD
    // recogemos id mediante los parámetros recibidos
    let id = req.params.id;

    let usuarioActualizado = {
        name: req.body.name,
        apellido: req.body.apellido,
        email: req.body.email,
        id: req.body.id
    };

    Modelo.findByIdAndUpdate(id, usuarioActualizado, { new: true }).then((resultado) => {

        res.send(resultado);
    }).catch((error) => {

        console.log(error);
        res.send("Error actualizando el registro de usu");
    });
});

// eliminar modelo
router.delete('/modelo/:id', (req, res) => {

    let id = req.params.id;
    Modelo.deleteOne({ _id: id }).then(() => {

        res.json({ "status": "success",
            "message": "Usuario borrado exitosamente"
        });
    }).catch((error) => {

        console.log(error);
        res.json({ "status": "failed", 
            "message": "Error mientras se borraba el modelo"
        });
    });
});

// inicio de sesión
router.post('/login', (req, res) => {

    // auth de user
    const email = req.body.email;
    const password = req.body.password;

    controlador.logeo(email, password).then((resultado) => {
        
        res.send(resultado);
    });
});

module.exports = router;