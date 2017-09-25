
class Cell{
	
	constructor(value = 0){
		this.value = value;
		this.mask  = this.trueMask = this.answer = 0;
		this.given = false;
	}
	
	// BOOLEAN METHODS
	
	isAllowed(n){
		return (this.mask & (1 << n)) == 0;
	}
	
	isNotAllowed(n){
		return (this.mask & (1 << n)) != 0;
	}
	
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
	
	getMaskValue(){		
		let loop 		= (s, i) => (i > 9)? s : checkMask(s, i);		
		let checkMask 	= (s, i) => (this.mask & (1 << i) != 0)? checkSingle(s, i): loop(s, i+1);
		let checkSingle = (s, i) => (s) ? 0 : loop(i, i+1);
		
		return loop(0,1);
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
		this.given = n != 0;
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
	
	// MASK METHODS
	
	count(){
		return Array.from({length: 9}).reduce((z,e,i) => (~this.mask & (1 << i + 1))? z + 1: z, 0);
	}
		
	updateMask(n, given){
		if(!this.given){
			this.mask |= n
			if(given)
				this.trueMask|=n;
			}
		return this;
	}

	updateMaskNot(n){
		this.mask = Math.max(~((~this.mask)|n),this.trueMask)
	}

	removeValuesMask(n){
		if(!this.given)
			this.mask |= 1 << n;
		return this;
	}
	allowedValuesArray(){
		return Array.from({length:9}).reduce((z,e,i) => ((1 << i+1) & this._mask)? z.concat(i+1) : z, [])
	}
	removeValues = function (mask) {
		this.mask &= ~mask;
	};

	
	// SIBS METHODS
	
	updateSiblings(loc,type=false){
		if(this)
			window.game.update(this,loc,type);
	}
	
	update(target,loc,type){
		$(this).trigger([loc.row,loc.col].toString(),[target,type])
	}
	
}