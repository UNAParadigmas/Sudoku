var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Tiene una referencia al id del usuario con el que esta asociado
 * tiempo en minutos
 */

var HistorialSchema = new Schema({
    usuario: { 
        type: Schema.Types.ObjectId,
        ref: "Usuario"
    },
    tiempo: Number,
    dificultad: Number
});

module.exports = mongoose.model('Historial', HistorialSchema);