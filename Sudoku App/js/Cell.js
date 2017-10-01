
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
	
	isGiven(){
		return this.given;
	}	
	
	isNotAssigned () {
		return !this.value;
	}
	
	getSingle(){
		return this.mask.getSingle();
	}
	
	isNotAllowed(n){
		this.mask.isNotAllowed();
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
			locs.forEach(e => $(this).on(e.toString(), (e, sib, param) => {
				param ? e.target.updateMaskNot( 1 << sib.getValue())
					  : e.target.updateMask( 1 << sib.getValue(), sib.isGiven());
			}))
	}
	
	setLoc(loc){
		this.loc=loc;
	}
	
	setAnswer(n){
		this.answer = n
	}
		
	setValue(n, loc){
		if(n != 0 && this.isNotAllowed(n))
			throw "not allowed";
		if(n)
			this.value=n,
			this.updateSiblings(loc)
		else
			this.updateSiblings(loc,true)
		this.value=n;
	}
	
	setGiven(n/*, loc*/){
		this.value = n;
		this.given = Boolean(n);
	}
		
	setMask(n){
		if(n && !this.given) this.mask = 1 << n;
	}
	
	// CELL METHODS
	clone(){
		let clone = new Cell(this.value);
		this.mask = this.mask;
		this.answer = this.answer;
		this.given = this.given;
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
		this.mask.updateMaskNot(n);
	}
	
	// SIBS METHODS
	
	updateSiblings(type=false){
		if(this)
			window.game.update(this,type);
	}
	
	update(target,type){
		$(this).trigger(this.loc.toString(),[target,type])
	}
	
}