import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  result: any;

  constructor(private http: Http) {
    console.log('Login service corriendo')
  }

  registrarUsuario(body) {

    let headers = new Headers({'dataType': 'json'});
    let options = new RequestOptions({headers: headers});

    return this.http.post("/api/login", body, options)
      .map(res => res.json());
  }

  

}
