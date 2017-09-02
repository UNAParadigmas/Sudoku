import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class LoginService {

  constructor(public http:Http) { 
    console.log('Login service corriendo')
  }

}
