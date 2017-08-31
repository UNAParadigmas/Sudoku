const {Grid} = require('./Grid')
class Board{
	constructor(size) {
		this.size=size;
		this.digits = new Grid(size);
		this.isSolved = false;
		this.isValid = false;
	}
	clone() {
		var clone = new Board();
		clone.isSolved = this.isSolved;
		clone.isValid = this.isValid;
		clone.digits = this.digits.clone();
		return clone;
	}
	copyTo(target) {
		target.isSolved = this.isSolved;
		target.isValid = this.isValid;
		target.digits=this.digits.clone();
	}
	getCell(loc) {
		return this.digits.get(loc);
	}
	setCell(loc, value) {
		this.digits.get(loc) = value;
	}
	clear() {
		this.digits = this.digits.map(x=>x.clear());
		this.updateAllowed();
	}
	reset() {// return Baord to only the givens
		this.digits = digits.map(x=>x.isGiven()?x:x.clear());
		this.updateAllowed();
	}
	checkIsValidSibs (digit, locs) {
		return checkGeneral(x=>this.digits.get(x).getAnswer()==digit, locs) != 0;
	}
	checkGeneral(f, locs){
		return locs.reduce((z,elem)=>f(elem)?z+1:z);
	}
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
	acceptPossibles(locs) {
		return checkGeneral(x=>this.digits.get(x).isAssigned() &&
								this.digits.get(x).hasAnswer() &&
								this.checkIsValid(x, this.digits.get(x).getAnswer()), locs) != 0;
	}
	Board.prototype.checkForHiddenSingles = function (loc, st) {
		// Check each cell - if not assigned and has no answer then check its siblings
		// get all its allowed then remove all the allowed
		var cell = this.getCell(loc);
		if (!cell.isAssigned() && !cell.hasAnswer()) {
			var allowed = cell.getAllowedClone(); // copy of bit mask of allowed values for this cell
			var locs = loc.getSibs(st);
			for (var i = 0; i < locs.length; i++) {
				var sib = locs[i];
				var sibCell = this.getCell(sib);
				if (!sibCell.isAssigned())
					allowed.removeValues(sibCell.getAllowedClone()); // remove allowed values from siblings
			}
			var answer = allowed.getSingle(); // if there is only one allowed value left (i.e. this cell is the only one amonsgt its sibs with this allowed value)
			// then apply it as the answer. Note getSingle will return 0 (i.e. no anser) if the number of allowed values is not exactly one
			if (answer != 0) {
				cell.setAnswer(answer);
				return true; // no need to check others sibling collections
			}
		}
		return false;
	};
}
