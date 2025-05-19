import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormComponent, MatSnackBarModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent {
  tasks: Task[] = [];
  editingTask: Task | null = null;
  showForm = false;
  sortBy: string = 'added'; // <-- Add this

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar // <-- Add this
  ) {
    this.taskService.tasks$.subscribe((tasks) => (this.tasks = tasks));
  }

  openAddForm() {
    this.editingTask = null;
    this.showForm = true;
  }

  editTask(task: Task) {
    this.editingTask = { ...task };
    this.showForm = true;
  }

  onFormClose() {
    this.editingTask = null;
    this.showForm = false;
  }

  confirmDelete(task: Task) {
    if (confirm(`Delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id);
      const snack = this.snackBar.open('Task Deleted', 'Undo', {
        duration: 3000,
      });
      snack.onAction().subscribe(() => this.taskService.undoDelete());
    }
  }

  sortTasks() {
    if (this.sortBy === 'due') {
      this.tasks = [...this.tasks].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    } else if (this.sortBy === 'priority') {
      const order = { High: 1, Mid: 2, Low: 3 };
      this.tasks = [...this.tasks].sort(
        (a, b) => order[a.priority] - order[b.priority]
      );
    } else {
      this.tasks = [...this.tasks].sort((a, b) => a.id - b.id);
    }
  }

  toggleDone(task: Task) {
    this.taskService.updateTask({ ...task, done: !task.done });
  }
}
