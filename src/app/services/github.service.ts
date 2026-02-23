import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { GithubRepo } from '../models/github-repo.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private apiUrl = 'https://api.github.com/users';

  constructor(private http: HttpClient) {}

  getPublicRepos(username: string): Observable<GithubRepo[]> {
    return this.http
      .get<GithubRepo[]>(`${this.apiUrl}/${username}/repos?per_page=100`)
      .pipe(
        map((repos) => repos.filter((r) => !r.private)),
        catchError(this.handleError),
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let msg = 'Error al conectar con GitHub.';
    if (error.status === 404) msg = 'Usuario de GitHub no encontrado.';
    if (error.status === 403) msg = 'Límite de requests de GitHub alcanzado.';
    return throwError(() => new Error(msg));
  }
}
