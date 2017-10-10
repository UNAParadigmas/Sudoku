let timer = new Timer();
let game = new Game();
var usuario;
window.game = game;
/* DOCUMENT CONTROL*/


$(document).ready(function () {
	$().cargaSudokus();
	$().checkSession();
	//$('.logged').hide();
	$("#onPause").hide();
	$("#sudoku").hide();

	$('#pauseButton').prop('disabled', true);
	$('#btnAccept').prop('disabled', true);
	//$('#btnSolve').prop('disabled', true);
	$('#btnHint').prop('disabled', true);
	$('#btnUndo').prop('disabled', true);
});

$(document).on('keydown', function (e) {
	switch (e.keyCode) {
		case 37: game.moveSelection(0, -1); break;
		case 38: game.moveSelection(-1, 0); break;
		case 39: game.moveSelection(0, 1); break;
		case 40: game.moveSelection(1, 0); break;
		case 8: case 46: game.setDigitInCell(0); break;
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

	$("#sudoku").show();
	$("#onStart").hide();
	$("#statusMsg").hide();

	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: "api/sudoku/newSudoku"
	})
		.done((result) => {
			var val = $('#sel1 option:selected').text();
			console.log("Nuevo sudoku: ", result.hilera);
			$().creaCanvas(result.hilera, val, true, true);
		})
		.fail((err) => {
			console.log("error de conexion con backend: ");
			var val = $('#sel1 option:selected').text();
			$().creaCanvas("8.5.....2...9.1...3.........6.7..4..2...5...........6....38.....4....7...1.....9.", val, true, true);
		});

});


/*CANVAS CONTROL*/

$('#canvas').on('mousedown', function (e) {
	var x = e.pageX - this.offsetLeft;
	var y = e.pageY - this.offsetTop;
	var coords = $().relMouseCoords(e);
	game.selectCell(Math.floor(coords.y / game.CellSize), Math.floor(coords.x / game.CellSize));
});

$("#sel1").change(function () {
	$('#dificultad').prop('hidden', (this.value != '9x9'));
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

$.fn.creaCanvas = function (txt, val, time = false, init = false) {
	var aux = $('#level option:selected').text();
	var dif = (val !== '9x9' || aux === 'Fácil') ? 1 : (aux === 'Normal') ? 2 : 3;
	showAllowed = dif === 1;

	//$('#panelMsg').prop('hidden', false);
	//$('#message').prop('hidden',false);
	//$('#message').text('Juego Nuevo');

	$('#size').text(val + ((val == '9x9') ? " " + aux : ""));
	if (time && timer.isRunning()) {
		timer.stop();
	}
	timer.start("00:00:00");
	$('#pauseButton').prop('disabled', false);

	game.board.setString(txt, init);
	game.updateCanvas();
};

$.fn.evaluaTxt = function (txt) {/////por implementar
	return false;
}

$('#loadGame').click(() => {
	let txt = $('#sudokuText').val();
	$().creaCanvas(txt, $('#sel1 option:selected').text(), true);
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
	}).done((result) => {
		console.log("Cargando sudokus a la base de datos: ", result);

	}).fail(err => {
		console.log("Error al conectar con el servidor para cargar los sudokus", err);
	});
}

$.fn.loginUsuario = (user) => {
	usuario = user;

	let val = $('#sel1 option:selected').text();
	if (usuario.partida.sudokuGuardado) {
		console.log("sudoku a partir de Guardado");

		$().creaCanvas(usuario.partida.sudokuGuardado, val, true, true);
	}
	else if (usuario.partida.sudokuUndo[usuario.partida.sudokuUndo.length - 1]) {
		console.log("sudoku a partir de ultimo undo");
		$().creaCanvas(usuario.partida.sudokuInicial, val, true, true);
	}
	else {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: "api/newSudoku"
		})
			.done((result) => {
				console.log("No hay sudokus guardados, creando nuevo: ", result.hilera);
				$().creaCanvas(result.hilera, val, true, true);
			})
			.fail((err) => {
				console.log("error de conexion con backend: ");
				$().creaCanvas("8.5.....2...9.1...3.........6.7..4..2...5...........6....38.....4....7...1.....9.", val, true, true);
			});
	}
	/*let tiempo = usuario.partida.tiempo;
	if (tiempo) {
		let horas = Math.floor(tiempo / 3600);
		let minutos = Math.floor(tiempo / 60);
		let segundos = tiempo - (horas * 3600 + minutos * 60);
		timer.start(`${horas}:${minutos}:${segundos}`);
	}*/
	$("#sudoku").show();
	$("#onStart").hide();
	$("#statusMsg").hide();
	console.log("SUDOKU GUARDADO: ", "" + usuario.partida.sudokuGuardado);
}


$.fn.logoutUsuario = () => {
	usuario = null;

}

$('#btnSave').click(() => {
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
	}).done((result) => {
		console.log("Usuario actualizado, respuesta server: ", result);
		usuario = result;
		localStorage.setItem('usuario', result);
	}).fail((err) => {
		console.log("error al conectar con el server: ", err);
	});

});