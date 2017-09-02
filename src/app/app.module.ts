import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SudokuComponent } from './components/sudoku/sudoku.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

//Servicios creados
import { LoginService } from './services/login/login.service';

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
