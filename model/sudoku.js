var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SudokuSchema = new Schema({
	hilera: String
});

module.exports = mongoose.model('Sudoku', SudokuSchema);