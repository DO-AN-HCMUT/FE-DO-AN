import User from './user';

type Project = {
  _id: string;
  leaderID: string;
  memberIds: string[];
  maxTaskIndex: number;
  createdAt: string;
  name: string;
  key: string;
};

export type GetAllUserDto = (User & {
  isLeader: boolean;
})[];

export default Project;
