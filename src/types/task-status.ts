export const TaskStatus = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
} as const;

type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export default TaskStatusType;
