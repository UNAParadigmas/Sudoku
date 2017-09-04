import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Usuario } from '../../usuario';

@Injectable()
export class LoginService {


  constructor(private http: Http) {
    console.log('Login service corriendo')
  }

  registrarUsuario(usuario:Usuario): Promise<Usuario> {

    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post("api/login", usuario, options).toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleErrorPromise(error: Response | any) {
    console.error(error.message || error);
    return Promise.reject(error.message || error);
  }


}
