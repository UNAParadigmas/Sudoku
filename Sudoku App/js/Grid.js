class Grid {
	constructor(size){
		this.matrix = this.fillMatrix(size);
	}
	
	fill(f, size){
		return (new Array(size)).fill(null).reduce(z=>f(z), new Array());
	}
	
	fillMatrix(size){
		return this.fill(x=>x.concat([this.fill(x=>x.concat(new Cell(0)),size)]),size);
	}
	
	get(loc){
		return this.matrix[loc.row][loc.col];
	}
	toString(){
		let f = x => x.getValue() || '.'
		return this.matrix.reduce((z,e) => z + e.reduce((z,e) => z + f(e), '') , '')
	}
}
