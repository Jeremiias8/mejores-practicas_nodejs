const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModeloSchema = Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true,
        validate: {

            validator: function(nombre) {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s]+$/
                .test(nombre);
            },
            message: props => `${props.value} no es un nombre válido !` 
        }
    },
    apellido: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {

            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: props => `${props.value} no es un correo válido !`
        }
    },
    contraseña: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('SchemaModel', 
ModeloSchema);