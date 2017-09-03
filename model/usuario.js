var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
	nombre: { type: String, max: 35 },
	usuario: { type: String, required: true, max: 35 }, //usuario
	pass: { type: String, required: true, max: 35 }, //contraseña
	partida: { //El sudoku
		tam: Number, //tamaño del sudoku
		dificultad: Number, //Nivel de  dificultad
		sudoku: [
			Number //la cuadricula del sudoku
		]
	}


});

module.exports = mongoose.model('Usuario', UsuarioSchema);