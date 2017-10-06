class Board{
	
	constructor(size) {
		this.size=size;
		this.digits = new Grid(size);
		this.locs = this.createLocs();
		this.isSolved = this.isValid = false;
		this.answer = [];
		this.singles = []
	}
	
	createLocs() {		
		let _locs = Array.from({length:81},(e,i) => new Location(i % 9, Math.floor(i / 9)));
		_locs.forEach(loc => (this.digits.get(loc).setLoc(loc).setSiblings(loc.getAllSibs(), this.digits)));
		return _locs;
	}
	
	updateDigits(target,type){
		target.loc.getAllSibs().forEach(e=>this.digits.get(e).update(target,type))
	}
	
	// GET METHODS
	
	getCell(loc) {
		return this.digits.get(loc);
	}
	
	getMask(loc){
		return this.getCell(loc).getMask();
	}
	
	getAnswer(){
		// cols = 0;
		// rows = 1;
		// squares = 2;
		return this.locs.reduce((z,e)=>(z[0][e.col] |= this.getMask(e),
								   z[1][e.row] |= this.getMask(e),
								   z[2][e.getSquare()] |= this.getMask(e),z), Array.from({length: 3}, e => new Array(9)));
	}
	
	getString (){//gets the current state of the matrix in a format that this application understands
		return this.digits.toString();
	}
	
	// SET METHODS
	
	setCell(loc, value) {
		this.getCell(loc) = value;
	}
	
	setString (value, init) { 
		let loc = i => new Location(Math.floor(i/9),i%9);
		let check =(val) => isNaN(val)? 0 : parseInt(val);
		
		let changes = Array.from(value).reduce((z, val, i) => this.getCell(loc(i)).setGiven(check(val), loc(i))?z.concat(loc(i)):z,[])//no modifica a l
		if(init) changes.forEach(e=>this.digits.get(e).updateSiblings())
		
		this.answer = this.getAnswer();
		console.log(this.digits.matrix);
	}
	
	// ANSWER METHODS
	acceptPossibles(){
		console.log(this.singles);
		const acceptAnswer = (cell) =>	cell.setValue(cell.getAnswer());
		this.singles.forEach(loc => acceptAnswer(this.getCell(loc)));
	}
	
	trySolve(){		
		
		this.singles = [];
		if(this.analyzeGrid()){
			this.acceptPossibles();
			this.trySolve();
		}
		return this.isSolved;	
	}
	
	analyzeGrid(){
		
		this.isSolved = this.locs.reduce((z, loc) => (this.chechForSingleAnswer(loc, 0) || this.chechForSingleAnswer(loc, 1) || this.chechForSingleAnswer(loc, 2))&&z,true);
		if(!this.isSolved && !this.singles.length) return false; // falta pairs
		return true;
	}
	
	getAnswerLocation(loc, type){
		return this.answer[type][loc.col]|this.answer[type][loc.row]|this.answer[type][loc.getSquare()];
	}
	
	chechForSingleAnswer(_loc, type){
		//const checkCell = (_cell) => (_cell.isNotAssigned()&&!_cell.isGiven())? clone.mask.removeValuesMask(_cell.getMask()) : 0;
		//const checkCell = (val) => (clone.isNotAssigned()&&!clone.isGiven())?  : 0;
		
		let cell = this.getCell(_loc);
		if(cell.isGiven() || cell.hasAnswer()) return true; 
		
		let clone = cell.clone();
		
		//let locs = _loc.getSibs(type);
		let contains = this.getAnswerLocation(clone.loc,type);
		if(clone.isNotAssigned()&&!clone.isGiven())
			clone.mask.removeValuesMask(contains);
		let single = clone.getSingle();
		
		if(!!(single)){
			//console.log(single+' posicion '+_loc.row+','+_loc.col);
			cell.setAnswer(single);
			console.log(cell);
			this.singles.push(_loc);
			return true;
		}
		return false;
	}
	
	
	// GAME METHODS
	copyTo(target) {
		target.isSolved = this.isSolved;
		target.isValid = this.isValid;
		target.digits=this.digits.clone();
	}
	
	clear() {
		this.digits = this.digits.map(x=>x.clear());
	}
	
	reset() { // falta el metodo reset
		this.digits = digits.map(x=>x.isGiven()?x:x.clear());
	}
	
	checkIsValidSibs (digit, locs) {
		return checkGeneral(x=>this.getCell(x).getAnswer()==digit, locs) != 0;
	}
	
	checkGeneral(f, locs){
		return locs.reduce((z,elem)=>f(elem)?z+1:z);
	}
	/*
	checkIsValid (loc, digit) {
		// Checks if the digit can go in that location by checking it doesn't
		// exist in either the row, col or square siblings
		if (this.checkIsValidSibs(digit, loc.colSibs()))
			return false;
		if (this.checkIsValidSibs(digit, loc.rowSibs()))
			return false;
		if (this.checkIsValidSibs(digit, loc.squareSibs()))
			return false;
		return true;
	}
	
	findCellWithFewestChoices() {
		return this.locs.reduce((z,e)=>this.getCell(e).isAssigned()?z:[z[0]=Math.min(z[0],this.getCell(e).count()),z[1]=e],[9,new Location(-1,-1)])[1];
	};
	
	trySolve(loc, value) {// empty Location allowed
		if (!loc.isEmpty())// assign a value to a location if provided
		{
			var cell = this.getCell(loc);
			if (!cell.isAllowed(value))
				throw "Internal error.";
			cell.setValue(value,loc);
		}

		do {
			//this.updateAllowed();
			if (!this.isValid)
				return false;
		} while (this.acceptPossibles()); // keep doing deterministic answers

		if (this._isSolved)
			return true;

		if (!this._isValid)
			return false;

		// No deterministic solutions, find cell with the fewest choices and try each one in turn
		// until success. 
		var locChoice = this.findCellWithFewestChoices();
		if (locChoice.isEmpty())
			return false;

		var cell = this.getCell(locChoice);
		let boardC = this.clone();
		return cell.allowedValuesArray()
			   .reduce((z,e)=>z?z:boardC.trySolve(locChoice,e)
							   ?(boardC.copyTo(this),true):z,false)

	}*/
	
}

