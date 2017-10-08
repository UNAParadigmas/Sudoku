var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	nombre: { type: String, max: 35 },
	usuario: { type: String, required: true, max: 35 }, //usuario
	pass: { type: String, required: true, max: 35 }, //contraseña
	partida: { //Partida actual guardada en el perfil del usuario
		dificultad: Number, //Nivel de  dificultad
		sudokuInicial: String,
		sudokuGuardado: String,
		sudokuUndo: [String]
	}
});

module.exports = mongoose.model('Usuario', UsuarioSchema);