let timer = new Timer();
let game = new Game();
let mov = 1;
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

$( document ).on('keydown', e => { // Moves through canvas cell using arrows
	let msg;
	switch (e.keyCode) {
		case 37: game.moveSelection(0 ,-1); break;
		case 38: game.moveSelection(-1, 0); break;
		case 39: game.moveSelection(0 , 1); break;
		case 40: game.moveSelection(1 , 0); break;
		case 8: case 46: msg = game.setDigitInCell(0); break;
		default:
			var key = Number(e.keyCode);
			var digit = key >= 96 ? key - 96 : key - 48;
			if (digit >= 0 && digit <= 9) msg = game.setDigitInCell(digit);
	}	
	if(msg){
		$('#mstack').val($('#mstack').val()+'\t'+(mov++)+'. '+msg+'\n'); 
	}
	if(game.board.isSolved){
		timer.pause();
		let timev = timer.getTimeValues()
		let time = timev.seconds + timev.minutes * 60 + timev.hours * 3600;
		$('#msg').text('Sudoku Solved {time: '+time+ ' seconds}');	
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
	$().creaCanvas("8.5.....2...9.1...3.........6.7..4..2...5...........6....38.....4....7...1.....9.",val,true,true);
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

.fn.creaCanvas = function(vec,seg){
	$('#mstack').val(''); 
	mov = 1;
	
	if(timer.isRunning()){				
		timer.stop();
	}
	game.stack=vec;
	console.log("lenght VEC CREACANVAS: ", vec.length);
	timer.start({precision: 'seconds', startValues: {seconds: seg}});
	$('#pauseButton').prop('disabled', false);
	
	if(vec.length > 1) 
		game.board.setString(vec[vec.length-1], true);
	else game.board.setString(vec[0],true);
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

/**
 * Cargar la lista de sudokus del txt a la base de datos al inicio (primero verificando si ya existen)
 */
$.fn.cargaSudokus = () => {
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: "api/sudoku/import"
	}).done(result => {
		console.log("Cargando sudokus a la base de datos: ", result);

	}).fail(err => {
		console.log("Error al conectar con el servidor para cargar los sudokus", err);
	});
}

$.fn.loginUsuario = function(user){
	usuario = user;
	localStorage.removeItem('usuario');
	localStorage.setItem('usuario', JSON.stringify(usuario));
	console.log("USER = ", usuario);
	if (usuario.partida.sudokuUndo.length>0) {
		console.log("CARGANDO SUDOKU DEL USUARIO LOGEADO");
		$().creaCanvas(usuario.partida.sudokuUndo, usuario.partida.tiempo);
		
	}
	else { //es un usuario nuevo, sin partidas guardadas
		if(game.board.stringAct.length > 1){ //verificar si ya inicio un sudoku
			usuario.partida.sudokuUndo=game.board.stringAct;
			$().creaCanvas([usuario.partida.sudokuUndo], 0);
		}
		else{
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
		}
		
	}
	$("#onStart").hide();
	$("#statusMsg").hide();
	$("#sudoku").show();
}


$.fn.logoutUsuario = () => {
	usuario = null;

}

$('#btnSave').click(() => {
	usuario.partida.dificultad=level.selectedIndex;
	usuario.partida.sudokuUndo=game.stack;
	usuario.partida.sudokuUndo[usuario.partida.sudokuUndo.length]=game.board.stringAct;
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
	console.log("saveGame presionado ", usuario);
	usuario.partida.sudokuGuardado = game.board.getString();
	let tiempo = timer.getTimeValues();
	usuario.partida.tiempo = tiempo.seconds + tiempo.minutes * 60 + tiempo.hours * 3600;
	console.log("Despues de agregar sudoku ", usuario);

	$.ajax({
		type: 'PUT',
		data: JSON.stringify(usuario),
		contentType: 'application/json',
		dataType: 'json',
		url: "api/save"
	}).done(result => {
		console.log("Usuario actualizado, respuesta server: ", result);
		usuario = result;
		localStorage.setItem('usuario', result);
	}).fail(err => {
		console.log("error al conectar con el server: ", err);
	});

});


$('#btnSolve').click(() => {
	let time = game.solve();
	if(game.board.isSolved){
		$('#msg').text('Sudoku Solved {time: '+time+ ' seconds}');
	}else{
		$('#msg').text('Sudoku doesn\'t have solution.');
	}	
	timer.pause();	
});

$(window).on('beforeunload', function(){
	usuario.partida.dificultad=level.selectedIndex;
	usuario.partida.sudokuUndo=game.stack;
	usuario.partida.sudokuUndo[usuario.partida.sudokuUndo.length]=game.board.stringAct;
	let tiempo = timer.getTimeValues();
	usuario.partida.tiempo = tiempo.seconds + tiempo.minutes * 60 + tiempo.hours * 3600;
	localStorage.removeItem('usuario');
	localStorage.setItem('usuario', JSON.stringify(usuario));
});