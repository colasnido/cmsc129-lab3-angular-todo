export interface Task {
  id: number;
  title: string;
  dueDate: Date | string;
  dueTime: string;
  priority: 'High' | 'Mid' | 'Low';
  done: boolean;
}
