
	constructor(n = 0){
		this.mask = n;
		this.trueMask = n;
	}
	
	// BOOLEAN METHODS
	
	isAllowed(n){
		return Boolean(~this.mask & (1 << n));
	}
	
	isNotAllowed(n){
		return !Boolean(~this.mask & (1 << n));
	}
	
	// BITMASK METHODS
	
	or(n){
		mask |= n;
	}
	
	and(n){
		mask &= n;
	}
	
	updateMaskNot(n){
		this.mask = Math.max(~((~this.mask)|n),this.trueMask)
	}

	removeValuesMask(n){
		this.mask |= 1 << n;
	}
	
	// VALUES METHODS
	
	count(){
		return Array.from({length: 9}).reduce((z,e,i) => (~this.mask & (1 << i + 1))? z + 1: z, 0);
	}	
	
	getSingle(){
		let loop 		= (s, i) => (i > 9)? s : checkMask(s, i);		
		let checkMask 	= (s, i) => (this.mask & (1 << i) != 0)? checkSingle(s, i): loop(s, i+1);
		let checkSingle = (s, i) => (s) ? 0 : loop(i, i+1);
		
		return loop(0,1);
	}

	setSingle(n){
		this.mask = 1 << n;
	}
	
	allowedValuesArray(){
		return Array.from({length:9}).reduce((z,e,i) => ((1 << i+1) & ~this.mask)? z.concat(i+1) : z, [])
	}
	
	removeValues(bm) {
		this.mask &= ~bm.mask;
	};
	
	
}