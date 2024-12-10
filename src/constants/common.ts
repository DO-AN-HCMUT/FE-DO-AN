import TaskStatusType, { TaskStatus } from '@/types/task-status';

export const TASK_STATUS_COLOR: { [key in TaskStatusType]: { backgroundColor: string; color: string } } = {
  [TaskStatus.TO_DO]: {
    backgroundColor: '#F0F0F0',
    color: '#777',
  },
  [TaskStatus.IN_PROGRESS]: {
    backgroundColor: '#5DABFF',
    color: '#0747A6',
  },
  [TaskStatus.DONE]: {
    backgroundColor: '#79F2C0',
    color: '#00875A',
  },
  [TaskStatus.OVERDUE]: {
    backgroundColor: '#FFC0CB',
    color: '#FF0000',
  },
};

export const COLOR_PAIRS = [
  {
    backgroundColor: '#1E88E5',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#43A047',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#FB8C00',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#F4511E',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#6D4C41',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#8E24AA',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#3949AB',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#E53935',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#00796B',
    color: '#FFFFFF',
  },
  {
    backgroundColor: '#5E35B1',
    color: '#FFFFFF',
  },
];
