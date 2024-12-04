export const TaskStatus = {
  TO_DO: 'TO DO',
  IN_PROGRESS: 'IN PROGRESS',
  DONE: 'DONE',
} as const;

type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

export default TaskStatusType;
