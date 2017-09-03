class Grid{
	constructor(size){
		this.matrix = Array.from(new Array(size)).reduce(z=>z.concat([Array.from(new Array(size)).reduce(z=>z.concat(new Cell()), new Array())]), new Array());
		//console.log(this.matrix);
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
		return this.matrix[loc.row][loc.col];
	}
	toString(){
		return this.reduceX(x=>x.getValue()||'.', '');
	}
}
