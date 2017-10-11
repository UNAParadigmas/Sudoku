$(function () {
	let $formLogin = $('#login-form');
	let $formLost = $('#lost-form');
	let $formRegister = $('#register-form');
	let $divForms = $('#div-forms');
	let $modalAnimateTime = 300;
	let $msgAnimateTime = 150;
	let $msgShowTime = 2000;

	$("form").submit(function (e) {
		e.preventDefault();
		switch (this.id) {
			case "login-form":
				let $lg_username = $('#login_username').val();
				let $lg_password = $('#login_password').val();
				let loginData = { user: $lg_username, pass: $lg_password };
				console.log("usuario/pass del form: ", $lg_username + "/" + $lg_password);

				$.ajax({
					type: 'POST',
					data: JSON.stringify(loginData),
					contentType: 'application/json',
					dataType: 'json',
					url: "api/login"
				}).done((result) => {
					if (result == null) {
						msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Login Incorrecto");
					}
					else {

						let user=JSON.stringify(result);
						console.log("Resultado login: " + user);
						msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "succes", "glyphicon-ok", "Bienvenido " + result.nombre);
						setTimeout(() => {
							hideLogin();
							localStorage.setItem('usuario', user);
							$().loginUsuario(result);
						}, 1000);
					}

				}).catch(err => {
					msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Login error");
				});
				break;

			case "register-form":
				let $rg_username = $('#register_username').val();
				let $rg_name = $('#register_name').val();
				let $rg_password = $('#register_password').val();
				let $rg_password2 = $('#register_password2').val();
				let registerData = { user: $rg_username, pass: $rg_password, nombre: $rg_name };

				if ($rg_password !== $rg_password2) {
					msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "Passwords doesn't match");
					break;
				}

				$.ajax({
					type: 'POST',
					data: JSON.stringify(registerData),
					contentType: 'application/json',
					dataType: 'json',
					url: "api/registro"
				}).done((result) => {

					if (result == null) {
						msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "Error al registrar");
					}
					else {
						console.log("Resultado del registro: " + result);
						msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "succes", "glyphicon-ok", "Bienvenido " + result.nombre);
						setTimeout(() => {
							hideLogin();
							localStorage.setItem('usuario', result);
							$().loginUsuario(result);
						}, 1000);
					}

				}).catch(err => {
					msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", err);
				});

				break;
			default:
				return false;
		}
		return false;
	});

	$.fn.checkSession = () => {
		let data = localStorage.getItem('usuario');
		if(data=="[object Object]"){
			localStorage.removeItem('usuario');
			console.log("No hay datos de usuario en el local storage");
		}
		else if (data!==null ) {
			data=JSON.parse(data);
			console.log("usuario en local storage: ", data);
			hideLogin();
			$().loginUsuario(data);
		}
		else {
			console.log("No hay datos de usuario en el local storage");
		}
	}


	$("#logoutBtn").click(e => {
		e.preventDefault();
		$().logoutUsuario();
		localStorage.removeItem('usuario');
		$('#loginBtn').show();
		$('#logoutBtn').hide();
		$("#divNavBar").load(window.location.href + " #divNavBar"); //recargar el div
		$("#sudoku").show();
		$("#onStart").hide();
		$("#statusMsg").hide();
		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: "api/sudoku/newSudoku"
		})
			.done(result => {
				var val = $('#sel1 option:selected').text();
				console.log("Nuevo sudoku: ", result.hilera);
				$().creaCanvas(result.hilera, val, true, true);
			})
			.fail(err => {
				console.log("error de conexion con backend: ");
				var val = $('#sel1 option:selected').text();
				$().creaCanvas("8.5.....2...9.1...3.........6.7..4..2...5...........6....38.....4....7...1.....9.", val, true, true);
			});

	});





	function hideLogin() {
		$('#login-modal').modal('hide');
		$('#loginBtn').hide();
		$('#logoutBtn').css('visibility', 'visible');
	}



	$('#login_register_btn').click(function () { modalAnimate($formLogin, $formRegister) });
	$('#register_login_btn').click(function () { modalAnimate($formRegister, $formLogin); });
	$('#login_lost_btn').click(function () { modalAnimate($formLogin, $formLost); });
	$('#lost_login_btn').click(function () { modalAnimate($formLost, $formLogin); });
	$('#lost_register_btn').click(function () { modalAnimate($formLost, $formRegister); });
	$('#register_lost_btn').click(function () { modalAnimate($formRegister, $formLost); });

	function modalAnimate($oldForm, $newForm) {
		let $oldH = $oldForm.height();
		let $newH = $newForm.height();
		$divForms.css("height", $oldH);
		$oldForm.fadeToggle($modalAnimateTime, function () {
			$divForms.animate({ height: $newH }, $modalAnimateTime, function () {
				$newForm.fadeToggle($modalAnimateTime);
			});
		});
	}

	function msgFade($msgId, $msgText) {
		$msgId.fadeOut($msgAnimateTime, function () {
			$(this).text($msgText).fadeIn($msgAnimateTime);
		});
	}
	function msgChange($divTag, $iconTag, $textTag, $divClass, $iconClass, $msgText) {
		let $msgOld = $divTag.text();
		msgFade($textTag, $msgText);
		$divTag.addClass($divClass);
		$iconTag.removeClass("glyphicon-chevron-right");
		$iconTag.addClass($iconClass + " " + $divClass);
		setTimeout(function () {
			msgFade($textTag, $msgOld);
			$divTag.removeClass($divClass);
			$iconTag.addClass("glyphicon-chevron-right");
			$iconTag.removeClass($iconClass + " " + $divClass);
		}, $msgShowTime);
	}
});

/* #####################################################################
   #
   #   Project       : Modal Login with jQuery Effects
   #   Author        : Rodrigo Amarante (rodrigockamarante)
   #   Version       : 1.0
   #   Created       : 07/28/2015
   #   Last Change   : 08/02/2015
   #
   ##################################################################### */