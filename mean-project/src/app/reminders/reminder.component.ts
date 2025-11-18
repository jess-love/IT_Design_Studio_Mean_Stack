import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export interface Reminder {
  _id?: string;
  title: string;
  date: string;
  note: string;
  type: 'Assignment' | 'Test' | 'Study Session' | 'Other';
}

@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {
  reminderForm!: FormGroup;
  reminders: Reminder[] = [];
  editingIndex: number | null = null;

  types = ['Assignment', 'Test', 'Study Session', 'Other'];

  private apiUrl = 'http://localhost:3000/reminders';

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      type: ['Assignment', Validators.required],
      note: ['']
    });
    this.loadReminders();
  }

  loadReminders() {
    this.http.get<Reminder[]>(this.apiUrl).subscribe(data => this.reminders = data);
  }

  addReminder() {
    if (this.reminderForm.valid) {
      this.http.post<Reminder>(this.apiUrl, this.reminderForm.value)
        .subscribe(() => {
          this.reminderForm.reset({ type: 'Assignment' });
          this.loadReminders();

          // Scroll the last reminder into view
          setTimeout(() => {
            const lastCard = document.querySelector('.reminder-list .reminder-card:last-child');
            lastCard?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
    }
  }

  editReminder(index: number) {
    this.editingIndex = index;
    this.reminderForm.setValue(this.reminders[index]);
  }

  updateReminder() {
    if (this.editingIndex !== null && this.reminderForm.valid) {
      const reminder = this.reminders[this.editingIndex];
      this.http.put<Reminder>(`${this.apiUrl}/${reminder._id}`, this.reminderForm.value)
        .subscribe(() => {
          this.reminderForm.reset({ type: 'Assignment' });
          const oldIndex = this.editingIndex;
          this.editingIndex = null;
          this.loadReminders();

          // Scroll updated reminder into view
          setTimeout(() => {
            const updatedCard = document.querySelectorAll('.reminder-list .reminder-card')[oldIndex!];
            updatedCard?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        });
    }
  }

  deleteReminder(index: number) {
    const reminder = this.reminders[index];
    if (!reminder._id) return;
    this.http.delete(`${this.apiUrl}/${reminder._id}`)
      .subscribe(() => this.loadReminders());
  }
}