import Project from './project';
import TaskStatusType from './task-status';
import User from './user';

type Task = {
  _id: string;
  title: string;
  projectId: string;
  key: string;
  registeredMembers: User[];
  description?: string;
  status: TaskStatusType;
  endDate?: string;
  createdAt?: string;
};

export type CreateTaskRequestDto = {
  title: string;
  registeredMembers?: string[];
  status?: TaskStatusType;
  endDate?: string;
};

export type GetMyTaskDto = (Task & {
  project: Project;
})[];

export default Task;
