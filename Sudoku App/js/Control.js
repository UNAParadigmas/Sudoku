let timer = new Timer();
let game = new Game();
window.game=game;	
/* DOCUMENT CONTROL*/

$( document ).ready(function() {
	$().creaCanvas(".................................................................................",'Bienvenido');
	$().initButtons();
});		

$( document ).on('keydown', function(e){
	switch (e.keyCode) {
		case 37: game.moveSelection(0 ,-1); break;
		case 38: game.moveSelection(-1, 0); break;
		case 39: game.moveSelection(0 , 1); break;
		case 40: game.moveSelection(1 , 0); break;
		default:
			var key = Number(e.keyCode);
			var digit = key >= 96 ? key - 96 : key - 48;
			if (digit >= 0 && digit <= 9) game.setDigitInCell(digit);
	}	
});
 $.fn.relMouseCoords = event => {
		var totalOffsetX = 0;
		var totalOffsetY = 0;
		var canvasX = 0;
		var canvasY = 0;
		var currentElement = /*$('#canvas')*/document.getElementById('canvas');

		do {
			totalOffsetX += currentElement.offsetLeft;
			totalOffsetY += currentElement.offsetTop;
		}
		while (currentElement = currentElement.offsetParent)

		canvasX = event.pageX - totalOffsetX;
		canvasY = event.pageY - totalOffsetY;

		return { x: canvasX, y: canvasY }
	}

/*TIMER CONTROL*/

timer.addEventListener('secondsUpdated', function (e) {
	$('#values').html(timer.getTimeValues().toString());
});

timer.addEventListener('started', function (e) {
	$('#values').html(timer.getTimeValues().toString());
});

$('#nuevoJuego').click(function () {
	var val = $('#sel1 option:selected').text();
	$().creaCanvas("7.8...3.....2.1...5..7..2...4.....263.948...7...1...9..9.6....4....7.5....5......",val,true,true);
});


/*CANVAS CONTROL*/

$('#canvas').on('mousedown', function(e){
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	var coords = $().relMouseCoords(e);
	game.selectCell(Math.floor(coords.y / game.CellSize), Math.floor(coords.x / game.CellSize));
});

$("#sel1").change(function(){
	$('#dificultad').prop('hidden',(this.value != '9x9'));
});		

$('#pauseButton').click(function () {
	timer.pause();
	$('#startButton').prop('disabled', false);
	$('#pauseButton').prop('disabled', true);			
	$('#grid').prop('hidden', true);
});

$.fn.initButtons = function() {
	$('#pauseButton').prop('disabled', true);			
	$('.logged').prop('hidden', true);
	$('#dificultad').prop('hidden', true);
	$('#message').text('Para Jugar: Cree o Cargue Nuevo Juego');
	$('#btnClear').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnReset').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnSolve').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnHint').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnUndo').css({'background-color':'#FFFFFF'})
};

$.fn.creaCanvas = function(txt,val,time = false, init=false){
	var aux = $('#sel2 option:selected').text();
	var dif = (val !== '9x9' || aux === 'Fácil') ? 1 : (aux === 'Normal') ? 2 : 3 ;
	showAllowed = dif === 1; 
			
	//$('#panelMsg').prop('hidden', false);
	//$('#message').prop('hidden',false);
	//$('#message').text('Juego Nuevo');
				
	$('#size').text(val + ((val == '9x9')? " " + aux : ""));
	if(time && timer.isRunning()){				
		timer.stop();
		timer.start("00:00:00");
		$('#pauseButton').prop('disabled', true);
	}else if(time){
		timer.start("00:00:00");
		$('#pauseButton').prop('disabled', false);
	}
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
