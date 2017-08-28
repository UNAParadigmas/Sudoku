var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	id: { type: String, required: true, max: 35 }, //usuario
	pass: { type: String, required: true, max: 35 }, //contraseña
	partida: { //El sudoku
		tam: {type: Number, required: true, min:4}, //tamaño del sudoku
		dificultad: {type: Number, required: true}, //Nivel de  dificultad
		sudoku: [
			Number //la cuadricula del sudoku
		]
	}


});

module.exports = mongoose.model('Usuario', UsuarioSchema);