import { Component, OnInit } from '@angular/core';
import { LoginService} from '../../services/login/login.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private loginService:LoginService) { }

  ngOnInit() {
  }

}
