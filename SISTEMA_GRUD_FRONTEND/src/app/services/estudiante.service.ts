import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estudiante, EstudianteResponse } from '../models/estudiante.model';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private apiUrl = 'http://localhost:3000/api/estudiantes';

  constructor(private http: HttpClient) {}

  getEstudiantes(search: string = '', page: number = 1, limit: number = 5): Observable<EstudianteResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<EstudianteResponse>(this.apiUrl, { params });
  }

  createEstudiante(estudiante: Estudiante): Observable<any> {
    return this.http.post(this.apiUrl, estudiante);
  }

  updateEstudiante(id: number, estudiante: Estudiante): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, estudiante);
  }

  deleteEstudiante(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
