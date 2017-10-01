
class BitSet {
	constructor(n = 0){
		this.mask = 1 << n;
		this.count = this.doCount();
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
		this.mask |= n;
		this.count = this.doCount();
	}
		
	updateMaskNot(n){
		this.mask = Math.max(~((~this.mask)|n),this.trueMask);
		this.count = this.doCount();
	}

	removeValue(n){
		this.mask |= 1 << n;
		this.count = this.doCount();
	}
	
	// VALUES METHODS
	
	doCount(){
		return Array.from({length: 9}).reduce((z,e,i) => (~this.mask & (1 << i + 1))? z + 1: z, 0);
	}	
	
	getSingle(){
		let loop 		= (s, i) => (i > 9)? s : checkMask(s, i);		
		let checkMask 	= (s, i) => (~this.mask & (1 << i))? checkSingle(s, i): loop(s, i+1);
		let checkSingle = (s, i) => (s) ? 0 : loop(i, i+1);
		
		return loop(0,1);
	}
	
	setMask(n){
		this.mask = 1 << n;
	}
	
	valuesArray(){
		return Array.from({length:9}).reduce((z,e,i) => ((1 << i+1) & ~this.mask)? z.concat(i+1) : z, [])
	}
	
	removeValues(bm) {
		this.mask |= bm.mask;
		this.count = this.doCount();
	}	
	
}