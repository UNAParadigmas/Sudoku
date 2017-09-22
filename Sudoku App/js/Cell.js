class Cell{
	constructor(value = 0){
		this.value = value;
		this.mask = 0;
		this.answer = 0;
		this.given = false;
		this.siblings = new Map();
	}
		
	getValue(){
		return this.value;
	}
	
	getAnswer(){
		return this.answer;
	}
	
	getSiblings(){
		return this.siblings;
	}
	
	getMaskValue(){
		for (let i = 1; i <= 9; i++)
			if ((this.mask & (1 << i)) != 0) {
				if(single)
					return 0
				single = i;
			}
		return single;
	}
	
	getMask(){
		return this.mask;
	}
	
	getValueMask(){
		return this.value ? 1 << this.value : 0;
	}
	
	
	setSiblings(locs, grid){
		this.siblings = locs.reduce((z,e)=>z.set(grid.get(e), true), new Map())
	}
	
	
	setAnswer(n){
		if(n<0||n>9) throw "Illegal value not in the range 1..9.";  else this.answer=n
		return n?true:false;
	}
	isAllowed(n){
		var a = n > 0 && n < 10 && (this.mask & (1 << n)) != 0;
		return a
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
		this.value = n;
		this.given = n != 0;
		this.setMask(n);
	}
	isGiven(){
		return this.given;
	}
	clear(){
		this.value = 0;
		this.mask = 0;
		this.answer = 0;
		this.given = 0;
		//sibings
		return this;
	}
	
	setMask(n){
		if(n)
		this.mask=1<<n;
	}
	
	count(){
		return (new Array(9)).fill(0).reduce((z,e,i) => (~this.mask & (1 << i))? z + 1: z, 0);
	}

	removeValuesMask(n){
		this.mask |= 1<<n;
		return this;
	}
	
	allowedValuesArray(){
		/*var ret = new Array();
		for (var i = 1; i <= 9; i++)
			if (((1 << i) & this._mask) != 0)
				ret.push(i);
		return ret;*/
		let f = (i, vec) => { 
			if(i <= 9){ 
				return vec
			}else{
				if((1 << i) & this._mask){
					vec.push(i)
				}
				return f(i + 1, vec)
			}
		}
		return f(1, new Array());
	}
	
	isNotAssigned () {
		return this.value == 0;
	}
	
	hasAnswer() {
		return this.answer != 0;
	}
}