import { Component, inject, signal } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-schedule',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './class-schedule.html',
  styleUrl: './class-schedule.css'
})

export class ClassSchedule {
  protected readonly subtitle = signal('Class Schedule Builder');

  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

   timesOfDay: string[] = [
    '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM','9:00 AM', '9:30 AM','10:00 AM', '10:30 AM','11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM','1:00 PM', '1:30 PM','2:00 PM', '2:30 PM','3:00 PM', '3:30 PM','4:00 PM', '5:30 PM',
    '5:00 PM', '5:30 PM','6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM','8:00 PM'
  ];

  private formBuilder = inject(FormBuilder);

  scheduleForm = this.formBuilder.group({
    classes: this.formBuilder.array([this.createClass()])
  });

  get classes(): FormArray {
    return this.scheduleForm.get('classes') as FormArray;
  }

  createClass(): FormGroup {
    return this.formBuilder.group({
      className: ['', Validators.required],
      professor: [''],
      time: ['', Validators.required],
      day: ['', Validators.required]
    });
  }

  addclass(): void {
    this.classes.push(this.createClass());
  }

  removeClass(index: number): void {
    this.classes.removeAt(index);
  }

   updateProfile() {
  this.classes.controls.forEach(singleClass => {
    singleClass.patchValue({
      className: 'Nancy',
      professor: 'Mr. Smith',
      time: '10:00 AM',
      day: 'Monday'
    });
  });
}

  

}
