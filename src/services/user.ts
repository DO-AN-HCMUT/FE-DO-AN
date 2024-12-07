import api from './api';

import { GetAllProjectDto } from '@/types/project';
import Response from '@/types/response';

const BASE_URL = '/user';

const getMyProjects = async () => {
  return (await api.get<Response<GetAllProjectDto>>(`${BASE_URL}/projects`)).data.payload;
};

const userService = { getMyProjects };

export default userService;
