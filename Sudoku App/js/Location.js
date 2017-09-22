class Location{
	
	constructor(row, col){
		this.row = row;
		this.col = col;
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
	
	getGrid() {
		//return (new Array(81)).fill(0).reduce((z,e,i)=>z.concat(new Location(i%9,Math.floor(i/9))),new Array());
		return Array.from({length:81}, _ => 0).reduce((z,e,i) => z.concat(new Location(i % 9, Math.floor(i / 9))), new Array());
	}
	
	
	getAllSibs(){
		return this.rowSibs().concat(this.colSibs().concat(this.squareSib()));
	}
	
	getSibs(type) {
		switch (type) {
			case 0:
				return this.colSibs();
			case 1:
				return this.rowSibs();
			case 2:
				return this.squareSibs();
		}
	}
	
	// location methods
	
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
		return Array.from({length:9}, _ => 0).reduce((z,e,i) => if(i != this.col) z.concat(new Location(this.row, i)), new Array());
	}
	
	colSibs() {
		return Array.from({length:9}, _ => 0).reduce((z,e,i) => if(i != this.row) z.concat(new Location(i, this.col)), new Array());
	}
	
	squareSibs() {
		let f = (_z,_e,_i) => 
		{
			let _row = 3 * Math.floor(this.row / 3) + _i;  
			return _z.concat(_e.reduce((z,e,i) => 
				{
					let _col = 3 * Math.floor(this.col / 3) + i;
					if(this.col != _col || this.row != _row) {
						z.concat(new Location(_row, _col));
					}	
				}, new Array()))
				
		}
		return Array.from({length:3}, _ => new Array(3)).reduce(f, new Array());
	}
	
	toString(){
		return "Row=" + String(this.row) + "Col=" + String(this.col);
	}
}
