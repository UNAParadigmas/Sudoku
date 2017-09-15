
class Grid{
	constructor(size){
		this.matrix = this.fillMatrix(size);
		this.forEach(e=>this.setEventListeners(e))
	}
	
	setEventListeners(cell){
		document.addEventListener('updateCell', e=>{
		cell.setAllowed(
		cell.getAllowedValuesMask() | cell.getSiblings().get(e.detail) 
									? 1<<e.detail.getValue() 
									: cell.getAllowedValuesMask()
		)
	})
	}
	
	fill(f, size){
		return (new Array(size)).fill(null).reduce(z=>f(z), new Array());
	}
	
	fillMatrix(size){
		return this.fill(x=>x.concat([this.fill(x=>x.concat(new Cell()),size)]),size);
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
	forEach(f){
		this.matrix.forEach(e=>e.forEach(e=>f(e)));
	}
	get(loc){
		return this.matrix[loc.row][loc.col];
	}
	toString(){
		return this.reduceX(x=>x.getValue()||'.', '');
	}
}
