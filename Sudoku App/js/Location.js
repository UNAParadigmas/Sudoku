class Location{
	
	constructor(row, col){
		this.row = row;
		this.col = col;
		this.or =  (_col, _row) => (this.col != _col || this.row != _row);
		this.and = (_col, _row) => (this.col != _col && this.row != _row);	
	}
	toString1(){
		return [this.row, this.col].toString();
	}
	
	// boolean methods
	
	/*isEmpty(){
		return this.row < 0;
	}*/
	
	equals(a) {
		return a.row == this.row && a.col == this.col;
	}
	/*
	notEquals(a) {
		return !this.equals(a);
	}
	*/
	// get methods
	
	getAllSibs(){
		return this.rowSibs().concat(this.colSibs().concat(this.squareSibs(this.and)));
	}
	
	getSquare() {
		return 3 * Math.floor(this.row / 3) + Math.floor(this.col / 3);
	}
	
	getSibs(type) {
		switch (type) {
			case 0:
				return this.colSibs();
			case 1:
				return this.rowSibs();
			case 2:
				return this.squareSibs(this.or);
		}
	}
	
	// location methods
	
	rowSibs() {
		return Array.from({length:9}).reduce((z,e,i) => i != this.col ? z.concat(new Location(this.row, i)) : z, []);
	}
	
	colSibs() {
		return Array.from({length:9}).reduce((z,e,i) => i != this.row ? z.concat(new Location(i, this.col)) : z, []);
	}
	
	squareSibs(f) {		
		let baseCol = 3 * Math.floor(this.col / 3)
		let baseRow = 3 * Math.floor(this.row / 3);
				
		let filter =  (z, _row, _col) => f(_col,_row)? z.concat(new Location(_row, _col)) : z
		
		let foo = (z, e, i) => filter(z, baseRow + Math.floor(i/3), baseCol + i%3)		
		
		return Array.from({length:9}).reduce(foo, []);
	}
		
	toString(){
		return "Row=" + String(this.row) + "Col=" + String(this.col);
	}
}
