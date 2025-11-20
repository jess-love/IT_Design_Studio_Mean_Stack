import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiUrl = 'http://localhost:8000/assignments';

  constructor(private http: HttpClient) {}

  // GET all assignments
  getAssignments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // POST new assignment
  addAssignment(assignment: any): Observable<any> {
    return this.http.post(this.apiUrl, assignment);
  }

  // DELETE assignment by ID
  deleteAssignment(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // UPDATE assignment by ID  ← NEW
  updateAssignment(id: string, assignment: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, assignment);
  }
}
