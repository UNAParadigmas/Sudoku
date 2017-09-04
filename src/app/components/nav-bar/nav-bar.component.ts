import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuario: Usuario;
  nombreUsuario: String;

  constructor(private loginService: LoginService) { }

  ngOnInit() { 
    this.usuario=new Usuario();
  }

  onRegister(e: Event): void {

    e.preventDefault();

    this.usuario={
      nombre: e.target[0].value,
      usuario: e.target[1].value,
      pass: e.target[2].value
    }
    console.log("Register form", this.usuario);

    this.loginService.registrarUsuario(this.usuario)
      .then(user => {
        console.log("Usuario Registrado: ", user.nombre);
        this.usuario=user;
      },
      error => console.log("Error al registrar"));

      console.log("Usuario que viene del post: ",Usuario);
  }


  onLogin(e: Event) {
    e.preventDefault();
    console.log("Login form", event);
  }

}

