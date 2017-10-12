class Board{
	
	constructor(size = 9) {
		this.size=size;
		this.digits = new Grid(size);
		this.locs = this.createLocs();
		this.check = new Set();
		this.isSolved = this.isValid = false;
		this.minLoc = new Cell();
		this.stringInit = '';
		this.stringAct = '';
		this.singles = []
		this.stack = [];
	}
	
	createLocs() {		
		let _locs = Array.from({length:81},(e,i) => new Location(i % 9, Math.floor(i / 9)));
		_locs.forEach(loc => loc.sibs = loc.getSibsAll())
		_locs.forEach(loc => (this.digits.get(loc).setLoc(loc)));
		return _locs;
	}
	
	updateDigits(target,type){
		if(!type){
			target.loc.getAllSibs().forEach(e=>this.updateMin(this.digits.get(e).update(target,type)))
			if(!target.given)
				this.stringAct=this.stringAct.substr(0,target.loc.index)+target.value+this.stringAct.substr(target.loc.index+1);
		}
		else{
			target.loc.getAllSibs().forEach(e=>this.digits.get(e).update(target,type))
			this.stringAct=this.stringAct.substr(0,target.loc.index)+'.'+this.stringAct.substr(target.loc.index+1);
		}
	}
	
	updateMin(target){
		if(target.isNotAssigned()){
			if((this.minLoc.mask.count>target.mask.count)||this.minLoc.isAssigned())
				this.minLoc=target;
			//this.check.add(target.loc);
			if(target.mask.count==1){
				this.singles.push(target);
			}
		}
	}
	
	findCellWithFewestChoices(){
		this.locs.forEach(e=>this.updateMin(this.getCell(e)));
	}
	// GET METHODS
	
	getCell(loc) {
		return this.digits.get(loc);
	}
	
	getMask(loc){
		return this.getCell(loc).getMask();
	}
	
	// SET METHODS
	
	setCell(loc, value) {
		this.getCell(loc) = value;
	}
	
	setString (value, init=false, undo=false) { 
		
		let loc = i => new Location(Math.floor(i/9),i%9);
		let check =(val) => isNaN(val)? 0 : parseInt(val);
		if(undo){
			value = Array.from(this.stringInit).reduce((z,e,i)=>e==value[i]?z+'.':z+value[i],'');
			Array.from(value).forEach((e, i) => check(e)?this.getCell(loc(i)).setValue(e):undefined);
		}
		else if(!init){
			value = Array.from(this.stringAct).reduce((z,e,i)=>e==value[i]?z+'.':z+e,'');
			Array.from(value).forEach((e, i) => check(e)?this.getCell(loc(i)).reset():undefined)
		}
		else{
			let changes = Array.from(value).reduce((z, val, i) => this.getCell(loc(i)).setGiven(check(val), loc(i))?z.concat(loc(i)):z,[])
			changes.forEach(e=>this.digits.get(e).updateSiblings())
			this.stringInit = value;
			this.stringAct = value;
		}
	}
	
	// ANSWER METHODS
	acceptPossibles(){//cambiar nombre

		if(!this.singles.length && this.minLoc.mask.count==0)
			return false;
		this.singles.forEach(cell => cell.setValue(0));
		return !this.singles.filter(cell => !cell.setValue(cell.getAnswer())).length;
	}
	
	trySolve(){
		window.game.updateCanvas();
		this.singles = [];
		if(this.minLoc.mask.count==1){
			let vec=this.detSolve()
			if(vec[vec.length-1]==false){
				return false;
			}
		}
		
		if(this.minLoc.mask.count>2||this.minLoc.isAssigned())
			this.findCellWithFewestChoices();
		if(!this.isSolved){//non deteministic case
			this.stack.push(this.minLoc);
			this.stack.push(this.stringAct.slice(0));
			return this.nonDetSolve(this.minLoc.mask.valuesArray(),0);
		}
		if(!this.minLoc.mask.count){
			return false;
		}
		else if(this.minLoc.isNotAssigned()){
			return false;
		}
		return true;
	}
	
	detSolve(vec = []){
		//if(this.analyzeGrid()){
			if(!this.acceptPossibles())
				return vec.concat(this.singles.concat(false));
			if(this.minLoc.mask.count==0)
				return vec;
			return this.detSolve(vec.concat(this.singles));
		//}
		/*else{
			if(!this.acceptPossibles())
				vec.concat(this.singles.concat(false));
			else
				vec.concat(this.singles);
		}*/
		//return vec
	}
	
	nonDetSolve(arr, i){
		if(arr.length==i){
			this.rollback();
			return false;
		}
		this.minLoc.setValue(arr[i])
		if(!this.trySolve()){
			this.rollback(true)
			return this.nonDetSolve(arr, i+1);
		}
		return true;
	}
	
	rollback(type = false){
		if(type)
			this.rollbackIter()
		else
			this.rollbackStack()
	}
	
	rollbackStack(){
		if(this.stack.length>4){
			this.setString(this.stack.pop());
			this.minLoc=this.stack.pop();
			this.minLoc.reset();
			this.setString(this.stack[this.stack.length-1])
			this.minLoc=this.stack[this.stack.length-2];
		}
		else{
			this.setString(this.stack.pop());
			this.minLoc=this.stack.pop();
			this.minLoc.reset();
		}
	}
	
	rollbackIter(){
		if(this.stack.length){
			this.setString(this.stack[this.stack.length-1]);
			this.minLoc=this.stack[this.stack.length-2];
		}
	}
	
	analyzeGrid(){
		this.singles = [];
		if(!this.check.size&&this.isSolved){
			return false;
		}
		this.isSolved = Array.from(this.check).reduce((z, loc) => (this.chechForSingleAnswer(loc, 0) || this.chechForSingleAnswer(loc, 1) || this.chechForSingleAnswer(loc, 2))&&z,true);
		this.check=new Set();
		if(!this.isSolved && !this.singles.length) return false;
		if(this.isSolved) return false;
		return true;
	}
	
	getAnswerLocation(loc, type){
		return this.answer[type][loc.col]|this.answer[type][loc.row]|this.answer[type][loc.getSquare()];
	}
	
	chechForSingleAnswer(_loc, type){
		let cell = this.getCell(_loc);
		if(cell.mask.hasSingle&&cell.isNotAssigned()&&!cell.isGiven()){
			cell.setAnswer(cell.getSingle());
			this.singles.push(cell);
			return true;
		}
		return false;
	}
	
	
	// GAME METHODS
	
	
	reset() {
		this.isSolved  = false;
		let check = (cell) => cell.isGiven()? cell : cell.reset(0);
		this.locs.forEach(loc => check(this.getCell(loc)));
	}
	
	checkIsValidSibs (digit, locs) {
		return checkGeneral(x=>this.getCell(x).getAnswer()==digit, locs) != 0;
	}
	
	checkGeneral(f, locs){
		return locs.reduce((z,elem)=>f(elem)?z+1:z);
	}
}

