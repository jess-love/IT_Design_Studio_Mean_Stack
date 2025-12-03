import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReminderService } from './reminder.service';

export interface Reminder {
  _id?: string; //MongoDBID
  title: string;
  date: string;
  time: string;
  type: 'Assignment' | 'Test' | 'Study Session' | 'Other';
  description: string;
}

@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit {
  reminderForm!: FormGroup;
  reminders: Reminder[] = [];
  editingId: string | null = null;

  types = ['Assignment', 'Test', 'Study Session', 'Other'];

  constructor(private fb: FormBuilder, private reminderService: ReminderService) {}

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      type: ['Assignment', Validators.required],
      description: ['']
    });

    this.loadReminders();
  }

  connectGoogle() {
    window.location.href = 'http://localhost:8000/auth/google';
  }

  loadReminders() {
    this.reminderService.getReminders().subscribe({
      next: (data) => this.reminders = data,
      error: (err) => console.error(err)
    });
  }

  submitReminder() {
    if (this.reminderForm.invalid) return;

    const reminder: Reminder = this.reminderForm.value;

    if (this.editingId) {
      this.reminderService.updateReminder(this.editingId, reminder).subscribe({
        next: (updated) => {
          const index = this.reminders.findIndex(r => r._id === this.editingId);
          if (index > -1) this.reminders[index] = updated;
          this.reminderForm.reset({ type: 'Assignment' });
          this.editingId = null;
        },
        error: (err) => console.error(err)
      });
    } else {
      this.reminderService.addReminder(reminder).subscribe({
        next: (newReminder) => {
          this.reminders.push(newReminder);
          this.reminderForm.reset({ type: 'Assignment' });
        },
        error: (err) => console.error(err)
      });
    }
  }

  editReminder(reminder: Reminder) {
    this.editingId = reminder._id || null;
    this.reminderForm.setValue({
      title: reminder.title,
      date: reminder.date,
      time: reminder.time,
      type: reminder.type,
      description: reminder.description || ''
    });
  }

  deleteReminder(reminder: Reminder) {
    if (!reminder._id) return;
    this.reminderService.deleteReminder(reminder._id).subscribe({
      next: () => this.reminders = this.reminders.filter(r => r._id !== reminder._id),
      error: (err) => console.error(err)
    });
  }
}