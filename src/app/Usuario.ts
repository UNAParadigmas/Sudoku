export class Usuario {
	nombre: string;
	usuario: string;
	pass: string;
	partida: { //El sudoku
		tam: number, //tamaño del sudoku
		dificultad: number, //Nivel de  dificultad
		sudoku: [
			number //la cuadricula del sudoku
		]
	}
	constructor() {
	}
}