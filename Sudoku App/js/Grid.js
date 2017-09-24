
class Grid{
	constructor(size){
		this.matrix = this.fillMatrix(size);
	}
	
	fill(f, size){
		return (new Array(size)).fill(null).reduce(z=>f(z), new Array());
	}
	
	fillMatrix(size){
		return this.fill(x=>x.concat([this.fill(x=>x.concat(new Cell(0)),size)]),size);
	}
	
	map(f){
		return this.matrix.map(elem => elem.map(f));
	}
	forEach(f){
		this.matrix.forEach(e => e.forEach(f));
	}
	get(loc){
		return this.matrix[loc.row][loc.col];
	}
	toString(){
		return this.map(e=>e.getValue()).toString()
										.replace(/,/g,'')
										.replace(/0/g,'.');
	}
	updateListeners(locs){
		const filter=(cell, loc)=>cell.getValue()?cell.updateSiblings(loc):undefined;
		locs.forEach(e=>filter(this.get(e),e));
	}
	update(target,loc,type){
		this.forEach(x=>x.update(target,loc,type));
	}
}
