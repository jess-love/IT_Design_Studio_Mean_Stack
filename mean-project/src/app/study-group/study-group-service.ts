import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudyGroup {
  _id?: string;        // MongoDB ID
  groupName: string;
  course: string;
  location: string;
  studyDate: string;
  studyTime: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {

  private apiUrl = 'http://localhost:8000/studygroups';

  constructor(private http: HttpClient) {}


  createGroup(group: StudyGroup): Observable<StudyGroup> {
    return this.http.post<StudyGroup>(this.apiUrl, group);
  }


  getGroups(): Observable<StudyGroup[]> {
    return this.http.get<StudyGroup[]>(this.apiUrl);
  }

 
  getGroup(id: string): Observable<StudyGroup> {
    return this.http.get<StudyGroup>(`${this.apiUrl}/${id}`);
  }


  updateGroup(id: string, group: Partial<StudyGroup>): Observable<StudyGroup> {
    return this.http.put<StudyGroup>(`${this.apiUrl}/${id}`, group);
  }


  deleteGroup(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}