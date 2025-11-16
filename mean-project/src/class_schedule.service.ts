import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ClassScheduleService {
  private baseUrl = 'http://localhost:8000/class_schedules';

  constructor(private http: HttpClient) {}

  getClassSchedules(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  addClassSchedules(className: string, professor: string, day: string, time: string): Observable<any> {
    return this.http.post(this.baseUrl, { className, professor, day, time }, httpOptions);
  }

  updateClass(id: string, updated: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, updated, httpOptions);
  }

  deleteStudent(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
