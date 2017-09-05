import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login/login.service';
import { Usuario } from '../../usuario';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  usuario = new Usuario();
  errorMessage: String;
  logueado = false;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  onRegister(e: Event) {

    e.preventDefault();

    this.usuario = {
      nombre: e.target[0].value,
      usuario: e.target[1].value,
      pass: e.target[2].value,
      partida: null
    }
    console.log("Register form", this.usuario);

    this.loginService.registrarUsuario(this.usuario)
      .subscribe(user => {
        console.log("Usuario Registrado: ", user.nombre);
        this.errorMessage = null;
        this.usuario = user;
        this.logueado = true;
      },
      error => this.errorMessage = <any>error);

    console.log("Usuario que viene del post: ", this.usuario);
  }


  onLogin(e: Event): void {
    e.preventDefault();


    this.usuario = {
      nombre: "",
      usuario: e.target[0].value,
      pass: e.target[1].value,
      partida: null
    }

    this.loginService.loginUsuario(this.usuario)
      .subscribe(user => { this.usuario = user; this.logueado = true; },
      error => this.errorMessage = <any>error);

  }


}

