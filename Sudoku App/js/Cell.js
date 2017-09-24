class Cell{
	constructor(value=0){
		this.value=value;//sin asignar
		this.mask=0;//bitmask que tiene como 1 los lugares de las potencias del 2 que concuerdan con 1<<n
		this.trueMask=0;
		this.answer=0;//sin respuesta
		this.given=false;//por el usuario
	}
	setSiblings(locs, grid){
		locs.forEach(e=>$(this).on([e.row,e.col].toString(), (e,sib,param)=>{
			param?e.target.updateMaskNot(1<<sib.getValue())
				 :e.target.updateMask(1<<sib.getValue(),sib.isGiven());
		}))
	}
	clone(){
		let clone = new Cell();
		clone.value=this.value;
		clone.mask=this.mask;
		clone.answer=this.answer;
		clone.given=this.given;
		return clone;
	}
	getValue(){
		return this.value;
	}
	updateSiblings(loc,type=false){
		if(this)
			window.game.update(this,loc,type);
	}
	
	update(target,loc,type){
		$(this).trigger([loc.row,loc.col].toString(),[target,type])
	}
	
	getSiblings(){
		return this.siblings;
	}
	
	setAnswer(n){
		if(n<0||n>9) throw "Illegal value not in the range 1..9.";  else this.answer=n
		return n?true:false;
	}
	
	isAllowed(n){
		var a = n > 0 && n < 10 && (~this.mask & (1 << n)) != 0;
		return a
	}
	
	setValue(n, loc){
		if(n<0||n>9)
			throw "Illegal value not in the range 1..9.";
		if(n != 0 && !this.isAllowed(n))
			throw "not allowed";
		if(n)
			this.value=n,
			this.updateSiblings(loc)
		else
			this.updateSiblings(loc,true)
		this.value=n;
	}
	
	setGiven(n, loc){
		this.value = n;
		this.given = n != 0;
	}
	
	isGiven(){
		return this.given;
	}
	
	clear(){
		this.value = 0; // means unassigned
		this.mask = 0; // all possible
		this.answer = 0;
		this.given = 0;
		return this;
	}
	
	getMaskValue(){
		let single = 0;
		for (let i = 1; i <= 9; i++)
			if ((this.mask & (1 << i)) != 0) {
				if(single)
					return 0
				single = i;
			}
		return single;
	}
	
	setMask(n){
		if(n&&!this.given)
			this.mask=1<<n;
	}
	
	updateMask(n,given){
		if(!this.given){
			this.mask|=n
			if(given)
				this.trueMask|=n;
			}
		return this;
	}
	updateMaskNot(n){
		this.mask=Math.max(~((~this.mask)|n),this.trueMask)
	}

	count(){
		return (new Array(9)).fill(0).reduce(z=>(~this.mask) & 1 << z[0] != 0
															 ? [z[0]++,z[1]++]
															 : [z[0]++,z[1]],[1,0])[1];
	}
	removeValuesMask(n){
		if(!this.given)
			this.mask |= 1<<n;
		return this;
	}
	allowedValuesArray(){
		var ret = new Array();
		for (var i = 1; i <= 9; i++)
			if (((1 << i) & this._mask) != 0)
				ret.push(i);
		return ret;
	}
	isNotAssigned () {
		return this.value == 0;
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
}