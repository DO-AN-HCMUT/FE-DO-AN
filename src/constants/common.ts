import TaskStatusType, { TaskStatus } from '@/types/task-status';

export const TASK_STATUS_COLOR: { [key in TaskStatusType]: { backgroundColor: string; color: string } } = {
  [TaskStatus.TO_DO]: {
    backgroundColor: '#F0F0F0',
    color: '#888',
  },
  [TaskStatus.IN_PROGRESS]: {
    backgroundColor: '#4C9AFF',
    color: '#0747A6',
  },
  [TaskStatus.DONE]: {
    backgroundColor: '#79F2C0',
    color: '#00875A',
  },
};
