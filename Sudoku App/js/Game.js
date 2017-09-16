
class Game {
		constructor(showAllowed = true) {
			this.CellSize = 60;
			this.SubCellSize = 18;
			this.canvas = document.getElementById("canvas");
			this.board = new Board(9);
			this.selRow = 0;
			this.selCol = 0;
			this.selRowBef = 0;
			this.selColBef = 0;
			this.showAllowed = showAllowed;
			this.stack = new Array();
		}
		/* stack methods */
		undo () {
			if (this.stack.length) {
				this.board.setString(this.stack.pop());
				this.update();
			}
		}
		
		pushBoard() {
			console.log(this.board.getString())
			if(!this.beforeValEquals())
				this.stack.push(this.board.getString());
		}
		/* UI methods */
		drawGrid() { 
			let con = this.canvas.getContext('2d'); 
			con.strokeStyle = '#808080';
			
			for (var i = 0; i <= this.board.size; i++) {
				let val1 = i * this.CellSize + 0.5;
				let val2 = this.board.size * this.CellSize + 0.5; 				
				
				con.beginPath();
				con.lineWidth = (i%3) ? 1 : 2;
				con.moveTo(val1, 0.5 );
				con.lineTo(val1, val2);
				con.moveTo(0.5 , val1);
				con.lineTo(val2, val1);
				con.stroke();
			}
		}
		
		drawCells() { //Nota : cambiar  los isNotAssigned
			let con = this.canvas.getContext('2d'); 
			con.font = "12pt Calibri"; 
			con.textAlign = "center";
			con.textBaseline = "middle";
			con.beginPath();
			con.rect(this.selCol * this.CellSize + 2.5, this.selRow * this.CellSize + 2.5, this.CellSize - 4, this.CellSize - 4);
			con.fillStyle = "#A9F5E1";
			con.fill();	
			con.fillStyle = "#999999"; 

			if (this.showAllowed){
				for (var row = 0; row < this.board.size; row++){
					for (var col = 0; col < this.board.size; col++) {
						let cel = this.board.getCell(new Location(row, col));
						if (cel.isNotAssigned()) { 
							var values = cel.allowedValuesArray();
							
							values.forEach ( (e) => {
								let x = (col + 0.5) * this.CellSize; 
								let y = (row + 0.5) * this.CellSize;
								let subRow = Math.floor((e - 1) / 3) - 1;
								let subCol = Math.floor((e - 1) % 3) - 1;
								x += subCol * this.SubCellSize;
								y += subRow * this.SubCellSize;
								con.fillStyle = "#aaaaaa"
								if (values.length == 1 && e == cel.getAnswer())
									con.fillStyle = "#ff143c";
								con.fillText(e, x, y);
							});
						}
					}
				}
			}		
			let selectValue = this.board.getCell(new Location(this.selRow, this.selCol)).getValue();

			con.font = "32pt Calibri";
			con.textAlign = "center";
			con.textBaseline = "middle";
			con.fillStyle = "#191929";
			
			for (var row = 0; row < this.board.size; row++)
				for (var col = 0; col < this.board.size; col++) {
					let cel = this.board.getCell(new Location(row, col));
					let x = (col + 0.5) * this.CellSize; 
					let y = (row + 0.5) * this.CellSize;
					let sameDigit = cel.getValue() == selectValue && selectValue != 0;
					let value = cel.getValue();
					if (value != 0) {
						con.fillStyle = cel.isGiven() ? "#2200aa" : "#696969"; 
						if (sameDigit)
							con.fillStyle = "#F91919";
						con.fillText(value, x, y);
					}
				}
			
		}
		
		updateCanvas() {
			this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.drawGrid();
			this.drawCells();
			//message.innerHTML = (!this.board._isValid)? "Incorrecto" : (this.board._isSolved)? "Resuelto" : "";
		}
		selectCell(row, col) {
			this.updateBefore()
			this.selRow = row;
			this.selCol = col;
			this.updateCanvas();
		}
		
		beforeValEquals(){
			return this.selColBef==this.selCol&&this.selRowBef==this.selRow
		}
		
		updateBefore(){
			this.selColBef=this.selCol;
			this.selRowBef=this.selRow;
		}
		
		moveSelection(row, col){
			this.updateBefore();
			let sRow = row + this.selRow ;
			let sCol = col + this.selCol;		
			this.selRow = (sRow < 0 )? 8 : (sRow > 8)? 0: sRow;
			this.selCol = (sCol < 0 )? 8 : (sCol > 8)? 0: sCol;
			this.updateCanvas();
		}
		
		setDigitInCell(digit) {
			var cel = this.board.getCell(new Location(this.selRow, this.selCol));
			console.log(cel);
			if (cel.isGiven())
				return;
			if (digit != 0 && !cel.isAllowed(digit)) {
				//message.innerHTML = "Digit not allowed"
				return;
			}
			this.pushBoard();
			cel.setValue(digit);
			this.board.updateAllowed();
			this.updateCanvas();
		}
		
		/* GAME METHODS*/
		clearGame() {
			this.stack = new Array();
			this.board.clear();
			this.updateCanvas();
		}
				
		hint() { // codigo basura
			solution = board.clone();
			if(solution.trySolve(Location.empty, 0)){
			var cel = solution.getCell(new Location(selRow, selCol));
			if (!cel.isGiven())
				setDigitInCell(cel.getValue());
			}			
		}
		
		reset(){
			this.stack = new Array();
			this.board.reset();
			this.updateCanvas();
		}
		
		solve(){
			this.pushBoard();
			this.board.trySolve(Location.empty, 0);
			this.updateCanvas();
		}
		
	}
		