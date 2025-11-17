import { Injectable } from '@angular/core';

export interface StudyGroup {
  id: number;
  name: string;
  course: string;
  location: string;
  day: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudyGroupService {
  private groups: StudyGroup[] = [
    { id: 1, name: 'Math Masters', course: 'Calculus I', location: 'Library Room 2', day: 'Monday', userId: 'U101' },
    { id: 2, name: 'Code Crew', course: 'Intro to Programming', location: 'Online (Zoom)', day: 'Wednesday', userId: 'U202' },
    { id: 3, name: 'Bio Buddies', course: 'Biology 101', location: 'Science Building 5', day: 'Friday', userId: 'U303' }
  ];

  private nextId = 4;


  getGroups(): StudyGroup[] {
    return this.groups;
  }

  addGroup(group: Omit<StudyGroup, 'id'>): void {
    this.groups.push({ id: this.nextId++, ...group });
  }

  updateGroup(id: number, updatedGroup: Partial<StudyGroup>): void {
    const index = this.groups.findIndex(g => g.id === id);
    if (index !== -1) {
      this.groups[index] = { ...this.groups[index], ...updatedGroup };
    }
  }

  deleteGroup(id: number): void {
    this.groups = this.groups.filter(g => g.id !== id);
  }
}