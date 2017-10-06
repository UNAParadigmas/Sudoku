
class Cell{
	
	constructor(value = 0){
		this.value = value;
		this.mask = new BitSet(0);
		this.trueMask = new BitSet(0);
		this.answer = 0;
		this.given = false;
		this.loc=new Location(-1,-1);
	}
	
	// BOOLEAN METHODS
	
	isGiven(){//returns the given state of this particular cell, it is true if it was a number that was set by the program (hints).
		return this.given;
	}	
	
	isNotAssigned () {//returns true if value is not 0.
		return !this.value;
	}
	
	getSingle(){//returns the value of the single possible value given a not assigned cell, returns 0 if there is no single.
		return this.mask.getSingle();
	}
	
	isNotAllowed(n){//returns true if a given number is not allowed in this particular cell, cheking if the BitSet(mask) contains the given number.
		return this.mask.isNotAllowed(n);
	}
	
	// GET METHODS
	
	getValue(){
		return this.value;
	}
	
	getSiblings(){
		return this.siblings;
	}
	
	getAnswer(){
		return this.answer;
	}
	
	
	hasAnswer() {
		return this.answer != 0;
	}
	getMask(){
		return this.mask;
	}
	
	// SET METHODS
	
	setSiblings(locs, grid){
		if(!this.given)
			locs.forEach(loc => $(this).on(loc.toString1(), (e, sib, param) => {
				param ? e.target.updateMaskNot( 1 << sib.getValue())
					  : e.target.updateMask( 1 << sib.getValue(), sib.isGiven());
			}))
	}
	
	setLoc(loc){
		this.loc=loc;
		return this;
	}
	
	setAnswer(n){
		this.answer = n
	}
		
	setValue(n, loc){
		if(n != 0 && this.isNotAllowed(n))
			throw "not allowed";
		if(n){
			this.value=n
			this.updateSiblings()
		}
		else
			this.updateSiblings(true)
		this.value=n;
	}
	
	setGiven(n/*, loc*/){
		this.value = n;
		this.given = !!n;
		if(n)
			return true;
		return false;
	}
		
	setMask(n){
		if(n && !this.given) this.mask = 1 << n;
	}
	
	// CELL METHODS
	clone(){
		let clone = new Cell(this.value);
		clone.mask = this.mask;
		clone.answer = this.answer;
		clone.given = this.given;
		clone.loc = this.loc;
		return clone
	}
	
	clear(){
		this.value = 0; 
		this.mask = 0; 
		this.answer = 0;
		this.given = 0;
	}
	
	reset(){
		
	}
	
	
	updateMask(n, given){
		if(!this.given){
			this.mask.or(n)
			if(given)
				this.trueMask.or(n);
			}
		return this;
	}
	updateMaskNot(n){
		this.mask.updateMaskNot(n,this.trueMask);
	}
	
	// SIBS METHODS
	
	updateSiblings(type=false){
		if(this)
			window.game.update(this,type);
	}
	
	update(target,type){
		$(this).trigger(target.loc.toString1(),[target,type]);
	}
	
	
}