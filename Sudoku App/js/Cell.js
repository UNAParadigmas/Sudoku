class Cell{
	constructor(value){
		this.value=value;//sin asignar
		this.allowed=0x3e;//bitmask que tiene como 1 los lugares de las potencias del 2 que concuerdan con 1<<n
		this.answer=0;//sin respuesta
		this.given=false;//por el usuario
		this.siblings = new Map();
	}
	setSiblings(locs, grid){
		this.siblings = locs.reduce((z,e)=>z.set(grid.get(e), true), new Map())
	}
	clone(){
		let clone = new Cell();
		clone.value=this.value;
		clone.mask=this.mask;
		clone.answer=this.answer;
		clone.given=this.given;
		return clone;
	}
	getValueMask(){
		return this.value?1<<this.value:0;
	}
	getValue(){
		return this.value;
	}
	
	getSiblings(){
		return this.siblings;
	}
	
	setAnswer(n){
		if(n<0||n>9) throw "Illegal value not in the range 1..9.";  else this.answer=n;
	}
	setAllowedValues(values){
		this.mask=values;
	}
	isAllowed(n){
		return n > 0 && n < 10 && (~this.mask & (1 << n)) != 0;
	}
	setValue(n){
		if(n<0||n>9)
			throw "Illegal value not in the range 1..9.";
		if(n != 0 && !this.isAllowed(n))
			throw "not allowed";
		this.value=n;
		this.given=false;
		document.dispatchEvent(new CustomEvent('updateCell', {detail:this}));
	}
	setGiven(n){
		if (n <0||n>9)
			throw "Illegal value not in the range 1..9.";
		this.value = n;
		this.given = n != 0;
		this.setMask(n);
		document.dispatchEvent(new CustomEvent('updateCell', {detail:this}));
	}
	isGiven(){
		return this.given;
	}
	clear(){
		this.value = 0; // means unassigned
		this.allowed = new AllowedValues(0x3E); // all possible
		this.answer = 0;
		this.given = 0;
		return this;
	}
	getMaskValue(){
		let single = 0;
		for (let i = 1; i <= 9; i++)
			if ((this._mask & (1 << i)) != 0) {
				if(single)
					return 0
				single = i;
			}
		return single;
	}
	setMask(n){
		this.mask=1<<n;
	}
	setAllowed(n){
		this.mask=n;
	}
	count(){
		return (new Array(9)).fill(0).reduce(z=>this.mask & 1 << z[0] != 0?[z[0]++,z[1]++]
																		  :[z[0]++,z[1]],[1,0])[1];
	}
	removeValuesMask(msk){
		this.mask &= ~msk;
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
	};
	getAllowedValuesMask(){
		return this.mask;
	}
}