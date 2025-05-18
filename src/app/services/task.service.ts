import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  get tasks(): Task[] {
    return this.tasksSubject.value;
  }

  addTask(task: Task) {
    this.tasksSubject.next([...this.tasks, { ...task, id: Date.now() }]);
  }

  updateTask(updated: Task) {
    this.tasksSubject.next(
      this.tasks.map((t) => (t.id === updated.id ? updated : t))
    );
  }
  lastDeleted: Task | null = null; // <-- Add this

  deleteTask(id: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (task) this.lastDeleted = task;
    this.tasksSubject.next(this.tasks.filter((t) => t.id !== id));
  }

  undoDelete() {
    if (this.lastDeleted) {
      this.addTask(this.lastDeleted);
      this.lastDeleted = null;
    }
  }
}
