import { Component, OnInit } from '@angular/core';
import { LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  
  newUsuario: Usuario;

  constructor(private loginService:LoginService) { }

  ngOnInit() {
    
  }

  onRegister(e: Event) {
    e.preventDefault();
    this.newUsuario={
      nombre: e.target[0].value,
      usuario: e.target[1].value,
      pass: e.target[2].value
    }
    console.log("Register form", this.newUsuario);
    console.log(this.loginService.registrarUsuario(this.newUsuario).map((val)=> val));

  }

  onLogin(e: Event) {
    e.preventDefault();
    console.log("Login form", event);
  }

}

interface Usuario{
  nombre: string,
	usuario: string,
	pass: string
}