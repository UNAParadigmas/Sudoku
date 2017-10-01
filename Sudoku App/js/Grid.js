
class Grid{
	constructor(size){//constructor method, builds a grid of a given size.
		this.matrix = this.fillMatrix(size);
	}
	
	fill(f, size){//returns an array with different values given f a function that returns the next state of the array. the array size is given.
		return (new Array(size)).fill(null).reduce(z=>f(z), new Array());
	}
	
	fillMatrix(size){//returns an Array of arrays(Matrix) filled with cells. both arrays sizes are given.
		return this.fill(x=>x.concat([this.fill(x=>x.concat(new Cell(0)),size)]),size);
	}
	
	map(f){//map implementation for a matrix
		return this.matrix.map(elem => elem.map(f));
	}
	forEach(f){//forEach implementation for a matrix
		this.matrix.forEach(e => e.forEach(f));
	}
	get(loc){//given a location, returns a cell
		return this.matrix[loc.row][loc.col];
	}
	toString(){//returns a string of the values of all cells, if a cell is value 0, it replaces it for a '.'.
		return this.map(e=>e.getValue()).toString()
										.replace(/,/g,'')
										.replace(/0/g,'.');
	}
}
