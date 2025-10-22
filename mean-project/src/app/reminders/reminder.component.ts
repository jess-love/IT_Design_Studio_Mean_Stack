import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Reminder {
  title: string;
  date: string;
  note: string;
  type: 'Assignment' | 'Test' | 'Study Session' | 'Other';
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
  editingIndex: number | null = null;

  types = ['Assignment', 'Test', 'Study Session', 'Other'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required],
      type: ['Assignment', Validators.required],
      note: ['']
    });
  }

  addReminder() {
    if (this.reminderForm.valid) {
      this.reminders.push(this.reminderForm.value);
      this.reminderForm.reset({ type: 'Assignment' });
    }
  }

  editReminder(index: number) {
    this.editingIndex = index;
    this.reminderForm.setValue(this.reminders[index]);
  }

  updateReminder() {
    if (this.editingIndex !== null && this.reminderForm.valid) {
      this.reminders[this.editingIndex] = this.reminderForm.value;
      this.reminderForm.reset({ type: 'Assignment' });
      this.editingIndex = null;
    }
  }

  deleteReminder(index: number) {
    this.reminders.splice(index, 1);
    if (this.editingIndex === index) {
      this.reminderForm.reset({ type: 'Assignment' });
      this.editingIndex = null;
    }
  }
}
