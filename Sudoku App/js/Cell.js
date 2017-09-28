
class Cell{
	
	constructor(value = 0){
		this.value = value;
		this.mask = new BitMask(0);
		this.answer = 0;
		this.given = false;
	}
	
	// BOOLEAN METHODS
	
	isGiven(){
		return this.given;
	}	
	
	isNotAssigned () {
		return this.value == 0;
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
		locs.forEach(e => $(this).on([e.row, e.col].toString(), (e, sib, param) => {
			param ? e.target.updateMaskNot( 1 << sib.getValue())
				  : e.target.updateMask( 1 << sib.getValue(), sib.isGiven());
		}))
	}
	
	setAnswer(n){
		this.answer=n
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
	
	// SIBS METHODS
	
	updateSiblings(loc,type=false){
		if(this)
			window.game.update(this,loc,type);
	}
	
	update(target,loc,type){
		$(this).trigger([loc.row,loc.col].toString(),[target,type])
	}
	
}