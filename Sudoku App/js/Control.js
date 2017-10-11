let timer = new Timer();
let game = new Game();
window.game=game;	
/* DOCUMENT CONTROL*/

$( document ).ready(function() {	
	//$('.logged').hide();
	$("#onPause").hide();
	$("#sudoku").hide();
	
	$('#pauseButton').prop('disabled', true);			
	$('#btnAccept').prop('disabled', true);
	//$('#btnSolve').prop('disabled', true);
	$('#btnHint').prop('disabled', true);
	$('#btnUndo').prop('disabled', true);
});		

/*CANVAS CELL SELECTION*/

$( document ).on('keydown', function(e){ // Moves through canvas cell using arrows
	switch (e.keyCode) {
		case 37: game.moveSelection(0 ,-1); break;
		case 38: game.moveSelection(-1, 0); break;
		case 39: game.moveSelection(0 , 1); break;
		case 40: game.moveSelection(1 , 0); break;
		case 8: case 46: game.setDigitInCell(0); break;
		default:
			var key = Number(e.keyCode);
			var digit = key >= 96 ? key - 96 : key - 48;
			if (digit >= 0 && digit <= 9) game.setDigitInCell(digit);
	}	
});

 $.fn.relMouseCoords = event => { // returns selected cell coord.
		var currentElement = $('#canvas').get(0);

		let loop = (_x, _y) => (currentElement = currentElement.offsetParent)? loop(_x + currentElement.offsetLeft, _y + currentElement.offsetTop) 
								: {x: event.pageX - _x, y: event.pageY - _y } 
								
		return loop(currentElement.offsetLeft, currentElement.offsetTop);		
	}

	
	$('#canvas').on('mousedown', function(e){  // Calculate the position x-y of the canvas cell clicked.
		var coords = $().relMouseCoords(e);
		game.selectCell(Math.floor(coords.y / 60), Math.floor(coords.x / 60));//60 = cell size
	});
	
/*TIMER CONTROL*/

timer.addEventListener('secondsUpdated', function (e) {
	$('#values').html(timer.getTimeValues().toString());
});

timer.addEventListener('started', function (e) {
	$('#values').html(timer.getTimeValues().toString());
});

$('#nuevoJuego').click(function () {
	$("#sudoku").show();
	$("#onStart").hide();
	$("#statusMsg").hide();
	var val = $('#sel1 option:selected').text();
	$().creaCanvas("1..........4..1.9..6..8......3.7.8.......51..7..1..........3..8..5..497.4.685..1.",val,true,true);
});


/*GAME CONTROL*/


$("#sel1").change(function(){
	$('#dificultad').prop('hidden',(this.value != '9x9'));
});		

$('#pauseButton').click(function () {
	timer.pause();
	$('#pauseButton').prop('disabled', true);			
	$('#sudoku').hide();
	$("#onPause").show();
	$("#statusMsg").show();
});

$('#continueBtn').click(function () {
	timer.start();
	$('#pauseButton').prop('disabled', false);			
	$('#sudoku').show();
	$("#statusMsg").hide();
});

$.fn.creaCanvas = function(txt,val,time = false, init=false){
	var aux = $('#level option:selected').text();
	var dif = (val !== '9x9' || aux === 'Fácil') ? 1 : (aux === 'Normal') ? 2 : 3 ;
	showAllowed = dif === 1; 
			
	//$('#panelMsg').prop('hidden', false);
	//$('#message').prop('hidden',false);
	//$('#message').text('Juego Nuevo');
				
	$('#size').text(val + ((val == '9x9')? " " + aux : ""));
	/*if(time && timer.isRunning()){				
		timer.stop();
	}
	//timer.start("00:00:00");
	$('#pauseButton').prop('disabled', false);*/
	
	game.board.setString(txt,init);
	game.updateCanvas();
};

$.fn.evaluaTxt = function (txt){/////por implementar
	return false;
}

$('#loadGame').click( () =>{
	let txt = $('#sudokuText').val();
	$().creaCanvas(txt,$('#sel1 option:selected').text(),true);
	$('#load-modal').modal('toggle');
});
