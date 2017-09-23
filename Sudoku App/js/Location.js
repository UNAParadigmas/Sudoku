class Location{
	
	constructor(row, col){
		this.row = row
		this.col = col		
		this.or =  (_col, _row) => (this.col != _col || this.row != _row)
		this.and = (_col, _row) => (this.col != _col && this.row != _row)	
	}
	
	// boolean methods
	
	isEmpty(){
		return this.row < 0;
	}
	
	equals(a) {
		return a.row == this.row && a.col == this.col;
	}

	notEquals(a) {
		return !this.equals(a);
	}
	
	// get methods
	
	modulo(n){
		return n < 0 ? n + 9 : n % 9;
	}
	
	getSquare() {
		return 3 * Math.floor(this.row / 3) + Math.floor(this.col / 3);
	}
	/*
	getGrid() {
		return Array.from({length:81}).reduce((z,e,i) => z.concat(new Location(i % 9, Math.floor(i / 9))), []);
	}*/
	
	
	getAllSibs(){
		return this.rowSibs().concat(this.colSibs().concat(this.squareSib(this.and)));
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
	
	modulo(n){
		return n < 0 ? n + 9 : n % 9;
	}
	
	left(){
		return new Location(this.row, this.modulo(this.col -1));
	}
	
	right(){
		return new Location(this.row, this.modulo(this.col +1));
	}
	
	up(){
		return new Location(this.modulo(this.row -1), this.col);
	}
	
	down(){
		return new Location(this.modulo(this.row +1), this.col);
	}
	
	rowSibs() {
		return Array.from({length:9}).reduce((z,e,i) => i != this.col ? z.concat(new Location(this.row, i)) : z, []);
	}
	
	colSibs() {
		return Array.from({length:9}).reduce((z,e,i) => i != this.row ? z.concat(new Location(i, this.col)) : z, []);
	}
	
	squareSibs(f) {		
		let baseCol = 3 * Math.floor(this.col / 3)
		let baseRow = 3 * Math.floor(this.row / 3);
				
		let filter =  (z, _row, _col) => f(_row,_col)? z.concat(new Location(_row, _col)) : z
		
		let f = (_z,_e,_i) => _z.concat(filter(z, baseCol + Math.floor(i/3), baseCol + i%3))		
		
		return Array.from({length:9}).reduce(f, []);
	}
	
	toString(){
		return "Row=" + String(this.row) + "Col=" + String(this.col);
	}
}
