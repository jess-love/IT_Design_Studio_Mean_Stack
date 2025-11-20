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
    studyDay: '',
    userId: ''
  };

  constructor(private studyGroupService: StudyGroupService) {}

  ngOnInit() {
    this.loadGroups();
  }

  // LOAD ALL GROUPS FROM DB
  loadGroups() {
    this.studyGroupService.getGroups().subscribe(data => {
      this.groups = data;
    });
  }

  // CREATE OR UPDATE
  onSubmit() {
    if (this.currentGroup._id) {
      // UPDATE
      this.studyGroupService.updateGroup(this.currentGroup._id, this.currentGroup)
        .subscribe(() => {
          alert('Study Group Updated Successfully!');
          this.loadGroups();
          this.resetForm();
        });
    } else {
      // CREATE
      this.studyGroupService.createGroup(this.currentGroup)
        .subscribe(() => {
          alert('Study Group Created Successfully!');
          this.loadGroups();
          this.resetForm();
        });
    }
  }

  // EDIT BUTTON
  editGroup(group: StudyGroupModel) {
    this.currentGroup = { ...group };
  }

  // DELETE
  deleteGroup(id: string) {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteGroup(id)
        .subscribe(() => {
          alert('Study Group Deleted Successfully!');
          this.loadGroups();
        });
    }
  }

  // CLEAR FORM
  resetForm() {
    this.currentGroup = {
      groupName: '',
      course: '',
      location: '',
      studyDay: '',
      userId: ''
    };
  }
}