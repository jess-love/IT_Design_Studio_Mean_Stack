import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reminder } from './reminder.component';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'http://localhost:3000/reminders'; 
  constructor(private http: HttpClient) { }

  getReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.apiUrl);
  }

  addReminder(reminder: Reminder): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, reminder);
  }

  updateReminder(id: string, reminder: Reminder): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder);
  }

  deleteReminder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}