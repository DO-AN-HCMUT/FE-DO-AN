import api from './api';

import Project from '@/types/project';
import Response from '@/types/response';

const BASE_URL = '/user';

const getMyProjects = async () => {
  return (await api.get<Response<Project[]>>(`${BASE_URL}/projects`)).data.payload;
};

const userService = { getMyProjects };

export default userService;
