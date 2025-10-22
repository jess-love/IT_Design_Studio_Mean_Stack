import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'http://localhost:3000/reminders'; // The Express backend 

  constructor(private http: HttpClient) { }

  getReminders(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addReminder(reminder: any): Observable<any> {
    return this.http.post(this.apiUrl, reminder);
  }

  updateReminder(index: number, reminder: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${index}`, reminder);
  }

  deleteReminder(index: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${index}`);
  }
}