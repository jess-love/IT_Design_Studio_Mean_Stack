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
  currentGroup: Partial<StudyGroupModel> = {};

  constructor(private studyGroupService: StudyGroupService) {}

  ngOnInit() {
    this.groups = this.studyGroupService.getGroups();
  }

  onSubmit() {
    if (this.currentGroup.id) {
      this.studyGroupService.updateGroup(this.currentGroup.id, this.currentGroup);
      alert('Study Group Updated Successfully!');
    } else {
      this.studyGroupService.addGroup(this.currentGroup as Omit<StudyGroupModel, 'id'>);
      alert('Study Group Created Successfully!');
    }
    this.refreshList();
    this.resetForm();
  }

  editGroup(group: StudyGroupModel) {
    this.currentGroup = { ...group };
  }

  deleteGroup(id: number) {
    if (confirm('Are you sure you want to delete this study group?')) {
      this.studyGroupService.deleteGroup(id);
      alert('Study Group Deleted Successfully!');
      this.refreshList();
    }
  }

  resetForm() {
    this.currentGroup = {};
  }

  refreshList() {
    this.groups = this.studyGroupService.getGroups();
  }
}