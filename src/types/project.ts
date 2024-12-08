import User from './user';

type Project = {
  _id: string;
  leaderID: string;
  memberIds: string[];
  maxTaskIndex: number;
  createdAt: string;
  description: string;
  name: string;
  key: string;
};

export type GetProjectByIdDto = Project & {
  isMeLeader: boolean;
};

export type GetAllUserDto = (User & {
  isLeader: boolean;
})[];

export type GetAllProjectDto = (Project & {
  leader: User;
})[];

export default Project;
