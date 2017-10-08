

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
                var $lg_username = $('#login_username').val();
			var $lg_password = $('#login_password').val();

			console.log("usuario/pass del form: ", $lg_username + "/" + $lg_password);

			$.ajax({
				type: 'POST',
				data: { "user": $lg_username, "pass": $lg_password },
				dataType: 'json',
				url: "api/login"
			}).done((result) => {
				if (result == null) {
					msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "error", "glyphicon-remove", "Login Incorrecto");
				}
				else {

					console.log("Resultado login: " + JSON.stringify(result));
					msgChange($('#div-login-msg'), $('#icon-login-msg'), $('#text-login-msg'), "succes", "glyphicon-ok", "Bienvenido " + result.nombre);
					setTimeout(() => {
						$('#login-modal').modal('hide');
						$('#loginBtn').hide();
						$('#guardarBtn').css('visibility', 'visible');
						$('#cargarBtn').css('visibility', 'visible');
						$('#logoutBtn').css('visibility', 'visible');
						sessionStorage.setItem('usuario', JSON.stringify(result));
						var data = sessionStorage.getItem('usuario');
						var usuario = JSON.parse(data);
						if (usuario.partida.sudokuGuardado) {
							var val = $('#sel1 option:selected').text();
							$().creaCanvas(usuario.partida.sudokuGuardado, val, true, true);
						}
						else if (usuario.partida.sudokuInicial) {
							var val = $('#sel1 option:selected').text();
							$().creaCanvas(usuario.partida.sudokuInicial, val, true, true);
						}
						else {

						}
						//a.partida.nivel = "dificil"
						console.log("parse del json: ", a);
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
             
				if($rg_password !== $rg_password2){
					 msgChange($('#div-register-msg'), $('#icon-register-msg'), $('#text-register-msg'), "error", "glyphicon-remove", "Passwords doesn't match");
					 break;
				}

			   $.ajax({
				type: 'POST',
				data: { "user": $rg_username, "pass": $rg_password, "nombre": $rg_name },
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
						$('#login-modal').modal('hide');
						$('#loginBtn').hide();
						$('#guardarBtn').css('visibility', 'visible');
						$('#cargarBtn').css('visibility', 'visible');
						$('#logoutBtn').css('visibility', 'visible');
						sessionStorage.setItem('usuario', result);
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
  
  let checkSession = () => {
	var data = sessionStorage.getItem('usuario');
	if (data) {
		console.log("data en session storage: ", JSON.parse(data));
		$('#login-modal').modal('hide');
		$('#loginBtn').hide();
		$('#guardarBtn').css('visibility', 'visible');
		$('#cargarBtn').css('visibility', 'visible');
		$('#logoutBtn').css('visibility', 'visible');
	}
}


$("#logoutBtn").click((e) => {
	e.preventDefault();
	sessionStorage.removeItem('usuario');
	$('#login-modal').modal('visible');
	$('#loginBtn').hide();
	$('#guardarBtn').css('visibility', 'hide');
	$('#cargarBtn').css('visibility', 'hide');
	$('#logoutBtn').css('visibility', 'hide');
	$("#divNavBar").load(window.location.href + " #divNavBar"); //recargar el div

});

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