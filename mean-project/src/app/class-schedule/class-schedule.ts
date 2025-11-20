import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClassScheduleService } from '../../class_schedule.service';
import { RouterModule } from '@angular/router';

interface ClassData {
  _id?: string;    
  className: string;
  professor: string;
  day: string;
  time: string;
}

@Component({
  selector: 'app-class-schedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './class-schedule.html',
  styleUrls: ['./class-schedule.css']
})
export class ClassSchedule {

  protected readonly subtitle = signal('Class Schedule Builder');

  daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  timesOfDay = [
    '7:00 AM', '7:30 AM','8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM',
    '11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM',
    '3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM',
    '7:00 PM','7:30 PM','8:00 PM'
  ];

  private formBuilder = inject(FormBuilder);

  classForm = this.formBuilder.group({
    className:  ['', Validators.required],
    professor:  [''],
    day:        ['', Validators.required],
    time:       ['', Validators.required]
  });

  classSchedules: ClassData[] = [];
  editIndex: number | null = null;
  message = signal('');

  constructor(private _myService: ClassScheduleService) {}

  ngOnInit() {
    this.getClassSchedules();
  }

  getClassSchedules() {
    this._myService.getClassSchedules().subscribe({
      next: (data) => { this.classSchedules = data as ClassData[]; },
      error: (err) => console.error(err)
    });
  }

  onSubmitOrAdd() {
    if (this.editIndex !== null) {
      this.updateClass();
    } else {
      this.addClassSchedule();
    }
  }

  addClassSchedule() {
  if (!this.classForm.valid) return;

  const newSchedule: ClassData = {
    className: this.classForm.value.className!.trim(),
    professor: this.classForm.value.professor!.trim(),
    day: this.classForm.value.day!.trim(),
    time: this.classForm.value.time!.trim()
  };

  this._myService.addClassSchedules(
  newSchedule.className,
  newSchedule.professor,
  newSchedule.day,
  newSchedule.time
).subscribe({
  next: (created: ClassData) => {
    this.classSchedules.push(created); // now created has all data
    this.message.set('Class schedule added successfully!');
    this.classForm.reset();
    this.editIndex = null;
    setTimeout(() => this.message.set(''), 3000);
  },
  error: (err) => {
    console.error(err);
    this.message.set('Failed to save class schedule');
    setTimeout(() => this.message.set(''), 3000);
  }
});

}


  editClass(index: number) {
    const cls = this.classSchedules[index];
    this.classForm.setValue({
      className: cls.className,
      professor: cls.professor,
      day: cls.day,
      time: cls.time
    });
    this.editIndex = index;
  }


  updateClass() {
  if (this.editIndex === null) return;
  const cls = this.classSchedules[this.editIndex];
  if (!cls._id) return;

  const updated: ClassData = {
    className: this.classForm.value.className!.trim(),
    professor: this.classForm.value.professor!.trim(),
    day: this.classForm.value.day!.trim(),
    time: this.classForm.value.time!.trim()
  };

  this._myService.updateClass(cls._id, updated).subscribe({
    next: (res) => {
      this.getClassSchedules(); // refetch list
      this.message.set('Class schedule updated');
      this.classForm.reset();
      this.editIndex = null;
      setTimeout(() => this.message.set(''), 3000);
    },
    error: (err) => console.error(err)
  });
}



  removeClass(index: number) {
  const cls = this.classSchedules[index];
  if (!cls._id) return;

  this._myService.deleteClassSchedule(cls._id).subscribe({
    next: () => {
      this.classSchedules.splice(index, 1);
      this.message.set('Class schedule deleted ✅');
      setTimeout(() => this.message.set(''), 3000);
    },
    error: (err) => {
      console.error(err);
      this.message.set('Failed to delete class schedule');
      setTimeout(() => this.message.set(''), 3000);
    }
  });
}

}
