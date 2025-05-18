import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
export class TaskFormComponent implements OnInit {
  @Input() editTask: Task | null = null;
  @Output() formClose = new EventEmitter<void>();
  task: Task = this.getEmptyTask();

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    if (this.editTask) {
      this.task = { ...this.editTask };
    }
  }

  getEmptyTask(): Task {
    return {
      id: 0,
      title: '',
      dueDate: '',
      dueTime: '',
      priority: 'Mid',
      done: false,
    };
  }

  saveTask() {
    if (this.editTask) {
      this.taskService.updateTask(this.task);
    } else {
      this.taskService.addTask(this.task);
    }
    this.task = this.getEmptyTask();
    this.formClose.emit();
  }
}
