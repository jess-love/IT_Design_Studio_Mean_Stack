import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../assignment.service';

@Component({
  selector: 'app-assignment-tracker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assignment-tracker.html',
  styleUrls: ['./assignment-tracker.css']
})
export class AssignmentTracker implements OnInit {

  assignmentForm: FormGroup;
  assignments: any[] = [];

  // Editing state
  editingIndex: number | null = null;
  isEditing: boolean = false;

  // Auto-fill subject map
  courseMap: { [key: string]: string } = {
    'Introduction to History': 'History',
    'Introduction to Biology': 'Biology',
    'Algebra 2': 'Math',
    'English Literature': 'English',
    'General Chemistry': 'Science',
    'Database Concepts': 'Database',
    'Fundamentals of Health': 'Health'
  };

  constructor(
    private fb: FormBuilder,
    private assignmentService: AssignmentService
  ) {

    // Form setup
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      subject: ['', Validators.required],
      priority: ['Medium'],
      status: ['Pending']
    });

    // Auto-fill subject based on title
    this.assignmentForm.get('title')?.valueChanges.subscribe(title => {
      const match = Object.keys(this.courseMap).find(
        key => key.toLowerCase() === title?.toLowerCase()
      );

      if (match) {
        this.assignmentForm.patchValue({ subject: this.courseMap[match] });
      }
    });
  }

  // Load assignments on page load
  ngOnInit(): void {
    this.assignmentService.getAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        console.log("Loaded assignments from DB:", data);
      },
      error: (err) => console.error("Error loading assignments:", err)
    });
  }

  // CREATE or UPDATE assignment
  onSubmit() {
    if (!this.assignmentForm.valid) return;

    const formData = this.assignmentForm.value;

    // ===== UPDATE MODE =====
    if (this.isEditing && this.editingIndex !== null) {
      const assignment = this.assignments[this.editingIndex];

      if (!assignment._id) {
        console.error("Cannot update: assignment has no _id.");
        return;
      }

      this.assignmentService.updateAssignment(assignment._id, formData).subscribe({
        next: (updated) => {
          console.log("Updated in backend:", updated);

          // Update UI
          this.assignments[this.editingIndex!] = updated;

          // Reset editing states
          this.isEditing = false;
          this.editingIndex = null;

          // Reset form
          this.assignmentForm.reset({
            priority: 'Medium',
            status: 'Pending'
          });
        },
        error: (err) => console.error("Update error:", err)
      });

      return;
    }

    // ===== CREATE MODE =====
    this.assignmentService.addAssignment(formData).subscribe({
      next: (createdAssignment) => {
        console.log("Created:", createdAssignment);

        // Add to UI with _id
        this.assignments.push(createdAssignment);

        // Reset form
        this.assignmentForm.reset({
          priority: 'Medium',
          status: 'Pending'
        });
      },
      error: (err) => console.error("Create error:", err)
    });
  }

  // Load assignment into form for editing
  editAssignment(index: number): void {
    const assignment = this.assignments[index];

    this.assignmentForm.setValue({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      subject: assignment.subject,
      priority: assignment.priority,
      status: assignment.status
    });

    this.isEditing = true;
    this.editingIndex = index;
  }

  // DELETE assignment
  removeAssignment(index: number): void {
    const assignment = this.assignments[index];

    if (!assignment._id) {
      console.error("Cannot delete: assignment has no _id.");
      return;
    }

    this.assignmentService.deleteAssignment(assignment._id).subscribe({
      next: () => {
        console.log("Deleted from backend:", assignment._id);

        // Remove from UI
        this.assignments.splice(index, 1);

        // Reset edit state if needed
        if (this.isEditing && this.editingIndex === index) {
          this.assignmentForm.reset({
            priority: 'Medium',
            status: 'Pending'
          });
          this.isEditing = false;
          this.editingIndex = null;
        }
      },
      error: (err) => console.error("Delete error:", err)
    });
  }
}
