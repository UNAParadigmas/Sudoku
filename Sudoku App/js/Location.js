class Location{
	constructor(row, col){
		this.row=row;
		this.col=col;
	}
	isEmpty(){
		return this.row<0;
	}
	modulo(n){
		return n<0?n+9:n%9;
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
	toString(){
		return "Row=" + String(this.row) + "Col=" + String(this.col);
	}
	getSquare() {
		return 3 * Math.floor(this.row / 3) + Math.floor(this.col / 3);
	}

	equals(a) {
		return a.row == this.row && a.col == this.col;
	}

	notEquals(a) {
		return a.row != this.row || a.col != this.col;
	}
	// Enumerator for locations of all cells
	getGrid() {
		return (new Array(81)).fill(0).reduce((z,e,i)=>z.concat(new Location(i%9,Math.floor(i/9))),new Array());
	}
	// Enumerator for locations of cell siblings in the same row
	rowSibs() {
		let locs = new Array();
		for (let i = 0; i < 9; i++)
			if (i != this.col)
				locs.push(new Location(this.row, i));
		return locs;
	}
	// Enumerator for locations of cell siblings in the same column
	colSibs() {
		let locs = new Array();
		for (let i = 0; i < 9; i++)
			if (i != this.row)
				locs.push(new Location(i, this.col));
		return locs;
	}
	// Enumerator for locations of cell siblings in the same square
	squareSibs() {
		let locs = new Array();
		let baseRow = 3 * Math.floor(this.row / 3); // this is how to convert float to an "int" - Javascript doesn't have ints!
		let baseCol = 3 * Math.floor(this.col / 3);
		for (let i = 0; i < 3; i++) {
			let r = baseRow + i;
			for (let j = 0; j < 3; j++) {
				let c = baseCol + j;
				if (r != this.row || c != this.col)
					locs.push(new Location(r, c));
			}
		}
		return locs;
	}
	squareSibs2() {
		let locs = new Array();
		let baseRow = 3 * Math.floor(this.row / 3); // this is how to convert float to an "int" - Javascript doesn't have ints!
		let baseCol = 3 * Math.floor(this.col / 3);
		for (let i = 0; i < 3; i++) {
			let r = baseRow + i;
			for (let j = 0; j < 3; j++) {
				let c = baseCol + j;
				if (r != this.row && c != this.col)
					locs.push(new Location(r, c));
			}
		}
		return locs;
	}
	getAllSibs(){
		return this.rowSibs().concat(this.colSibs().concat(this.squareSibs2()));
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
	build(i){
		return new Location(Math.floor(i/9),i%9);
	}
}
