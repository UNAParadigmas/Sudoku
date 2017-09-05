import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Usuario } from '../../usuario';

@Injectable()
export class LoginService {

  url = "api/login";

  constructor(private http: Http) {
    console.log('Login service corriendo')
  }

  registrarUsuario(usuario: Usuario): Observable<Usuario> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.url, usuario, options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }

  loginUsuario(usuario: Usuario): Observable<Usuario> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = new RequestOptions({ headers: headers });
    console.log('usuario en login service:', usuario)
    return this.http.get(this.url + '/' + usuario.usuario + '/' + usuario.pass, options)
      .map(this.extractData)
      .catch(this.handleErrorObservable);
  }



  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleErrorObservable(error: Response | any) {
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }



}
