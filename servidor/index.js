const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ficheroRutas = require('../rutas/Rutas');
const modeloControlador = require('../controladores/Controlador');

dotenv.config();

/* Mongoose connection */
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/mejores_practicas_nodejs-bbdd';

mongoose.connect(DB_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
})
.then(() => {
    console.log("Conexión a la BBDD exitosa.");
})
.catch((error) => {
    console.error("Error al conectar a la BBDD: ", error);
});

// middlewares
// permite analizar datos del body de la req
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', ficheroRutas);

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto: ${port}`);
});