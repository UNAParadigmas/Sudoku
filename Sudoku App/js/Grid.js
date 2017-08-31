class Grid{
	constructor(size){
		this.matrix = (new Array(size)).fill([(new Array(size).fill(new Cell()))]);
	}
	
	clone(){
		return this.map(x=>x.clone());
	}
	
	map(f){
		return this.matrix.map(elem => elem.map(elem => f(elem)));
	}
	
	get(loc){
		return matrix[loc.row][loc.col];
	}
}

module.exports = {
	Grid
}