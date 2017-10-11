var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Tiene una referencia al id del usuario con el que esta asociado
 * tiempo en minutos
 */

var HistorialSchema = new Schema({
    usuario: String,
    tiempo: Number,
    dificultad: Number
});

module.exports = mongoose.model('Historial', HistorialSchema);