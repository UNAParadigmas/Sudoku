class Board{
	
	constructor(size) {
		this.size=size;
		this.digits = new Grid(size);
		this.locs = this.createLocs();
		this.isSolved = this.isValid = false;
		this.singles = []
	}
	
	createLocs() {		
		let _locs = Array.from({length:81},(e,i) => new Location(i % 9, Math.floor(i / 9)));
		_locs.forEach(loc => (this.digits.get(loc).setLoc(loc),
							  this.digits.get(loc).setSiblings(loc.getAllSibs(), this.digits)));
		return _locs;
	}
	
	updateDigits(target,type){
		this.digits.update(target,type);
	}
	
	// GET METHODS
	
	getCell(loc) {
		return this.digits.get(loc);
	}
	
	getMask(loc){
		return this.getCell(loc).getMask();
	}
	
	getAnswer(locs){
		// cols = 0;
		// rows = 1;
		// squares = 2;
		return locs.reduce((z,e)=>(z[0][e.col] |= this.getMask(e),
								   z[1][e.row] |= this.getMask(e),
								   z[2][e.getSquare()] |= this.getMask(e),z), Array.from({length: 3}, e => new Array(9)));
	}
	
	getString (){
		return this.digits.toString();
	}
	
	// SET METHODS
	
	setCell(loc, value) {
		this.getCell(loc) = value;
	}
	
	setString (value, init) { 
		let loc = i => new Location(Math.floor(i/9),i%9);
		let check =(val) => isNaN(val)? 0 : parseInt(val);
		
		Array.from(value).forEach((val, i) => this.getCell(loc(i)).setGiven(check(val), loc(i)))//no modifica a l
		if(init) this.digits.updateListeners(this.locs);
		
		//this.answer = this.getAnswer(this.locs);
		console.log(this.digits.matrix);
	}
	
	// ANSWER METHODS
	analyzeGrid(){
		let finished = this.locs.reduce((z, loc) => z && chechForSingleAnswer(loc), 3);
		if(finished) return true;
		if(!finished && !this.singles.length) return false; // falta pairs
	}
	
	chechForSingleAnswer(_loc, type){
		const checkCell = (_cell) => (_cell.isNotAssigned())? clone.removeValues(_cel.getMask()):0;
		
		let cell = this.getCell(_loc);
		if(cell.isGiven() || cell.hasAnswer()) return true; 
		let clone = cell.clone();
		
		if(cell.isNotAssigned()){
			let locs = _loc.getSibs(type);
			locs.forEach( loc => checkCell(this.getCell(loc)));
		}
		
		let single = clone.getSingle();
		
		if(!!single){
			cell.setAnswer(single);
			this.singles.push(_loc);
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

