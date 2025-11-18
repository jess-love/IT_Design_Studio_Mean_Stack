import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assignment-tracker',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './assignment-tracker.html',
  styleUrl: './assignment-tracker.css'
})
export class AssignmentTracker {
    assignmentForm: FormGroup;

    assignments = [
      {
        title: 'Introduction to History',
        description: 'Read To Kill A Mockingbird and Write a Summary',
        dueDate : 'November 5th, 2025',
        subject: 'History',
        priority: 'Low',
        status: 'pending',
      },
        {
          title: 'Introduction to Biology',
        description: 'Lab on Tuesday and Thursday',
        dueDate : 'November 19th, 2025',
        subject: 'Biology',
        priority: 'High',
        status: 'pending',

        },
        {
          title: 'Algebra 2',
        description: 'Calculus',
        dueDate : 'January 5th, 2025',
        subject: 'Math',
        priority: 'Moderate',
        status: 'pending',

      },
      {
           title: 'Database Concepts',
        description: 'Advanced SQL, Java',
        dueDate : 'Feburary 19th, 2025',
        subject: 'Math',
        priority: 'Moderate',
        status: 'pending',
      },
    ];
  
      //Updating Coures Assignment
      editingIndex: number | null = null; 
      isEditing: boolean = false; 


    //adding courseMap
    courseMap: { [Key: string]: string} ={
        'Introduction to History' : 'History',
        'Introduction to Biology' : 'Biology',
        'Algebra 2': 'Math',
        'English Literature' : 'English',
        'General Chemistry' : 'Science',
        'Database Concepts' : 'Database',
        'Fundamentals of Health': 'health'

    };

    //creating the form
     constructor(private fb: FormBuilder) {
    this.assignmentForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      subject: ['', Validators.required],
      priority: ['Medium'],  
      status: ['Pending']    
    });

        //'title' field and autofill 'subject'
      this.assignmentForm.get('title')?.valueChanges.subscribe(title => {
        const match = Object.keys(this.courseMap).find(
          key => key.toLowerCase()=== title.toLowerCase()  
        );

        if (match){
          this.assignmentForm.patchValue ({ subject: this.courseMap[match]}); 
        }
          const subject = this.courseMap[title];
          if (subject) {
              this.assignmentForm.patchValue( {subject});
          }
        });

  }

  onSubmit() {
  if (this.assignmentForm.valid) {
    const formData = this.assignmentForm.value;

    if (this.isEditing && this.editingIndex !== null) {
      // Update the existing assignment
      this.assignments[this.editingIndex] = { ...formData };
      this.isEditing = false;
      this.editingIndex = null;
    } else {
      // create a new assignment
      this.assignments.push(formData);
    }

    // Default state 
    this.assignmentForm.reset({
      priority: 'Medium',
      status: 'Pending'
    });
  }
}
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

  removeAssignment(index: number): void{
      this.assignments.splice(index,1); //Delete function 

      if(this.isEditing && this.editingIndex === index){
          this.assignmentForm.reset({
            priority: 'Medium',
            status: 'Pending'
          });
          this.isEditing = false;
          this.editingIndex = null;


      }


  }

}


