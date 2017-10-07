
class BitSet {
	constructor(n = 0){
		this.mask = 1 << n;
		this.count = this.doCount();
		this.backup = {};
	}
	
	// BOOLEAN METHODS
	
	isAllowed(n){
		return !!(~this.mask & (1 << n));
	}
	
	isNotAllowed(n){
		return !!(this.mask & (1 << n));
	}
	
	// BITMASK METHODS
	
	or(n){
		if(this.backup[n])
			this.backup[n]++;
		else
			this.backup[n]=1;
		this.mask |= n;
		this.count = this.doCount();
	}
		
	updateMaskNot(n,trueMask){
		if(!(trueMask.mask & n)){
			if(this.backup[n]==1){
				this.backup[n]--;
				this.mask = (~((~this.mask)|n))
			}
			else
				this.backup[n]--;
		}
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
		this.count = this.doCount();
	}
	
	valuesArray(){
		return Array.from({length:9}).reduce((z,e,i) => ((1 << i+1) & ~this.mask)? z.concat(i+1) : z, [])
	}
	
	removeValuesMask(bs) {
		this.mask |= bs;
		this.count = this.doCount();
	}	
	
}