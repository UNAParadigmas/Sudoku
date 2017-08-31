let timer = new Timer();
let game = new Game();
	
$( document ).ready(function() {
	$().nuevoJuego(".................................................................................",'Bienvenido');
	$().initButtons();
});		
$("#sel1").change(function(){
	$('#dificultad').prop('hidden',(this.value != '9x9'));
});		
$('#pauseButton').click(function () {
	timer.pause();
	$('#startButton').prop('disabled', false);
	$('#pauseButton').prop('disabled', true);			
	$('#grid').prop('hidden', true);
	$('#PasuedMsg').prop('hidden', false);
});//TIMER
timer.addEventListener('secondsUpdated', function (e) {
	$('#values').html(timer.getTimeValues().toString());
});
timer.addEventListener('started', function (e) {
	$('#values').html(timer.getTimeValues().toString());
});
//TIMER END
$('#nuevoJuego').click(function () {
	var val = $('#sel1 option:selected').text();
	$().nuevoJuego("6.81..........72.............3.5..615....4..........8.47....5.....63.....2.......",val,true);
});
$('#bclose').click(function(){$('#panelMsg').prop('hidden',true)});

$.fn.initButtons = function() {
	$('#pauseButton').prop('disabled', true);			
	$('#PasuedMsg').prop('hidden', true);
	$('.logged').prop('hidden', true);
	$('#dificultad').prop('hidden', true);
	$('#message').text('Para Jugar: Cree o Cargue Nuevo Juego');
	$('#btnClear').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnReset').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnSolve').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnAccept').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnHint').css({'background-color':'#FFFFFF'}).prop('disabled', true);
	$('#btnUndo').css({'background-color':'#FFFFFF'}).prop('disabled', true);
};
$.fn.nuevoJuego = function(txt,val,time = false){
	var aux = $('#sel2 option:selected').text();
	var dif = (val !== '9x9' || aux === 'Fácil') ? 1 : (aux === 'Normal') ? 2 : 3 ;
	//showAllowed = showSingles = (dif === 1); // eliminar showSingles
			
	//$('#panelMsg').prop('hidden', false);
	//$('#message').prop('hidden',false);
	//$('#message').text('Juego Nuevo');
				
	$('#size').text(val + ((val == '9x9')? " " + aux : ""));
	if(timer.isRunning()){				
		timer.stop();
		timer.start("00:00:00");
		$('#pauseButton').prop('disabled', true);
	}else{
		timer.start("00:00:00");
		$('#pauseButton').prop('disabled', false);
	}
			
	game.board.setString(txt);
	game.updateCanvas();
};
$('#canvas').on('mousedown', function(e){
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	var coords = this.relMouseCoords(e);
	game.selectCell(Math.floor(coords.y / game.CellSize), Math.floor(coords.x / game.CellSize));
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