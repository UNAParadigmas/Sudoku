/*
  @author Denis Rodriguez Viquez
          Luis Vasquez Quiros
          Walter Chavez Oviedo
          Manuel Masis Segura
  @since 2017
*/

let timer = new Timer();
let game = new Game();
window.game=game;	
/* DOCUMENT CONTROL*/

$( document ).ready(() => {	
	
});		

/*CANVAS CELL SELECTION*/

$( document ).on('keydown', e => { // Moves through canvas cell using arrows
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

	
	$('#canvas').on('mousedown', e=>{  // Calculate the position x-y of the canvas cell clicked.
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

$('#nuevoJuego').click(function() {
	$("#sudoku").show();
	$("#onStart").hide();
	$("#statusMsg").hide();
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: "api/sudoku/newSudoku"
	})
		.done(result => {
			console.log("Nuevo sudoku: ", result.hilera);
			$().creaCanvas([result.hilera], true);
		})
		.fail(err => {
			console.log("error de conexion con backend: ");
			$().creaCanvas(["8.5.....2...9.1...3.........6.7..4..2...5...........6....38.....4....7...1.....9."], true);
		});
});

$('#pauseButton').click(function () {
	timer.pause();
	$('#pauseButton').prop('disabled', true);			
	$('#sudoku').hide();
	$("#onPause").show();
	$("#statusMsg").show();
});

/*BUTTONS ACTION*/

$("#sel1").change(() => {
	$('#dificultad').prop('hidden', (this.value != '9x9'));
});


$('#continueBtn').click(() => {
	timer.start();
	$('#pauseButton').prop('disabled', false);			
	$('#sudoku').show();
	$("#statusMsg").hide();
});


$.fn.creaCanvas = function(vec,seg){
	let lvl = $('#level option:selected').text();
	
	game.clear();
	game.showSingles = Boolean(lvl == 'Easy');
	game.showAllowed = Boolean(lvl != 'Hard');
	
	if(timer.isRunning()){				
		timer.stop();
	}
	timer.start({precision: 'seconds', startValues: {seconds: seg}});
	$('#pauseButton').prop('disabled', false);
	
	game.board.setString(vec[0],true);
	if(vec.length > 1) 
		game.board.setString(vec[vec.length-1], false, true);
	game.stack=vec;
	game.updateCanvas();
};


$.fn.evaluaTxt = function (txt){/////por implementar
	return false;
}

$('#loadGame').click( () =>{
	let txt = $('#sudokuText').val();
	$().creaCanvas([txt],true);
	$('#load-modal').modal('toggle');
});


$.fn.logoutUsuario = () => {
	usuario = null;

}

$('#btnSave').click(() => {
	usuario.partida.dificultad=level.selectedIndex;
	usuario.partida.sudokuUndo=game.stack;
	//usuario.partida.sudokuUndo[usuario.partida.sudokuUndo.length]=game.stack;
	let tiempo = timer.getTimeValues();
	usuario.partida.tiempo = tiempo.seconds + tiempo.minutes * 60 + tiempo.hours * 3600;
	console.log("GUARDANDO USUARIO: ", usuario);
	localStorage.removeItem('usuario');
	localStorage.setItem('usuario', JSON.stringify(usuario));

	$.ajax({
		type: 'PUT',
		data: JSON.stringify(usuario),
		contentType: 'application/json',
		dataType: 'json',
		url: "api/save"
	}).done(result => {
		console.log("Usuario actualizado, respuesta server: ", result);
	}).fail(err => {
		console.log("error al conectar con el server: ", err);
	});

});

$('#btnRegistro').click(() => {
	console.log("Registro presionado");
	let tiempo = timer.getTimeValues();
	usuario.partida.tiempo=tiempo.seconds + tiempo.minutes * 60 + tiempo.hours * 3600;
	let level=document.getElementById("level");
	usuario.partida.dificultad=level.selectedIndex;
	$.ajax({
		type: 'POST',
		data: JSON.stringify(usuario),
		contentType: 'application/json',
		dataType: 'json',
		url: "api/historial"
	}).done(result => {
		console.log("Historial nuevo: ", result);
	}).fail(err => {
		console.log("error al conectar con el server: ", err);
	});

});

$('#btnLoadRegistro').click(() => {
	console.log("Cargando Registro");
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: "api/historial/"+usuario._id
	}).done(result => {
		console.log("Historiales obtenidos: ", result);
	}).fail(err => {
		console.log("error al conectar con el server: ", err);
	});

});


$(window).on('beforeunload', function(){
	if(usuario){
		usuario.partida.dificultad=level.selectedIndex;
		usuario.partida.sudokuUndo=game.stack;
		let tiempo = timer.getTimeValues();
		usuario.partida.tiempo = tiempo.seconds + tiempo.minutes * 60 + tiempo.hours * 3600;
		localStorage.removeItem('usuario');
		localStorage.setItem('usuario', JSON.stringify(usuario));
	}
	
});

