import { Component } from '@angular/core';
import { EstudianteListaComponent } from './components/estudiante-lista/estudiante-lista.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EstudianteListaComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
