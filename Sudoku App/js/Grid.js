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
	reduceX(f,v){
		return this.matrix.reduce((z,e)=>z+f(e.reduce((z,e)=>z+f(e),v)),v)
	}
	get(loc){
		return matrix[loc.row][loc.col];
	}
	toString(){
		return reduceX(x=>x.getValue()||'.', '');
	}
}

module.exports = {
	Grid
}