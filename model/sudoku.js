/*var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SudokuSchema = new Schema({
    usuario: {type: Schema.ObjectId, ref: 'Usuario', required: true}, //relacion con usuario
    tam: {type: Number, required: true, min:4, max:12}, //tamaño del sudoku
    dificultad: Number, //Nivel de  dificultad
    sudoku: [ //la cuadricula del sudoku
         Number //valor de cada casilla que tiene el sudoku
    ]

});

module.exports = mongoose.model('Sudoku', SudokuSchema);*/