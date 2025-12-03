import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudyGroupService, StudyGroup as StudyGroupModel } from './study-group-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-study-group',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './study-group.html',
  styleUrls: ['./study-group.css']
})
export class StudyGroup {

  groups: StudyGroupModel[] = [];

  currentGroup: StudyGroupModel = {
    groupName: '',
    course: '',
    location: '',
    studyDate: '',
    studyTime: '',
  };

  constructor(private studyGroupService: StudyGroupService) {}

  ngOnInit() {
    this.loadGroups();
  }

  connectGoogle() {
    window.location.href = 'http://localhost:8000/auth/google';
  }

  loadGroups() {
    this.studyGroupService.getGroups().subscribe(data => {
      this.groups = data;
    });
  }

  convertTo12Hour(time: string): string {
    if (!time) return "";
    let [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  onSubmit() {
    if (this.currentGroup._id) {
      this.studyGroupService.updateGroup(this.currentGroup._id, this.currentGroup)
        .subscribe(() => {
          alert('Study Group Updated Successfully!');
          this.loadGroups();
          this.resetForm();
        });
    } else {
      this.studyGroupService.createGroup(this.currentGroup)
        .subscribe(() => {
          alert('Study Group Created Successfully!');
          this.loadGroups();
          this.resetForm();
        });
    }
  }

  editGroup(group: StudyGroupModel) {
    this.currentGroup = { ...group };
  }

  deleteGroup(id: string) {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteGroup(id).subscribe(() => {
        alert('Study Group Deleted Successfully!');
        this.loadGroups();
      });
    }
  }

  resetForm() {
    this.currentGroup = {
      groupName: '',
      course: '',
      location: '',
      studyDate: '',
      studyTime: '',
    };
  }
}