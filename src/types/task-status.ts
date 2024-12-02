export const TaskStatus = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  TO_FIX: 'TO_FIX',
  FIXED: 'FIXED',
  TO_TEST: 'TO_TEST',
  TESTING: 'TESTING',
  TESTED: 'TESTED',
  ERROR: 'ERROR',
  URGENT: 'URGENT',
} as const;

type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export default TaskStatusType;
