type Project = {
  _id: string;
  leaderID: string;
  memberIds: string[];
  maxTaskIndex: number;
  createdAt: string;
  name: string;
  key: string;
};

export default Project;
