import Project from './project';
import { TaskStatus } from './task-status';
import User from './user';

type Task = {
  _id: string;
  title: string;
  projectId: string;
  key: string;
  registeredMembers: User[];
  description?: string;
  status: keyof typeof TaskStatus;
  endDate?: string;
  createdAt?: string;
};

export type CreateTaskRequestDto = {
  title: string;
  registeredMembers?: string[];
  status?: keyof typeof TaskStatus;
  endDate?: string;
};

export type GetMyTaskDto = (Task & {
  project: Project;
})[];

export default Task;
