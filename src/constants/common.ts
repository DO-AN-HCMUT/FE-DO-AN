import TaskStatusType from '@/types/task-status';

export const TASK_STATUS_COLOR: { [key in TaskStatusType]: { backgroundColor: string; color: string } } = {
  TO_DO: {
    backgroundColor: '#F0F0F0',
    color: '#888',
  },
  IN_PROGRESS: {
    backgroundColor: '#4C9AFF',
    color: '#0747A6',
  },
  DONE: {
    backgroundColor: '#79F2C0',
    color: '#00875A',
  },
  TO_FIX: {
    backgroundColor: '#ffa726',
    color: '#00875A',
  },
  FIXED: {
    backgroundColor: '#66bb6a',
    color: '#00875A',
  },
  TO_TEST: {
    backgroundColor: '#46b8ae',
    color: '#00875A',
  },
  TESTING: {
    backgroundColor: '#b8c91e',
    color: '#00875A',
  },
  TESTED: {
    backgroundColor: '#badb37',
    color: '#00875A',
  },
  ERROR: {
    backgroundColor: '#79F2C0',
    color: '#00875A',
  },
  URGENT: {
    backgroundColor: '#f02244',
    color: '#00875A',
  },
};
