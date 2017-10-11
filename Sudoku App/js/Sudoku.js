	function relMouseCoords(event) {
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = this;

		do {
			totalOffsetX += currentElement.offsetLeft;
			totalOffsetY += currentElement.offsetTop;
		}
		while (currentElement = currentElement.offsetParent)

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return { x: canvasX, y: canvasY }
	}
	HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

	
	
	var SquareSize = 3;
	var BoardSize = SquareSize * SquareSize;

	function AllowedValues(n) {
		this._mask = n;
	}

	AllowedValues.prototype.getSingle = function () {
		// Count number of on bits from 1..9
		var single = 0;
		var count = 0;
		for (var i = 1; i <= BoardSize; i++)
			if ((this._mask & (1 << i)) != 0) {
				count++;
				single = i;
			}
		return count == 1 ? single : 0;
	};

	// Used when the answer is known at the Cell, level this sets the only allowed value to be that answer
	AllowedValues.prototype.setSingle = function (n) {
		this._mask = 1 << n;
	};

	AllowedValues.prototype.count = function () {
		// Count number of on bits from 1..9
		var count = 0;
		for (var i = 1; i <= BoardSize; i++)
			if ((this._mask & (1 << i)) != 0)
				count++;
		return count;
	};

	AllowedValues.prototype.isAllowed = function (n) {
		return n >= 1 && n <= BoardSize && ((this._mask & (1 << n)) != 0);
	};

	AllowedValues.prototype.removeValues = function (bm) {
		this._mask &= ~bm._mask;
	};

	AllowedValues.prototype.allowedValuesArray = function () {
		var ret = new Array();
		for (var i = 1; i <= BoardSize; i++)
			if (((1 << i) & this._mask) != 0)
				ret.push(i);
		return ret;
	};

	AllowedValues.prototype.clone = function () {
		return new AllowedValues(this._mask);
	};

	function Cell(value) {
		this._value = value; // 0 means unassigned
		this._allowed = new AllowedValues(0x3e); // all possible
		this._answer = 0; // no answer
		this._given = false;
	}

	Cell.prototype.clone = function (value) {
		var clone = new Cell();
		clone._value = this._value;
		clone._allowed = this._allowed.clone();
		clone._answer = this._answer;
		clone._given = this._given;
		return clone;
	};

	Cell.prototype.single = function (value) {
		this._value = value; // value user (or auto solve functions) has assigned as a possible answer
		this._allowed = new AllowedValues(0x3e); // the allowed values as a bit mask
		this._answer = 0; // calculated as the only possible correct value
	};

	Cell.prototype.valueMask = function () {
		return this._value == 0 ? 0 : 1 << this._value;
	};

	Cell.prototype.hasAnswer = function () {
		return this._answer != 0;
	};

	Cell.prototype.getAnswer = function () {
		return this._answer;
	};

	Cell.prototype.setAnswer = function (n) {
		if (n < 0 || n > 9)
			throw "Illegal value not in the range 1..9.";
		this._answer = n;
	};

	Cell.prototype.getValue = function () {
		return this._value;
	};

	Cell.prototype.setValue = function (n) {
		if (n < 0 || n > 9)
			throw "Illegal value not in the range 1..9.";
		if (n != 0 && !this._allowed.isAllowed(n))
			throw "Not allowed.";
		this._value = n;
		this._given = false;
	};

	Cell.prototype.setGiven = function (n) {
		if (n < 0 || n > 9)
			throw "Illegal value not in the range 1..9.";
		this._value = n;
		this._given = n != 0;
		this._answer = 0;
	};

	Cell.prototype.isGiven = function () {
		return this._given;
	};

	Cell.prototype.isAssigned = function () {
		return this._value != 0;
	};

	Cell.prototype.clear = function () {
		this._value = 0; // means unassigned
		this._allowed = new AllowedValues(0x3E); // all possible
		this._answer = 0;
		this._given = 0;
	};

	Cell.prototype.isAllowed = function (value) {
		return this._allowed.isAllowed(value);
	};

	Cell.prototype.setAllowed = function (value) {
		this._allowed = new AllowedValues(value);
	};

	Cell.prototype.getAllowedClone = function (value) {
		return this._allowed.clone();
	};

	var SibType = { "Row": 1, "Col": 2, "Square": 3 };

	function Location(row, col) {
		this.row = row;
		this.col = col;
	}

	Location.empty = new Location(-1, -1);

	Location.prototype.isEmpty = function () {
		return this.row < 0;
	};

	Location.prototype.modulo = function (n) {
		if (n < 0)
			return n + BoardSize;
		return n % BoardSize;
	};

	Location.prototype.left = function () {
		return new Location(this.row, this.modulo(this.col - 1));
	};

	Location.prototype.right = function () {
		return new Location(this.row, this.modulo(this.col + 1));
	};

	Location.prototype.up = function () {
		return new Location(this.modulo(this.row - 1), this.col);
	};

	Location.prototype.down = function () {
		return new Location(this.modulo(this.row + 1), this.col);
	};

	Location.prototype.toString = function () {
		return "Row=" + String(this.row) + "Col=" + String(this.col);
	};

	Location.prototype.getSquare = function () {
		return 3 * Math.floor(this.row / 3) + Math.floor(this.col / 3);
	};

	Location.prototype.equals = function (a) {
		return a.row == this.row && a.col == this.col;
	};

	Location.prototype.notEquals = function (a) {
		return a.row != this.row || a.col != this.col;
	};

	// Enumerator for locations of all cells
	Location.grid = function () {
		var locs = new Array();
		for (var i = 0; i < BoardSize; i++)
			for (var j = 0; j < BoardSize; j++)
				locs.push(new Location(i, j));
		return locs;
	};

	// Enumerator for locations of cell siblings in the same row
	Location.prototype.rowSibs = function () {
		var locs = new Array();
		for (var i = 0; i < BoardSize; i++)
			if (i != this.col)
				locs.push(new Location(this.row, i));
		return locs;
	};

	// Enumerator for locations of cell siblings in the same column
	Location.prototype.colSibs = function () {
		var locs = new Array();
		for (var i = 0; i < BoardSize; i++)
			if (i != this.row)
				locs.push(new Location(i, this.col));
		return locs;
	};

	// Enumerator for locations of cell siblings in the same square
	Location.prototype.squareSibs = function () {
		var locs = new Array();
		var baseRow = 3 * Math.floor(this.row / 3); // this is how to convert float to an "int" - Javascript doesn't have ints!
		var baseCol = 3 * Math.floor(this.col / 3);
		for (var i = 0; i < SquareSize; i++) {
			var r = baseRow + i;
			for (var j = 0; j < SquareSize; j++) {
				var c = baseCol + j;
				if (r != this.row || c != this.col)
					locs.push(new Location(r, c));
			}
		}
		return locs;
	};

	Location.prototype.getSibs = function (type) {
		switch (type) {
			case SibType.Row:
				return this.rowSibs();
			case SibType.Col:
				return this.colSibs();
			case SibType.Square:
				return this.squareSibs();
		}
	};

	function Board() {

		function MultiDimArray(rows, cols) {
			var a = new Array(rows);
			for (var i = 0; i < rows; i++) {
				a[i] = new Array(cols);
				for (var j = 0; j < cols; j++)
					a[i][j] = new Cell();
			}
			return a;
		}

		this._digits = MultiDimArray(BoardSize, BoardSize);
		this._isSolved = false;
		this._isValid = false;

	}

	Board.prototype.clone = function () {
		var clone = new Board();
		clone._isSolved = this._isSolved;
		clone._isValid = this._isValid;
		clone._digits = new Array(BoardSize);
		for (var i = 0; i < BoardSize; i++) {
			clone._digits[i] = new Array(BoardSize);
			for (var j = 0; j < BoardSize; j++)
				clone._digits[i][j] = this._digits[i][j].clone();
		}
		return clone;
	};

	Board.prototype.copyTo = function (target) {
		target._isSolved = this._isSolved;
		target._isValid = this._isValid;
		for (var i = 0; i < BoardSize; i++)
			for (var j = 0; j < BoardSize; j++)
				target._digits[i][j] = this._digits[i][j].clone();
	};

	Board.prototype.getCell = function (loc) {
		return this._digits[loc.row][loc.col];
	};

	Board.prototype.setCell = function (loc, value) {
		this._digits[loc.row][loc.col] = value;
	};

	Board.prototype.clear = function () {
		for (var i = 0; i < BoardSize; i++)
			for (var j = 0; j < BoardSize; j++)
				this._digits[i][j].clear();
		this.updateAllowed();
	};

	Board.prototype.reset = function () {// return Baord to only the givens
		for (var i = 0; i < BoardSize; i++)
			for (var j = 0; j < BoardSize; j++) {
				var cell = this._digits[i][j];
				if (!cell.isGiven())
					cell.clear();
			}
		this.updateAllowed();
	};

	Board.prototype.checkIsValidSibs = function (loc, digit, locs) {
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			var cell = this._digits[loc.row][loc.col];
			if (cell.getAnswer() == digit)
				return false;
		}
		return true;
	};

	Board.prototype.checkIsValid = function (loc, digit) {
		// Checks if the digit can go in that location by checking it doesn't
		// exist in either the row, col or square siblings
		if (!this.checkIsValidSibs(loc, digit, loc.colSibs()))
			return false;
		if (!this.checkIsValidSibs(loc, digit, loc.rowSibs()))
			return false;
		if (!this.checkIsValidSibs(loc, digit, loc.squareSibs()))
			return false;

		return true;
	};

	Board.prototype.acceptPossibles = function () {
		var more = false;
		var locs = Location.grid();
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			var cell = this._digits[loc.row][loc.col];
			if (!cell.isAssigned() && cell.hasAnswer() && this.checkIsValid(loc, cell.getAnswer())) {
				cell.setValue(cell.getAnswer()); // if unassigned and has the answer then assign the answer
				more = true;
			}
		}
		return more;
	};

	Board.prototype.checkForHiddenSingles = function (loc, st) {
		// Check each cell - if not assigned and has no answer then check its siblings
		// get all its allowed then remove all the allowed
		var cell = this.getCell(loc);
		if (!cell.isAssigned() && !cell.hasAnswer()) {
			var allowed = cell.getAllowedClone(); // copy of bit mask of allowed values for this cell
			var locs = loc.getSibs(st);
			for (var i = 0; i < locs.length; i++) {
				var sib = locs[i];
				var sibCell = this.getCell(sib);
				if (!sibCell.isAssigned())
					allowed.removeValues(sibCell.getAllowedClone()); // remove allowed values from siblings
			}
			var answer = allowed.getSingle(); // if there is only one allowed value left (i.e. this cell is the only one amonsgt its sibs with this allowed value)
			// then apply it as the answer. Note getSingle will return 0 (i.e. no anser) if the number of allowed values is not exactly one
			if (answer != 0) {
				cell.setAnswer(answer);
				return true; // no need to check others sibling collections
			}
		}
		return false;
	};

	Board.prototype.findCellWithFewestChoices = function () {
		var minLocation = Location.empty;
		var minCount = 9;
		var locs = Location.grid();
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			var cell = this.getCell(loc);
			if (!cell.isAssigned()) {
				var count = cell.getAllowedClone().count();
				if (count < minCount) {
					minLocation = loc;
					minCount = count;
				}
			}
		}
		return minLocation;
	};

	Board.prototype.updateAllowed = function () {
		// Called whenever the user sets a value or via auto solve
		// Updates the allowed values for each cell based on existing digits
		// entered in a cell's row, col or square
		var cols = new Array(BoardSize);
		var rows = new Array(BoardSize);
		var squares = new Array(BoardSize);

		// First aggregate assigned values to rows, cols, squares
		var locs = Location.grid();
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			// Disallow for all cells in this row
			var contains = this.getCell(loc).valueMask();
			rows[loc.row] |= contains;
			cols[loc.col] |= contains;
			squares[loc.getSquare()] |= contains;
		}

		// For each cell, aggregate the values already set in that row, col and square.
		// Since the aggregate is a bitmask, the bitwise inverse of that is therefore the allowed values.
		this._isValid = true;
		this._isSolved = true;
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			// Set allowed values
			var contains = rows[loc.row] | cols[loc.col] | squares[loc.getSquare()];
			var cell = this.getCell(loc);
			cell.setAllowed(~contains); // set allowed values to what values are not already set in this row, col or square
			cell.setAnswer(0); //clear any previous answers
			// As an extra step look for "naked singles", i.e. cells that have only one allowed value, and use
			// that to set the answer (note this is different from the "value" as this can only be assigned
			// by the user or any auto solve functions like "accept singles"
			if (!cell.isAssigned()) {
				this._isSolved = false;
				var mask = new AllowedValues(~contains);
				var count = mask.count();
				if (count == 0)
					this._isValid = false;
				else if (count == 1)
					cell.setAnswer(mask.getSingle());
			}
		}

		// Step 2: Look for "hidden singles".
		// For each row, col, square, count number of times each digit appears.
		// If any appear once then set that as the answer for that cell.
		// Count in rows
		for (var i = 0; i < locs.length; i++) {
			var loc = locs[i];
			if (!this.checkForHiddenSingles(loc, SibType.Row))// first check row sibs for a hiddne single
				if (!this.checkForHiddenSingles(loc, SibType.Col))// then check cols
					this.checkForHiddenSingles(loc, SibType.Square); // then check square
		}

		// TO DO: Add code here to detect naked/hidden doubles/triples/quads
	};

	Board.prototype.trySolve = function (loc, value) {// empty Location allowed
		if (!loc.isEmpty())// assign a value to a location if provided
		{
			var cell = this.getCell(loc);
			if (!cell.isAllowed(value))
				throw "Internal error.";
			cell.setValue(value);
		}

		do {
			this.updateAllowed();
			if (!this._isValid)
				return false;
		} while (this.acceptPossibles()); // keep doing deterministic answers

		if (this._isSolved)
			return true;

		if (!this._isValid)
			return false;

		// No deterministic solutions, find cell with the fewest choices and try each one in turn
		// until success. 
		var locChoice = this.findCellWithFewestChoices();
		if (locChoice.isEmpty())
			return false;

		var cell = this.getCell(locChoice);
		var allowedValues = cell._allowed.allowedValuesArray();
		for (var i = 0; i < allowedValues.length; i++) {
			var val = allowedValues[i];
			var board = this.clone();
			if (board.trySolve(locChoice, val)) {
				board.copyTo(this);
				return true;
			}
		}

		return false;
	};

	Board.prototype.toString = function () {
		var text = "";
		for (var row = 0; row < BoardSize; row++)
			for (var col = 0; col < BoardSize; col++) {
				var val = this._digits[row][col].getValue();
				text += val == 0 ? "." : String(val);
			}
		return text;
	};

	Board.prototype.setString = function (value) { 
		if (value.length != (BoardSize * BoardSize))
			return false; 
		var n = 0;
		
		for (var row = 0; row < BoardSize; row++) //funcional
			for (var col = 0; col < BoardSize; col++) {
				var ch = parseInt(value.charAt(n++)); 
				var cell = this._digits[row][col];
				cell.setGiven(isNaN(ch) ? 0 : ch);
			}
		this.updateAllowed();
		return true;
	};
	
	
	var CellSize = 60;
	var SubCellSize = 18;

	var canvas1 = document.getElementById("canvas1");
	//var canvas2 = document.getElementById("canvas2");
	var chbAllowed = true; // check box
	var chbShowSingles = true; // check box
	//var tbSerial = document.getElementById("tbSerial");
	//var extraInfo = document.getElementById("extraInfo");

	var board1 = new Board();
	var selectRow = 0;
	var selectCol = 0;
	var showAllowed = true;
	var showSingles = true;
	var undoStack = Array();

	function undo() {
		var tos = undoStack.pop();
		if (tos) {
			board1 = tos;
			updateUI();
		}
	}

	function clearUndo() {
		undoStack= Array();
	}

	function pushBoard() {
		undoStack.push(board1.clone());
	}

	function checkStatus() {
		//extraInfo.innerHTML = "";
		if (!board1._isValid)
			message.innerHTML = "* Incorrecto*";
		else if (board1._isSolved)
			message.innerHTML = "* Resuelto *";
		else
			message.innerHTML = "";
	}

	function drawGrid() {
		// Only ever called once!
		var context = canvas1.getContext('2d'); 
		context.strokeStyle = '#808080';
		for (var i = 0; i <= BoardSize; i++) {
			context.beginPath();
			var thick = i % 3 == 0;
			// Draw vertical lines
			context.lineWidth = thick ? 2 : 1;
			context.moveTo(i * CellSize + 0.5, 0.5);
			context.lineTo(i * CellSize + 0.5, BoardSize * CellSize + 0.5);

			// Draw horizontal lines
			context.moveTo(0.5, i * CellSize + 0.5);
			context.lineTo(BoardSize * CellSize + 0.5, i * CellSize + 0.5);
			context.stroke();
		}
	}

	function drawCells() {
		var context = canvas1.getContext('2d'); 
	
		context.font = "12pt Calibri"; // small text
		context.textAlign = "center";
		context.textBaseline = "middle";
		var normalColor = "#aaaaaa";
		var singleColor = "#ff143c";

		// Draw background for selected cell
		for (var row = 0; row < BoardSize; row++)
			for (var col = 0; col < BoardSize; col++) {

				// Draw background of selected cell
				if (row == selectRow && col == selectCol) {
					var margin = 2;
					context.beginPath();
					context.rect(col * CellSize + margin + 0.5, row * CellSize + margin + 0.5, CellSize - 2 * margin, CellSize - 2 * margin);
					context.fillStyle = "#ffe4e1";
					context.fill()
				}
			}
		context.fillStyle = "#999999"; // text color - light

		// Draw allowed values
		if (showAllowed)
			for (var row = 0; row < BoardSize; row++)
				for (var col = 0; col < BoardSize; col++) {
					var cell = board1.getCell(new Location(row, col));
					if (!cell.isAssigned()) {
						var allowedValues = cell._allowed.allowedValuesArray();
						for (var i = 0; i < allowedValues.length; i++) {
							var val = allowedValues[i];
							var x = (col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
							var y = (row + 0.5) * CellSize;
							var subRow = Math.floor((val - 1) / 3) - 1;
							var subCol = Math.floor((val - 1) % 3) - 1;
							x += subCol * SubCellSize;
							y += subRow * SubCellSize;
							var hiddenSingle = allowedValues.length != 1 && val == cell.getAnswer(); // naked single would have only one allowed value
							context.fillStyle = normalColor; // show hidden single in purple
							if (showSingles && val == cell.getAnswer())
								context.fillStyle = singleColor; // show hidden single in purple
							context.fillText(val, x, y);
						}
					}
				}

		// New if a digit is selected then make all cells with the same digit foreground red
		var selectCell = board1.getCell(new Location(selectRow, selectCol));
		var selectValue = selectCell.getValue();

		// Draw values last
		context.font = "32pt Calibri";
		context.textAlign = "center";
		context.textBaseline = "middle";
		var normalForeColor = "#191929";
		var sameDigitForeColor = "#F91919";
		context.fillStyle = normalForeColor; // text color - dark
		for (var row = 0; row < BoardSize; row++) // funcional
			for (var col = 0; col < BoardSize; col++) {
				var cell = board1.getCell(new Location(row, col));
				var x = (col + 0.5) * CellSize; // center of cell for textAlign center, textBaseline middle
				var y = (row + 0.5) * CellSize;
				var sameDigit = cell.getValue() == selectValue && selectValue != 0;
				// Draw value
				var value = cell.getValue();
				if (value != 0) {
					context.fillStyle = cell.isGiven() ? "#2200aa" : "#696969"; // show "givens" in a darker color
					if (sameDigit)// then override
						context.fillStyle = sameDigitForeColor; // text color - dark
					context.fillText(value, x, y);
				}
			}
	}

	function drawCanvas() {
		canvas1.width = canvas1.width;
		drawGrid();
		drawCells();
	}

	function updateUI() {
		drawCanvas();
		checkStatus();
		//tbSerial.value = board1.toString();
	}

	function readOptions() {
		showAllowed = chbAllowed.checked;
		showSingles = chbShowSingles.checked;
		drawCanvas();
	}

	chbAllowed.onclick = readOptions;
	chbShowSingles.onclick = readOptions;

	function selectCell(row, col) {
		selectRow = row;
		selectCol = col;
		drawCanvas();
	}

	function moveSelection(row, col) { 
		selectRow += row;
		selectCol += col;
		if (selectRow < 0 ) selectRow = 8;
		else if (selectRow > 8) selectRow = 0;
		if (selectCol < 0) selectCol = 8;
		else if (selectCol > 8)	selectCol = 0;
		drawCanvas();
		/* 
			selectRow = (selectRow < 0 )? 8 : (selectRow > 8)? 0: selectRow;
			selectCol = (selectCol < 0 )? 8 : (selectCol > 8)? 0: selectCol;
			drawCanvas();
		*/
	}

	function setDigitInCell(digit) {
		var cell = board1.getCell(new Location(selectRow, selectCol));
		message.innerHTML = "";
		if (cell.isGiven())
			return;
		if (digit != 0 && !cell.isAllowed(digit)) {
			message.innerHTML = "Digit not allowed";
			return;
		}
		pushBoard();
		cell.setValue(digit);
		board1.updateAllowed();
		updateUI();
	}

	canvas1.onmousedown = function canvasMouseDown(ev) {
		var x = ev.pageX - this.offsetLeft;
		var y = ev.pageY - this.offsetTop;
		var coords = this.relMouseCoords(ev);
		selectCell(Math.floor(coords.y / CellSize), Math.floor(coords.x / CellSize));
	}

	document.onkeydown = function (ev) {
		switch (ev.keyCode) {
			case 37: // left arrow
				moveSelection(0, -1);
				break;
			case 38: // up arrow
				moveSelection(-1, 0);
				break;
			case 39: // right arrow
				moveSelection(0, 1);
				break;
			case 40: // down arrow
				moveSelection(1, 0);
				break;
			default:
				var key = Number(ev.keyCode);
				var digit = key >= 96 ? key - 96 : key - 48;// handle keypad digits as well
				if (digit >= 0 && digit <= 9)
					setDigitInCell(digit);
				break;
		}
	}

	function loadText() {
		/*
			traer el texto del modal donde se importa del modal
		*/
		//var ret = board1.setString(tbSerial.value);
		updateUI();
		if (!ret)
			message.innerHTML = "String is not of length 81";
	}

	function clearGame() {
		clearUndo();
		board1.clear();
		updateUI();
	}

	function acceptPossibles() {
		pushBoard();
		board1.acceptPossibles();
		board1.updateAllowed();
		updateUI();
	}

	function hint() {
		// First check if we had calculated a solution, if not do so now
		solution = board1.clone();
		if (solution.trySolve(Location.empty, 0)) {
			// There is a solution to the board from its current state
			var cell = solution.getCell(new Location(selectRow, selectCol));
			if (!cell.isGiven())
				setDigitInCell(cell.getValue());
		}
	}

	function reset() {
		clearUndo();
		board1.reset();
		updateUI();
	}

	function solve() {
		pushBoard();
		var n = new Date();           // Grab new copy of date
		var s = n.getTime();          // Grab current millisecond #
		board1.trySolve(Location.empty, 0);
		var diff = new Date().getTime() - s;
		updateUI();
		//extraInfo.innerHTML = "Solve took " + String(diff) + " milliseconds";
	}


